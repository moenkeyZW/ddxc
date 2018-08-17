const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveAlbum: true,
    status: 1,
    album_list: '',
    other_list: '',
    openid: '',
    userInfo: '',
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var status = that.data.status;
    if (status == 2) {
      var openid = that.data.openid
    } else {
      var openid = wx.getStorageSync('openid')
    }
    wx.request({
      url: app.globalData.base_url + '/see_album',
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
            album_list: res.data.list,
          })
        }
        if (res.data.status === 2) {
          that.setData({
            other_list: res.data.other_list,
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
  goDt: function() {
    var that = this;
    var status = that.data.status;
    var openid = that.data.openid
    wx.redirectTo({
      url: '/pages/album/index?status=' + status + '&openid=' + openid,
    })
  },
  goTrend: function() {
    wx.redirectTo({
      url: '/pages/album/index',
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
  // 重制
  goUpPhoto: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/upPhotos/index?id=' + id,
    })
  },
  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  },
  moreOperate: function(e) {
    var that = this;
    var i = e.currentTarget.dataset.index;
    var list = that.data.album_list;
    list[i].bool = !list[i].bool;
    that.setData({
      album_list: list,
    })
  },
  deleteItem: function(e) {
    console.log(e)
    var that = this;
    var album_list = that.data.album_list;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    album_list[index].bool = !album_list[index].bool;
    wx.showModal({
      content: '确定删除该影集？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.base_url + '/del_album',
            data: {
              id: id
            },
            success: function(res) {
              album_list.splice(index, 1);
              that.setData({
                album_list: album_list,
              });
            }
          })
        } else if (res.cancel) {
          that.setData({
            album_list: album_list,
          })
        }
      }
    })
  },
  onShareAppMessage: function(res) {
    var that = this;
    console.log(res)
    var id = res.target.dataset.id;
    var cover = res.target.dataset.cover;
    var title = res.target.dataset.title;
    var i = res.target.dataset.index;
    var list = that.data.album_list;
    list[i].bool = !list[i].bool;
    that.setData({
      album_list: list,
    })

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