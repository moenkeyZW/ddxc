// pages/taskUp/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    sort: [],
    isHaveImg: true,
    img_arr: [],
    remakeImg: [],
    upImg: [],
    muban_list: '',
    clickId: -1,
    id: 0,
    currently: { //当前音乐和模板
      moban_id: 0,
      music_id: 0,
      moban_name: '',
      music_name: '',
    },
    grade: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.id > 0) {
      var id = options.id;
    } else {
      var id = 0;
    }
    that.setData({
      id: id
    })
    if (options.moban_id > 0) {
      that.setData({
        'currently.moban_id': options.moban_id,
        clickId: options.moban_id
      })
    }
    if (options.music_id > 0) {
      that.setData({
        'currently.music_id': options.music_id
      })
    }
    if(options.grade){
      that.setData({
        grade: grade
      })
    }

    wx.request({
      url: app.globalData.base_url + '/upload_img_list',
      data: {
        id: id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status === 1) {
          var img_arr = [];
          var remakeImg = [];
          for (var i = 0; i < res.data.list.length; i++) {
            remakeImg = remakeImg.concat(res.data.list[i]);
            img_arr = img_arr.concat('https://www.qlgbp.cn/Public' + res.data.list[i])
          }
          that.setData({
            isHaveImg: false,
            img_arr: img_arr,
            remakeImg: remakeImg,
          })
        } else {
          that.setData({
            isHaveImg: true,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this
    var id = that.data.id;
    var grade=that.data.grade;
    var moban_id = that.data.currently.moban_id;
    var music_id = that.data.currently.music_id;
    wx.request({
      url: app.globalData.base_url + '/moban_view_list',
      data: {
        id: id,
        moban_id: moban_id,
        music_id: music_id,
        grade:grade,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          muban_list: res.data.rm_moban,
          currently: res.data.list,
          clickId: res.data.list.moban_id
        })
      }
    })
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow(); // 刷新页面
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  tabHandle: function(e) {
    const that = this
    const index = e.target.dataset.index
    if (that.data.curIndex === index) return
    that.setData({
      curIndex: index,
    })
  },

  goMuban: function(e) {
    var that = this;
    var grade=e.currentTarget.dataset.grade;
    var moban_id = that.data.currently.moban_id;
    wx.navigateTo({
      url: '/pages/templet/index?moban_id=' + moban_id+'&&grade='+grade,
    })
  },
  goMusic: function(e) {
    var that = this;
    var grade = e.currentTarget.dataset.grade;
    var moban_id = that.data.currently.moban_id;
    var music_id = that.data.currently.music_id;
    wx.navigateTo({
      url: '/pages/music/index?music_id=' + music_id + '&&moban_id=' + moban_id+'&&grade='+grade,
    })
  },
  previewMuban: function(e) {
    var moban_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/webView/index?state=3&&moban_id=' + moban_id,
    })
  },
  chooseMuban: function(e) {
    var that = this;
    var music_name = e.currentTarget.dataset.music;
    var music_id = e.currentTarget.dataset.musicid;
    var moban_name = e.currentTarget.dataset.name;
    var moban_id = e.currentTarget.dataset.id;
    var id = e.currentTarget.dataset.index;
    that.setData({
      clickId: id,
      'currently.moban_id': moban_id,
      'currently.moban_name': moban_name,
      'currently.music_id': music_id,
      'currently.music_name': music_name
    })
  },
  choose: function() {
    var that = this
    wx.chooseImage({
      count: 9,
      success: function(res) {
        that.setData({
          isHaveImg: false,
          img_arr: that.data.img_arr.concat(res.tempFilePaths)
        })
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.base_url + '/upload_img',
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              'accept': 'application/json',
            },
            formData: {
              'num': i
            },
            success: function(res) {
              that.data.sort = res.data.split(',').concat(that.data.sort);
              if (that.data.sort.length >= 72) {
                that.data.sort = that.data.sort.slice(0, 72)
              }
              that.setData({
                sort: that.data.sort
              })
            }
          })
        }
      }
    })
  },
  // 删除图片
  deleteImg: function(e) {
    var that = this;
    var sort = that.data.sort;
    var img_arr = that.data.img_arr;
    var upImg=that.data.upImg;
    var remakeImg = that.data.remakeImg;
    var index = e.currentTarget.dataset.index;
    if (img_arr.length >= 35) {
      img_arr = img_arr.slice(0, 35)
    }

    for (var j = 0; j < sort.length; j++) {
      if(sort[j]==index){
        sort.splice(j, 2);
      }
    }

    img_arr.splice(index, 1);
    remakeImg.splice(index, 1);
    if (img_arr.length === 0) {
      that.setData({
        isHaveImg: true
      })
    }
    that.setData({
      sort: sort,
      img_arr: img_arr,
      remakeImg: remakeImg
    });
  },

  // 提交制作
  uploadImg: function() {
    var that = this;
    var sort = that.data.sort;
    var img_arr = that.data.img_arr;
    var upImg = that.data.upImg;
    if (img_arr == "") {
      wx.showToast({
        title: '图片不能为空',
        icon: 'success',
        duration: 1500,
        mask: true,
      })
      return
    }

    for (var j = 0; j < sort.length; j++) {
      for (var i = 0; i < sort.length; i++) {
        if (sort[i] == j) {
          upImg.push('/UploadWechat/' + sort[i + 1])
        }
      }
    }
    
    var imgUrl = that.data.remakeImg.concat(upImg).join(',');

    var moban_id = that.data.currently.moban_id;
    var music_id = that.data.currently.music_id;
    wx.request({
      url: app.globalData.base_url + '/make_album',
      data: {
        img: imgUrl,
        moban_id: moban_id,
        music_id: music_id,
        openid: wx.getStorageSync('openid')
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.res) {
          wx.redirectTo({
            url: '/pages/publish/index',
          })
        }
      }
    })
  },

})