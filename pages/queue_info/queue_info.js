// pages/queue_info/queue_info.js
const app = getApp();
const api = require('../../utils/API.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frontNumber: 1,
    expectedWaitTime:0,
    //排队部门
    dep:"",
    dict:{
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
      "YYB": "运营部"
    }
  },
  //点击刷新时间
  update() {
    //点击一次就向服务器发出请求获得数据
    this.get_queueinfo()

  },

  onLoad: function(options) {
    let that = this;
    api.request({
      method: "GET",
      url: "/v1/queuers",
      header: {
        'Authorization': app.globalData.Authorization
      }
    }).then(res => {
      if (res.statusCode == 404) {
        //没有加入队列
        //获取当前队列的等待人数
        this.get_queuenum();

      } else {
        //已经加入队列
        this.get_queueinfo();
      }
    }).catch(err => {
      //一般用不到
      console.log(err);
    })
  },
  get_queuenum() {
    let that=this;
    api.request({
      url: "/v1/queuers/number",
      method: "GET",
      header: {
        'Authorization': app.globalData.Authorization
      }
    }).then(res => {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: `当前队伍的等待人数为${res.data},您确定要进入排队？`,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            //进入队列
            api.request({
              url: "/v1/queuers",
              method: "POST",
              header: {
                'Authorization': app.globalData.Authorization
              }
            }).then(e=>{
              console.log(e);
              //把队列信息设置到本地
              that.setData({
                dep:that.data.dict[e.data.dep]
              })

            })
          } else if (res.cancel) {
            console.log('用户点击取消');
            wx.navigateBack({});
          }
        }
      })
    })
  },
  get_queueinfo(){
    let that=this;
    api.request({
      url:"/v1/queuers",
      method:"GET",
      header: {
        'Authorization': app.globalData.Authorization
      }
    }).then(res=>{
      console.log(res);
      that.setData({
        dep: that.data.dict[res.data.dep],
        frontNumber: res.data.frontNumber,
        expectedWaitTime: res.data.expectedWaitTime
      })
    })
  }
})