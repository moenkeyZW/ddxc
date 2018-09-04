// pages/detail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveMes: false,
    message: '',
    list: '',
    id: '',
    msgid: '',
    isZan: '',
    openid: '',
    equ:'',
    status:'',
    coverImg:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id;
    that.setData({
      id: id
    })
    if(options.status){
      that.setData({
        status:options.status
      })
    }
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (wx.getStorageSync('openid')) {
      var openid = wx.getStorageSync('openid')
      that.setData({
        openid: openid
      })
    } else {
      openid = 0;
    }
    var id = that.data.id
    wx.request({
      url: app.globalData.base_url + '/details',
      data: {
        openid: openid,
        id: id,
      },
      success: function(res) {
        console.log(res)
        that.setData({
          list: res.data.list,
          isZan: res.data.zan,
        })
        if (wx.getStorageSync('openid') === that.data.list.openid){
          that.setData({
            equ:false
          })
        }else{
          that.setData({
            equ: true
          })
        }
        if (res.data.message == "") {
          that.setData({
            haveMes: false,
          })
        } else {
          that.setData({
            haveMes: true,
            message: res.data.message,
          })
        }
      }
    })
  },
  preview: function(e) {
    var that = this;
    var album_id = that.data.id
    if (wx.getStorageSync('openid')) {
      if (wx.getStorageSync('openid') === that.data.list.openid){
        wx.navigateTo({
          url: '/pages/webView/index?state=1&&album_id=' + album_id,
        })
      }else{
        wx.navigateTo({
          url: '/pages/webView/index?state=2&&album_id=' + album_id,
        })
      }
    } else {
      app.onLogin();
    }
  },
  goMy: function () {
    wx.switchTab({
      url: '/pages/index/index?status=1',
    })
  },
  // 点头像
  goToAlbum: function(e) {
    var that = this;
    var openid = that.data.list.openid;
    if (wx.getStorageSync('openid')) {
      if (wx.getStorageSync('openid') === openid) {
        var status=1;
        wx.switchTab({
          url: '/pages/index/index?status=' + status + '&openid=' + openid,
        })
      } else {
        var status = 2;
        wx.navigateTo({
          url: '/pages/other/index?status=' + status + '&openid=' + openid
        })
      }
    }else{
      app.onLogin();
    }
  },
  clickZan: function(e) {
    var that = this;
    var id = that.data.id
    if (wx.getStorageSync('openid')) {
      wx.request({
        url: app.globalData.base_url + '/zan',
        data: {
          openid: wx.getStorageSync('openid'),
          id: id,
        },
        success: function(res) {
          that.setData({
            isZan: 1,
            'list.praise': parseInt(that.data.list.praise) + 1
          })
        }
      })
    } else {
      app.onLogin();
      if (e.detail.errMsg == "getUserInfo:ok") {
        wx.request({
          url: app.globalData.base_url + '/zan',
          data: {
            openid: wx.getStorageSync('openid'),
            id: id,
          },
          success: function(res) {
            that.setData({
              isZan: 1,
              'list.praise': parseInt(that.data.list.praise) + 1
            })
          }
        })
      }
    }

  },
  writeMes: function(e) {
    var that = this;
    var id = that.data.id
    if (wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/message/index?id=' + id,
      })
    } else {
      app.onLogin();
      if (e.detail.errMsg == "getUserInfo:ok") {
        wx.navigateTo({
          url: '/pages/message/index?id=' + id,
        })
      }
    }
  },
  makeMovie: function(e) {
    if (wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/upPhotos/index',
      })
    } else {
      app.onLogin();
      if (e.detail.errMsg == "getUserInfo:ok") {
        wx.navigateTo({
          url: '/pages/upPhotos/index',
        })
      }
    }

  },
  reply: function(e) {
    var that = this;
    var i = e.currentTarget.dataset.index;
    var msgid = e.currentTarget.dataset.msgid;
    var message = that.data.message;
    message[i].bool = !message[i].bool;
    that.setData({
      message: message,
      msgid: msgid
    })
  },

  replyContent: function(e) {
    var that = this;
    var id = that.data.id;
    var msgid = that.data.msgid;
    var reply = e.detail.value.reply;
    wx.request({
      url: app.globalData.base_url + '/reply',
      data: {
        openid: wx.getStorageSync('openid'),
        id: id,
        message_id: msgid,
        content: reply
      },
      success: function(res) {
        that.onShow();
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    var coverImg=that.data.list.coverimg;
    var id = that.data.id;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '我发布了一个精美相册，快来打开看看吧！',
      imageUrl: coverImg,
      path: '/pages/detail/index?status=2&&id=' + id,
    }
  }
})