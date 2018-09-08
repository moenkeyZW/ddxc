// pages/share/index.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    album_id: '',
    coverImg: '',
    cover:'',
    title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    const album_id = options.album_id;
    that.setData({
      album_id: album_id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var album_id = that.data.album_id;
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
          coverImg: res.data.data.coverimg,
          cover:res.data.data.cover,
          title:res.data.data.title
        })
      }
    })
  }, 


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    var title = that.data.title;
    var coverImg = that.data.coverImg;
    var cover = that.data.cover;
    var id = that.data.album_id;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: title,
      imageUrl: cover,
      path: '/pages/detail/index?status=2&&id=' + id,
    }
  }

})