// pages/detail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveMes:false,
    message:'',
    list:'',
    id:'',
    msgid:'',
    isZan:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id=options.id;
    that.setData({
      id:id
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
    var that=this;
    var id=that.data.id
    wx.request({
      url: app.globalData.base_url + '/details',
      data: {
        openid: wx.getStorageSync('openid'),
        id: id,
      },
      success: function (res) {
        that.setData({
          list: res.data.list,
        })
        if (res.data.message == "") {
          that.setData({
            haveMes: false
          })
        } else {
          that.setData({
            haveMes: true,
            message: res.data.message,
            isZan:res.data.zan
          })
        }
      }
    })
  },
  clickZan:function(e){
    var that = this;
    var id = that.data.id
    wx.request({
      url: app.globalData.base_url + '/zan',
      data: {
        openid: wx.getStorageSync('openid'),
        id: id,
      },
      success: function (res) {
        that.setData({
          isZan:1,
          'list.praise': parseInt(that.data.list.praise)+1
        })
      }
    })
  },
  writeMes:function(){
    var that=this;
    var id=that.data.id
    wx.navigateTo({
      url: '/pages/message/index?id='+id,
    })
  },
  makeMovie:function(){
    wx.navigateTo({
      url: '/pages/upPhotos/index',
    })
  },
  reply:function(e){
    console.log(e)
    var that = this;
    var i = e.currentTarget.dataset.index;
    var msgid = e.currentTarget.dataset.msgid;
    var message = that.data.message;
    message[i].bool = !message[i].bool;
    that.setData({
      message: message,
      msgid:msgid
    })
  },

  replyContent:function(e){
    var that=this;
    var id=that.data.id;
    var msgid=that.data.msgid;
    var reply=e.detail.value.reply;
    wx.request({
      url: app.globalData.base_url + '/reply',
      data: {
        openid: wx.getStorageSync('openid'),
        id: id,
        message_id:msgid,
        content:reply
      },
      success: function (res) {
        that.onShow();
      }
    })
  },
})