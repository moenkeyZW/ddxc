const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveAlbum: true,
    status: 0,
    other_list: '',
    openid: '',
    userInfo: '',
    curIndex: 0,
    self_list:'',
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
  onPullDownRefresh: function () {
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
    var status = that.data.status;
    var openid = that.data.openid
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
          other_list: res.data.other_list
        })
      }
    })
  },
  tabHandle: function(e) {
    const that = this
    const index = e.target.dataset.index;
    var openid = that.data.openid;
    var status=that.data.status;
    if (that.data.curIndex === index) return
    that.setData({
      curIndex: index,
    },()=>{
      if(index==0){

      }else{
        wx.request({
          url: app.globalData.base_url + '/see_dynamic',
          data: {
            openid: openid,
            status: status,
          },
          success: function (res) {
            console.log(res)
            that.setData({
              self_list: res.data.self_list,
            })

          }
        })
      }
    })
  },
  goMy: function() {
    wx.switchTab({
      url: '/pages/index/index?status=1',
    })
  },

  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/index?id=' + id,
    })
  },

})