// pages/share/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    album_id:'',
    title:'',
    cover:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      album_id:options.album_id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var album_id=that.data.album_id;
    wx.request({
      url: app.globalData.base_url + '/share',
      data: {
        album_id: album_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       console.log(res)
       that.setData({
         title:res.data.data.title,
         cover:res.data.data.cover,
       })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var title = that.data.title;
    var cover=that.data.cover;
    var id = that.data.album_id;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: title,
      imageUrl:cover,
      path: '/pages/detail/index?id=' + id,
    }
  }

})