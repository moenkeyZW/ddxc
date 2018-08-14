// pages/message/index.js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_length: 0,
    showDis: true,
    cover: '',
    percent: 0,
    left: -2,
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var percent = that.data.percent;
    var left = that.data.left;
    var timer = setInterval(function() {
      percent++;
      left++;
      if (percent >= 100) {
        clearInterval(timer);
        that.setData({
          showDis: false,
        })
      }
      that.setData({
        percent: percent,
        left: left,
      })

    }, 28)
    wx.request({
      url: app.globalData.base_url + '/fabu_album',
      data: {
        openid: wx.getStorageSync('openid'),
      },
      success: function (res) {
        console.log(res)
        that.setData({
          id: res.data.list.id,
          cover: res.data.list.cover
        })
      }
    })
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

  },
  pubPrev:function(){
    var that=this;
    var album_id=that.data.id;
    wx.navigateTo({
      url: '/pages/webView/index?state=4&&album_id='+album_id,
    })
  },
  bindText: function(e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text
    })
  },
  inputTitle: function(e) {
    console.log(e)
  },
  publish: function(e) {
    var that = this;
    const id = that.data.id;
    var title = e.detail.value.title;
    if (that.data.percent >= 100) {
      if (e.detail.value.title === "") {
        wx.showModal({
          title: '提示',
          content: '标题未填写',
          showCancel: false,
        })
        return
      }
      var depict = e.detail.value.message;
      wx.request({
        url: app.globalData.base_url + '/fabu_success',
        data: {
          id: id,
          title: title,
          depict: depict,
        },
        success: function(res) {
          wx.redirectTo({
            url: '/pages/album/index',
          })
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请等待',
        showCancel: false,
      })
    }
  }

})