//index.js
const api = require('../../utils/API.js');
Page({
    onLoad: function (options) {
        api.request({
            url: '/form',
            method: "POST",
            data: {
               
            }
        }).then(respond => {
            console.log(respond)
        })
    },
})
