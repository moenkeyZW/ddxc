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
    nickname: '',
    compose: '',
    canvasWidth:'',
    canvasHeight:'',
    tit_length:0,
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
      success: function(res) {
        console.log(res)
        that.setData({
          id: res.data.list.id,
          cover: res.data.list.cover,
          nickname: res.data.list.nickname,
        })
        // var id = res.data.list.id;
        // var cover = res.data.list.cover;
        // wx.downloadFile({
        //   url: cover,
        //   success: function(res) {
        //     var src = res.tempFilePath
        //     wx.getImageInfo({
        //       src: src,
        //       success: function(res) {
        //         if (res.width > 1000) {
        //           var canvasWidth = 1000;
        //         } else {
        //           var canvasWidth = res.width;
        //         }
        //         if (res.height > 1000) {
        //           var canvasHeight = 800
        //         } else {
        //           var canvasHeight = res.height;
        //         }
        //         that.setData({
        //           canvasWidth: canvasWidth,
        //           canvasHeight: canvasHeight
        //         })
        //         const ctx = wx.createCanvasContext('shareCanvas')
        //         // 底图
        //         ctx.drawImage(src, 0, 0, canvasWidth / 2, canvasHeight / 2)
        //         const qrImgSize = 52
        //         ctx.drawImage('../../imgs/play.png', canvasWidth / 4 - 26, canvasHeight / 4 - 26, qrImgSize, qrImgSize)
        //         // 播放按钮
        //         ctx.stroke()
        //         ctx.draw()
        //         setTimeout(function() {
        //           wx.canvasToTempFilePath({
        //             canvasId: 'shareCanvas',
        //             success: function(res) {
        //               wx.uploadFile({
        //                 url: app.globalData.base_url + '/upload_img',
        //                 filePath: res.tempFilePath,
        //                 name: 'file',
        //                 header: {
        //                   "Content-Type": "multipart/form-data",
        //                   'accept': 'application/json',
        //                 },
        //                 success: function(res) {
        //                   var coverImg = '/UploadWechat/' + res.data.split(',')[1];
        //                   console.log(coverImg)
        //                   wx.request({
        //                     url: app.globalData.base_url + '/hecheng',
        //                     data: {
        //                       id: id,
        //                       coverimg: coverImg,
        //                     },
        //                     method: 'GET',
        //                     header: {
        //                       'content-type': 'application/json' // 默认值
        //                     },
        //                     success: function(res) {
        //                       that.setData({
        //                         compose: true,
        //                       })
        //                     }
        //                   })
        //                 }
        //               })
        //             }
        //           })
        //         }, 500)

        //       }
        //     })
        //   }
        // })
      }
    })
  },

  onPullDownRefresh: function() {
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
  pubPrev: function() {
    var that = this;
    var album_id = that.data.id;
    wx.navigateTo({
      url: '/pages/webView/index?state=4&&album_id=' + album_id,
    })
  },
  bindText: function(e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text
    })
  },
  inputTitle: function(e) {
    var tit_text = e.detail.value.length;
    this.setData({
      tit_length: tit_text
    })
  },
  publish: function(e) {
    var that = this;
    const id = that.data.id;
    var title = e.detail.value.title;
    if (that.data.percent >= 100) {
      // if (e.detail.value.title === "") {
      //   wx.showModal({
      //     title: '提示',
      //     content: '标题未填写',
      //     showCancel: false,
      //   })
      //   return
      // }
      if (title !== "") {
        title = e.detail.value.title
      } else {
        title = that.data.nickname + "的精美相册"
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
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 60000,
            success: function(res) {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
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