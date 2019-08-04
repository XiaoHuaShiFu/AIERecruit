//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    is_sign_up:1 //有无报名
  },
  onLoad: function () {
  
  },
  to_about_us:function(){
    wx.navigateTo({
      url: '../about_us/about_us',
    })
  },
  to_form: function () {
    wx.navigateTo({
      url: '../form/form',
    })
  },
  to_result: function () {
    wx.navigateTo({
      url: '../result/result',
    })
  },
  to_watch_form: function () {
    wx.navigateTo({
      url: '../watch_form/watch_form',
    })
  },
  to_queue_info:function(){
    wx.navigateTo({
      url: '../queue_info/queue_info',
    })
  }
})
