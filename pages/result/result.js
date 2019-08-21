// pages/result/result.js
const app = getApp();
const api = require('../../utils/API.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    context: "面试官们正在全力面试，请您耐心等待面试结果"
  },

  onLoad: function(options) {
    let that=this;
    if (app.globalData.user.id) {
      //已经报名
      api.request({
        url: "/v1/results",
        method: "GET",
        header: {
          'Authorization': app.globalData.Authorization
        },
      }).then(res => {
        console.log(res);
        //如果状态信息正确，则获取结果并且设置给context
        if (res.statusCode==404){
          //有面试结果  

        }
      }).catch(err=>{
        console.log(err);
      })
    } else {
      //没有报名
      wx.showModal({
        title: '提示',
        content: '您还没有报名',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack({})
          }
        }
      })
    }
  },
})