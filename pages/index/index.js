//index.js
//获取应用实例
const app = getApp();
const api = require('../../utils/API.js');
Page({
  data: {
    is_sign_up: 0 //有无报名
  },
  onLoad: function() {
    this.setData({
      is_sign_up: app.globalData.is_sign_up
    })
  },
  to_about_us: function() {
    wx.navigateTo({
      url: '../about_us/about_us',
    })
  },
  to_form: function() {
    wx.navigateTo({
      url: '../form/write_form/write_form',
    })
  },
  to_result: function() {
    wx.navigateTo({
      url: '../result/result',
    })
  },
  to_watch_form: function() {
    wx.navigateTo({
      url: '../watch_form/watch_form',
    })
  },
  to_queue_info: function() {
    wx.navigateTo({
      url: '../queue_info/queue_info',
    })
  },
  onLoad() {
    //登录   尝试获取用户信息
    let that=this;
    wx.login({
      success(res) {
        console.log(res.code);
        if (res.code) {
          //发起网络请求
          api.request({
            url: '/v1/tokens/form',
            method: "POST",
            data: {
              code: res.code,
            }
          }).then(res => {
            if (res.statusCode==201){
              api.setUser(res.data);
              app.globalData.Authorization = res.header.Authorization;
              console.log(app.globalData.user.works)
              console.log(res);
              console.log(app.globalData.Authorization);
              if(app.globalData.user.id!=null){
                that.setData({
                  is_sign_up:1
                })
              }
            } else if (res.statusCode==404){
              console.log("404");
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onShow(){
    console.log("onshow");
    let that = this;
    wx.login({
      success(res) {
        console.log(res.code);
        if (res.code) {
          //发起网络请求
          api.request({
            url: '/v1/tokens/form',
            method: "POST",
            data: {
              code: res.code,
            }
          }).then(res => {
            if (res.statusCode == 201) {
              api.setUser(res.data);
              app.globalData.Authorization = res.header.Authorization;
              // console.log(res);
              console.log(app.globalData.Authorization);
              if (app.globalData.user.id != null) {
                that.setData({
                  is_sign_up: 1
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onReady(){
    console.log("onready");
  }
})