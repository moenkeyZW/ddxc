var app = getApp();

Page({
  data: {
    clickId: -1,
    mold_list: ['风景', '儿童', '经典', '青春', '爱情', '心情', ],
    chooseId:-1,
    cor:'#FA7180',
    moban_id:'',
    hot_list:'',
    showHot:true,
    selectedId:'',
    album_id:'',
  },
  onLoad: function (options) {
    var that=this;
    var moban_id=options.moban_id;
    that.setData({
      moban_id:moban_id,
      selectedId:moban_id
    })
    if (options.album_id) {
      that.setData({
        album_id: options.album_id
      })
    }
  },
  onShow: function () {
    var that=this;
    var moban_id=that.data.moban_id;
    wx.request({
      url: app.globalData.base_url + '/moban_list',
      data: {
        moban_id: moban_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          hot_list:res.data.remen,
          selectedId: res.data.select_moban.moban_id,
        })
      }
    })
  },
  previewMuban: function (e) {
    var moban_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/webView/index?state=3&&moban_id=' + moban_id,
    })
  },
  hot:function(){
    var that = this;
    that.onShow();
    that.setData({
      clickId: -1,
      cor: '#FA7180',
      showHot:true,
      chooseId: -1,
    })
  },

  qita:function(e){
    var that = this;
    var id = e.currentTarget.dataset.index;
    var moban_id = that.data.moban_id;
    wx.request({
      url: app.globalData.base_url + '/moban_lable',
      data: {
        type:id,
        moban_id: moban_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          selectedId: res.data.select_moban.moban_id,
          clickId:-1,
          hot_list: res.data.list,
          chooseId: id,
          showHot: false,
          cor: '#000000',
        })
      }
    })
  },
  chooseMuban: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    var moban_id = e.currentTarget.dataset.id;
    that.setData({
      clickId: id,
      moban_id:moban_id,
      selectedId:-1,
    })
  },
  saveFile:function(){
    var that=this;
    var moban_id=that.data.moban_id;
    var album_id = that.data.album_id;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    if (prevPage.route == "pages/upPhotos/index") {
      prevPage.setData({
        'currently.moban_id': moban_id,
      })
      wx: wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.request({
        url: app.globalData.base_url + '/save_moban',
        data: {
          album_id: album_id,
          moban_id: moban_id,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.reLaunch({
            url: '/pages/webView/index?state=4&album_id=' + album_id,
          })
        }
      })
    }
  },
})
