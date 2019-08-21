// pages/watch_form/watch_form.js
const app = getApp();
const api = require('../../utils/API.js');
var QRCode = require('../../utils/weapp-qrcode.js')
var qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduction:"我叫奥斯卡第八届阿卡时",
    user:null,
    is_create_qrcode:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //生成二维码事件
  create_qrcode(){
    this.setData({
      is_create_qrcode:1
    });
    qrcode = new QRCode('canvas', {
      // usingIn: this,
      text: "",
      // image: '/images/bg.jpg',
      width: 150,
      height: 150,
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    var value = (this.data.user.id)
    qrcode.makeCode(value.toString());
    console.log(this.data.user.id);
  },
  reset(){
    wx.navigateTo({
      url: '../form/write_form/write_form',
    });
  },
  clone(origin) {
    return Object.assign({}, origin);
  },
  //要发出请求获取自我表单内容，可以把用户的表单信息保存到全局变量里面
  onLoad: function (options) {
    //获取全局数据
    console.log("onload");
    this.setData({
      user: app.globalData.user
    })
    console.log(this.data.user);   //成功获取数据

  }
})