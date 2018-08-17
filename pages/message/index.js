// pages/message/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_length:0,
    id:'',
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    this.setData({
      id:id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      disabled: false
    })
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text
    })
  },
  leaveWord:function(e){
    var that=this;
    var message=e.detail.value.message;
    if(message==""){
      wx.showModal({
        title: '提示',
        content: '留言不能为空',
        showCancel: false,
      })
      return
    }
    that.setData({
      disabled: true
    })
    var id=that.data.id;
    wx.request({
      url: app.globalData.base_url + '/message',
      data: {
        openid: wx.getStorageSync('openid'),
        id: id,
        content:message,
      },
      success: function (res) {
        wx.navigateBack({
          
        })
      }
    })
  }

})