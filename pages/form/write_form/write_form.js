// pages/watch_form/watch_form.js
const app = getApp();

const api = require('../../../utils/API.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    //是否报名，默认没有   更具是否报名来发出填写表单的请求还是修改表单的请求
    is_sign_up: 0,
    //是否选择照片
    is_choose_avater: false,
    //+  指示处
    work_num: 0,
    //头像
    avatar: "",
    //自我介绍
    introduction: "我叫奥斯卡第八届阿卡时",
    items: [{
      text: "姓名：",
      name: "name",
      input: ""
    }, {
      text: "性别：",
      name: "gender",
      input: ""
    }, {
      text: "学院：",
      name: "college",
      input: ""
    }, {
      text: "专业：",
      name: "major",
      input: ""
    }, {
      text: "电话：",
      name: "phone",
      input: ""
    }, {
      text: "第一志愿部门：",
        name: "firstDep",
      input: ""
    }, {
      text: "第二志愿部门：",
        name: "secondDep",
      input: ""
    }],
    work_items: [{
      url: "",
      id: "one"
    }, {
      url: "",
      id: "one"
    }, {
      url: "",
      id: "one"
    }, {
      url: "",
      id: "three"
    }, {
      url: "",
      id: "three"
    }, {
      url: "",
      id: "three"
    }],
    dict: {
      "自科部": "ZKB",
      "办公室": "BGS",
      "社科部": "SKB",
      "财务部": "CWB",
      "竞赛部": "JSB",
      "宣传部": "XCB",
      "项目部": "XMB",
      "外联部": "WLB",
      "策划部": "CHB",
      "新闻部": "XWB",
      "运营部": "YYB",
      "男": "M",
      "女": "W"
    }
  },
  //选择头像
  choose_avator() {
    let that = this;
    wx.chooseImage({
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(res);
        that.setData({
          avatar: tempFilePaths[0]
        })
      }
    })
  },
  //选择头像之后可以删除
  delete_avator() {
    this.setData({
      avatar: ""
    })
  },
  //选择作品照片
  choose_work() {
    let that = this;
    let index = that.data.work_num;
    wx.chooseImage({
      success: function(res) {
        var url = "work_items[" + index + "].url";
        that.setData({
          [url]: res.tempFilePaths[0],
          work_num: that.data.work_num + 1
        })
      }
    })
    console.log(this.data.work_items);
  },
  //删除作品
  delete_work(e) {
    console.log(e.target.dataset.index);
    var index = e.target.dataset.index;
    //如果删除的是最后一个作品
    if (index == this.data.work_num - 1) {
      let url = "work_items[" + index + "].url";
      this.setData({
        [url]: "",
        work_num: this.data.work_num - 1
      })
    } else {
      //需要排序
      var length = this.data.work_num;
      console.log(length);
      for (let i = index; i < length - 1; i++) {
        let url = "work_items[" + i + "].url";
        this.setData({
          [url]: this.data.work_items[i + 1].url
        })
      }
      //一定要注意字符串的加减法
      var temp = length - 1;
      let url = "work_items[" + temp + "].url";
      this.setData({
        [url]: "",
        work_num: this.data.work_num - 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //创建表单
  create_form(e){
    console.log("foem");
    let all = e.detail.value;
    let that = this;
    console.log(all);
    //判断用户填写情况
    if(!this.check_form(all)) return ;
    let sex = that.data.dict[all.gender];
    let fdep = that.data.dict[all.firstDep];
    let sdep = that.data.dict[all.secondDep];
    wx.login({
      success(res) {
        console.log(res.code);
        if (res.code) {
          //
          //发起网络请求
          api.request({
            url: '/v1/forms',
            method: "POST",
            data: {
              code: res.code,
              name: all.name,
              gender: sex,
              college: all.college,
              major: all.major,
              phone: all.phone,
              firstDep: fdep.toUpperCase(),
              secondDep: sdep.toUpperCase(),
              introduction: all.introduction
            }
          }).then(res => {
            console.log(res);
            //状态码是201 正确返回的时候
            if (res.statusCode == 201) {
              app.globalData.is_sign_up = 1;
              app.globalData.id = res.data.id;
              //获取  token
              that.getToken();
            }else {
              //其他

            }
            
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  //修改表单
  reset_form(e){
    console.log("reset");
    console.log(e);
    let that=this;
    let all = e.detail.value;
    if(!this.check_form(all)) return ;
    let sex = that.data.dict[all.gender];
    let fdep = that.data.dict[all.firstDep];
    let sdep = that.data.dict[all.secondDep];
    console.log(app.globalData.Authorization);
    api.request({
      url:"/v1/forms",
      method:"PUT",
      header:{
        'Authorization': app.globalData.Authorization
      },
      data:{
        name: all.name,
        gender: sex,
        college: all.college,
        major: all.major,
        phone: all.phone,
        introduction: all.introduction
      }
    }).then(res=>{
        console.log(res);
        if(res.statusCode==200){
          //提交头像
          that.submit_avatar();
          //提交作评
           that.submit_works();
          //时候处理
          wx.showLoading({
            title: '提交中',
          })
          setTimeout(function () {
            wx.hideLoading();
            var pages = getCurrentPages(); // 当前页面
            var beforePage = pages[pages.length - 2]; // 前一个页面
            console.log(pages);
            // console.log("beforePage");
            // console.log(beforePage);
            wx.navigateBack({
              success: function () {
                beforePage.onLoad(); // 执行前一个页面的onLoad方法
              }
            });
          }, 2000)
        }
    }).catch(err=>{
      consolr.log(err);
    })
  },
  formSubmit(e) {
   //注册  
   if(!this.data.user) this.create_form(e);
   //登录
    else{
      this.reset_form(e);
    }
  },
  submit_works() {
    let that = this;
    let length = that.data.work_num;
    if (length == 0) return;
    
    if(!that.data.is_sign_up){
      //创建作品
      for (let i = 0; i < length; i++) {
        api.uploadFile({
          url: '/v1/forms/works',
          filePath: that.data.work_items[i].url,
          header: {
            'Authorization': app.globalData.Authorization
          },
          name: 'work',
          method: "POST"
        }).then(res => {
          console.log(res);
          if (res.statusCode == 201) {
            app.globalData.user.works[i] = res.data.works;
          }
        });
      }
    }else{
      //修改作品
      console.log("修改作评")
      for (let i = 0; i < length; i++) {
        if (that.data.work_items[i].url == app.globalData.user.works[i].url) continue;
        let wid=app.globalData.user.works[i].id;
        let url = `/v1/forms/works/${wid}/u`;
        console.log(url);
        api.uploadFile({
          url: url,
          filePath: that.data.work_items[i].url,
          header: {
            'Authorization': app.globalData.Authorization
          },
          name: 'work',
          method: "POST"
        }).then(res => {
          console.log(res);
          if (res.statusCode == 201) {
            app.globalData.user.works[i] = res.data.works;
          }
        }).catch(err=>{
          console.log(err)
        });
      }
    }
  
  },
  submit_avatar() {
    console.log("submit");
    //要上传头像照片    要上传作品照片
    let that = this;
    //创建照片
    if(!this.data.user){
      if (!that.data.avater) {
        wx.showModal({
          title: '提示',
          content: '请提交个人照片'
        });
      }
      api.uploadFile({
        url: '/v1/forms/avatar',
        filePath: that.data.avatar,
        header: {
          'Authorization': app.globalData.Authorization
        },
        name: 'avatar',
        method: "POST"
      }).then(res => {
        console.log(res);
        if (res.statusCode == 201) {
          app.globalData.user.avatar = res.data.avatar;
        }
      });
    }else{
      //修改照片
      if (that.data.avatar==app.globalData.user.avatar) return ;
      console.log("修改找破案")
      api.uploadFile({
        url: '/v1/forms/avatar/u',
        filePath: that.data.avatar,
        header: {
          'Authorization': app.globalData.Authorization
        },
        name: 'avatar',
        method:"POST"
      }).then(res => {
        console.log(res);
        if (res.statusCode == 200) {
          app.globalData.user.avatar = res.data.avatar;
        }
      })
    }
  },
  //扩展user.works对象使其变为长度为6 的数组
  expand_works(){
    var len = app.globalData.user.works.length ,that=this;
    if(len==0) return ;
    for (let i = 0; i < len; i++){
      let work="work_items["+i+"].url";
      that.setData({
        [work]:that.data.user.works[i].url
      })
    }
  },
  expand_input(){
    for(let i=0;i<7;i++){
      let pro=this.data.items[i].name;
      let input="items["+i+"].input"
      this.setData({
        [input]: this.data.user[pro]
      })
      console.log(this.data.items)
    }
  },
  //要发出请求获取自我表单内容，可以把用户的表单信息保存到全局变量里面
  onLoad: function(options) {
    console.log("write_sds");
    //第一，判断是否报名，报了名的执行
    if (app.globalData.user.id) {
      this.setData({
        user: app.globalData.user,
        work_num: app.globalData.user.works.length,
        avatar: app.globalData.user.avatar,
        is_sign_up:1
      })
      this.expand_works();
      this.expand_input()
    }else {
      //没有报名

    }
  
  },
  secondcome() {
    console.log("secondcome");
    console.log(this.data.work_items)
  },
  getToken() {
    let that = this;
    wx.login({
      success(e) {
        console.log(e.code);
        if (e.code) {
          //发起网络请求
          api.request({
            url: '/v1/tokens/form',
            method: "POST",
            data: {
              code: e.code,
            }
          }).then(res => {
            console.log(res);
            if (res.statusCode == 201) {
              api.setUser(res.data);
              //获取token
              app.globalData.Authorization = res.header.Authorization;
              //提交照片
              that.submit_avatar();
              //提交作品
              that.submit_works();
              console.log(res);
              console.log(app.globalData.Authorization);
              if (app.globalData.user.id != null) {
                that.setData({
                  is_sign_up: 1
                })
              }
              wx.showLoading({
                title: '提交中',
              })
              setTimeout(function () {
                wx.hideLoading();
                var pages = getCurrentPages(); // 当前页面
                var beforePage = pages[pages.length - 2]; // 前一个页面
                wx.navigateBack({
                  success: function () {
                    beforePage.onLoad(); // 执行前一个页面的onLoad方法
                  }
                });
              }, 2000)     
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  //检查用户填写的表单
  check_form(e) {
    if (!e.name) {
      wx.showModal({
        title: '提示',
        content: '请填写名字'
      })
      return 0;
    } else if (!e.college) {
      wx.showModal({
        title: '提示',
        content: '请填写所属学院'
      })
      return 0;
    } else if (!e.major) {
      wx.showModal({
        title: '提示',
        content: '请填写专业'
      })
      return 0; 
    } else if (!this.data.dict[e.firstDep]) {
      wx.showModal({
        title: '提示',
        content: '该第一志愿部门不存在'
      })
      return 0; 
    } else if (!e.firstDep) {
      wx.showModal({
        title: '提示',
        content: '请填写第一志愿部门'
      })
      return 0; 
    } else if (!e.secondDep) {
      wx.showModal({
        title: '提示',
        content: '请填写第二志愿部门'
      })
      return 0; 
    } else if (!this.data.dict[e.secondDep]) {
      wx.showModal({
        title: '提示',
        content: '该第二志愿部门不存在'
      })
      return 0; 
    } else if (!e.gender || (e.gender != '男' && e.gender != '女')) {
      wx.showModal({
        title: '提示',
        content: '请填写性别（男或女）'
      })
      return 0; 
    } else if (!e.phone) {
      wx.showModal({
        title: '提示',
        content: '请填写电话号码'
      })
      //检验电话号码的格式
      return 0; 
    } else if (!e.introduction) {
      wx.showModal({
        title: '提示',
        content: '请填写个人简介'
      })
      return 0; 
    } else if (!this.data.avatar) {
      wx.showModal({
        title: '提示',
        content: '请选择个人照片'
      })
      return 0; 
    }else return 1;
  }
})