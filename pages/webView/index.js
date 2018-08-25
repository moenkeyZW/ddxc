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
    cover: '',
    templet:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      state:options.state,
      album_id: options.album_id
    })
    if(options.moban_id){
      this.setData({
        moban_id:options.moban_id
      })
    }
    // if(options.state==3){
    //   var webviewUrl ='https://www.qlgbp.cn/admin/moban/index?state='+options.state+'&moban_id='+options.moban_id;
    //   this.setData({
    //     state: options.state,
    //     moban_id: options.moban_id,
    //     webviewUrl: webviewUrl
    //   })
    // }else{
    //   var openid = wx.getStorageSync('openid');
    //   var webviewUrl = 'https://www.qlgbp.cn/admin/moban/index?state='+options.state+'&album_id='+options.album_id+'&openid='+openid;
    //   this.setData({
    //     state: options.state,
    //     album_id: options.album_id,
    //     webviewUrl: webviewUrl
    //   })
    // }

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var state=that.data.state;
    var album_id = that.data.album_id;
    var openid = wx.getStorageSync('openid');
    if(state==3){
      var moban_id=that.data.moban_id;
      var webviewUrl = 'https://www.qlgbp.cn/admin/moban/index?state=' + state + '&moban_id=' + moban_id+'&album_id=' + album_id;
      that.setData({
        webviewUrl: webviewUrl
      })
    }else{
      var webviewUrl = 'https://www.qlgbp.cn/admin/moban/index?state=' + state + '&album_id=' + album_id + '&openid=' + openid;
      that.setData({
         webviewUrl: webviewUrl
      })
    }
  },

})