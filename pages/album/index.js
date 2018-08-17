//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: '',
    trend_list: '',
    status: 1,
    self_list: '',
    userInfo: '',
    openid: '',
  },

  onLoad: function(options) {
    if (options.status) {
      this.setData({
        status: options.status
      })
    }
    if (options.openid) {
      this.setData({
        openid: options.openid
      })
    }
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onShow: function() {
    var that = this;
    var userInfo = app.globalData.userInfo;
    if (!app.globalData.userInfo) {
      app.onRefresh(function(res) {
        that.setData({
          userInfo: app.globalData.userInfo,
        })
      });
    } else {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
    }
    var status = that.data.status;
    if (status == 2) {
      var openid = that.data.openid
    } else {
      var openid = wx.getStorageSync('openid')
    }
    wx.request({
      url: app.globalData.base_url + '/see_dynamic',
      data: {
        openid: openid,
        status: status,
      },
      success: function(res) {
        console.log(res)
        that.setData({
          status: res.data.status,
          userInfo: res.data.info,
        })
        if (res.data.status === 1) {
          that.setData({
            trend_list: res.data.list,
          })
        }
        if (res.data.status === 2) {
          that.setData({
            self_list: res.data.self_list,
          })
        }
      }
    })
  },
  goMy: function() {
    wx.reLaunch({
      url: '/pages/index/index?status=1',
    })
  },
  goYj: function() {
    var that = this;
    var status = that.data.status;
    var openid = that.data.openid
    wx.redirectTo({
      url: '/pages/index/index?status=' + status + '&openid=' + openid,
    })
  },
  goAlbum: function() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  getUserInfo: function(e) {
    app.onLogin();
    var that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.navigateTo({
        url: '/pages/upPhotos/index',
      })
    }
  },
  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  },
})