// pages/message/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_length:0,
    id:''
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
  
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text
    })
  },
  leaveWord:function(e){
    console.log(e)
    var that=this;
    var message=e.detail.value.message;
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