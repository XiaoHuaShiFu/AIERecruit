const responseCode = require('../common/ResponseCode.js');
const api = require('/API.js');

module.exports = {
    login: login
}

/**
 * 登录，会返回状态码
 * 成功会保存用户信息
 * 
 * author：xhsf
 */
function login() {
    return new Promise(function(resolve) {
        wx.login({
            success: function(res) {
                let app = getApp();
                let statusCode;
                if (res.code) {
                    api.request({
                        url: '/user/login.do',
                        method: "POST",
                        data: {
                            code: res.code
                        }
                    }).then(respond => {
                        statusCode = respond.data.status;
                        //登录成功，保存用户信息
                        if (statusCode == responseCode.SUCCESS) {
                            app.globalData.user = respond.data.data;
                            resolve(statusCode);
                        }
                        //其他情况交给上层去处理
                        else {
                            resolve(statusCode);
                        }
                    });
                }
                //其他情况交给上层去处理
                else {
                    resolve(statusCode);
                }
            }
        })
    })
}