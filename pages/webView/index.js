// pages/webView/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webviewUrl:'',
    state:'',
    moban_id:'',
    album_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.state==3){
      var webviewUrl ='https://www.qlgbp.cn/admin/moban/index?state='+options.state+'&moban_id='+options.moban_id;
      this.setData({
        state: options.state,
        moban_id: options.moban_id,
        webviewUrl: webviewUrl
      })
    }else{
      var openid = wx.getStorageSync('openid');
      var webviewUrl = 'https://www.qlgbp.cn/admin/moban/index?state='+options.state+'&album_id='+options.album_id+'&openid='+openid;
      this.setData({
        state: options.state,
        album_id: options.album_id,
        webviewUrl: webviewUrl
      })
    }

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})