module.exports = {
    showModal: showModal
}

/**
 * 一些提示的组件
 */
function showModal(content) {
    wx.showModal({
        showCancel: false,
        content: content
    })
}