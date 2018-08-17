var app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    music_list: '',
    clickId: -1,
    mold_list: ['爱情', '纯音乐', '儿童', '古风', '爵士', '流行', '民谣', '青春', '清新'],
    chooseId: -1,
    color: '#000000',
    display: 'none',
    showView: true,
    background: '#FA7180',
    music_id: '',
    moban_id: '',
    music_name: '',
    cor: '#FA7180',
    cors: '#FA7180',
    showHot: true,
    selectedId: '',
    moren_id: '',
    album_id: '',
    grade: 2,
  },
  onLoad: function(options) {
    var that = this;
    var music_id = options.music_id;
    var moban_id = options.moban_id;
    var grade = options.grade;
    if (options.album_id) {
      that.setData({
        album_id: options.album_id
      })
    }
    that.setData({
      grade: grade,
      music_id: music_id,
      moban_id: moban_id,
      selectedId: music_id,
    })
  },
  onShow: function() {
    var that = this;
    var music_id = that.data.music_id;
    var moban_id = that.data.moban_id;
    wx.request({
      url: app.globalData.base_url + '/music_list',
      data: {
        moban_id: moban_id,
        music_id: music_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          clickId: -1,
          music_name: res.data.moban_music.music_name,
          music_list: res.data.remen,
          moren_id: res.data.moban_music.music_id,
        })
        if (res.data.select_music.music_id == res.data.moban_music.music_id) {
          return
        } else {
          that.setData({
            selectedId: res.data.select_music.music_id,
            cor: '#333',
            background: '#E0E0E0',
          })
        }
      }
    })
  },
  //监听页面自带的返回按钮
  onUnload: function() {
    var that = this;
    innerAudioContext.pause();
    that.setData({
      showView: false
    })
  },
  hot: function() {
    var that = this;
    that.onShow();
    that.setData({
      clickId: -1,
      display: 'none',
      color: '#000000',
      cors: '#FA7180',
      showHot: true,
      chooseId: -1,
    })
  },

  moren: function(e) {
    var that = this;
    var music_id = e.currentTarget.dataset.id;
    that.setData({
      selectedId: -1,
      music_id: music_id,
      display: 'none',
      background: '#FA7180',
      clickId: -1,
      cor: '#FA7180',
    })
  },
  yaogun: function(e) {
    var that = this;
    var music_id = that.data.music_id;
    var moban_id = that.data.moban_id;
    var id = e.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.base_url + '/music_lable',
      data: {
        type: id,
        music_id: music_id,
        moban_id: moban_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          clickId: -1,
          music_list: res.data.list,
          display: 'block',
          color: '#FA7180',
          chooseId: -1,
          showHot: false,
          cors: '#000000',
          selectedId: res.data.select_music.music_id
        })
      }
    })

  },
  qita: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    var music_id = that.data.music_id;
    var moban_id = that.data.moban_id;
    wx.request({
      url: app.globalData.base_url + '/music_lable',
      data: {
        type: id,
        music_id: music_id,
        moban_id: moban_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          clickId: -1,
          music_list: res.data.list,
          chooseId: id,
          showHot: false,
          display: 'none',
          color: '#000000',
          cors: '#000000',
          selectedId: res.data.select_music.music_id
        })
      }
    })
  },
  chooseMuban: function(e) {
    var that = this;
    innerAudioContext.play();
    var id = e.currentTarget.dataset.index;
    var music_id = e.currentTarget.dataset.id;
    var src = that.data.music_list[id].url;
    var clickId = that.data.clickId;
    innerAudioContext.src = src;
    if (clickId != id) {
      innerAudioContext.destroy
      innerAudioContext.play();
      that.setData({
        showView: false
      })
    } else if (that.data.showView === false) {
      innerAudioContext.pause();
      that.setData({
        showView: true
      })
    } else {
      innerAudioContext.play();
      that.setData({
        showView: false
      })
    }
    that.setData({
      clickId: id,
      displays: 'block',
      cor: '#333',
      background: '#E0E0E0',
      music_id: music_id,
      selectedId: -1,
    })
  },
  saveFile: function() {
    var that = this;
    var album_id = that.data.album_id;
    var music_id = that.data.music_id;
    var moban_id = that.data.moban_id;
    var grade = that.data.grade;
    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    if (prevPage.route == "pages/upPhotos/index") {
      prevPage.setData({
        'currently.moban_id': moban_id,
        'currently.music_id': music_id,
        grade: grade,
      })
      wx: wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.request({
        url: app.globalData.base_url + '/save_music',
        data: {
          album_id: album_id,
          music_id: music_id,
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          wx.redirectTo({
            url: '/pages/webView/index?state=4&album_id=' + album_id + '&&grade=' + grade,
          })
        }
      })
    }
  },
})