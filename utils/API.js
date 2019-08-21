const jsonUtils = require('/JsonUtils.js');
module.exports = {
  request: request,
  uploadFile: uploadFile,
  setUser: setUser
}

/**
    * 封装wx.request,在要使用wx.request的地方请使用这个
    * 示例：
    * app.request({
    url: '/user/update_information.do',
    method: "POST",
    data: {
    fullName: e.detail.value.fullName,
    }
    }).then(respond=>{
    console.log(respond)
    })
    */
function request(rquestParams) {
  let app = getApp();
  if (!rquestParams.url) return;
  var header = {
    'content-type': 'application/x-www-form-urlencoded'
  };
  if (rquestParams.header) {
    header = Object.assign(header, rquestParams.header);
  }
  let cookie = app.globalData.cookie;
  if (cookie != undefined) {
    header = Object.assign(header, {
      'cookie': cookie
    });
  };
  let method = rquestParams.method || "GET";
  let data = jsonUtils.trimObject(rquestParams.data);
  let url = app.globalData.api + rquestParams.url;
  if (method.toUpperCase() == "PUT") {
    let other = jsonUtils.connect_data(data);
    url+=other;
  }
  return new Promise((resolve,reject)=>{
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (cookie === undefined) {
          app.globalData.cookie = res.header["Set-Cookie"];
        }
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
/**
 * 封装wx.uploadFile接口上传文件
 */
function uploadFile(rquestParams) {
  let app = getApp();
  if (!rquestParams.url) return;
  var header = {
    'content-type': 'application/x-www-form-urlencoded'
  };
  if (rquestParams.header){
    header = Object.assign(header, rquestParams.header);
  }
  console.log(header);
  let cookie = app.globalData.cookie;
  if (cookie) {
    header = Object.assign(header, {
      'cookie': cookie
    });
  };
  let method = rquestParams.method || "GET";
  let formData = jsonUtils.trimObject(rquestParams.formData);
  let url = app.globalData.api + rquestParams.url;
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      url: url,
      filePath: rquestParams.filePath,
      name: rquestParams.name,
      header: header,
      formData: formData,
      success: (res) => {
        res.data = JSON.parse(res.data);
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

// 设置用户信息  全局     8/13  
function setUser(e) {
  let app = getApp();
  let dict={
    "ZKB": "自科部",
    "BGS": "办公室",
    "SKB": "社科部",
    "CWB": "财务部",
    "JSB": "竞赛部",
    "XCB": "宣传部",
    "XMB": "项目部",
    "WLB": "外联部",
    "CHB": "策划部",
    "XWB": "新闻部",
    "YYB": "运营部",
    "W":"女",
    "M":"男"
  }
  app.globalData.user.id = e.id;
  app.globalData.user.name = e.name;
  app.globalData.user.avatar = e.avatar;
  app.globalData.user.college = e.college;
  app.globalData.user.firstDep = dict[e.firstDep];
  app.globalData.user.introduction = e.introduction;
  app.globalData.user.gender = dict[e.gender];
  app.globalData.user.major = e.major;
  app.globalData.user.secondDep =dict[e.secondDep];
  app.globalData.user.phone = e.phone;
  if (e.works) app.globalData.user.works = [...e.works];
}