// pages/taskUp/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort: [],
    img_arr: [],
    remakeImg: [],
    upImg: [],
    id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var id = options.id;
    that.setData({
      id: id
    })
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
        console.log(res)
        var img_arr = [];
        var remakeImg = [];
        for (var i = 0; i < res.data.list.length; i++) {
          remakeImg = remakeImg.concat(res.data.list[i]);
          img_arr = img_arr.concat('https://www.qlgbp.cn/Public' + res.data.list[i])
        }
        that.setData({
          img_arr: img_arr,
          remakeImg: remakeImg,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  choose: function() {
    var that = this
    wx.chooseImage({
      count: 20,
      success: function(res) {
        that.setData({
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
    var that = this
    var img_arr = that.data.img_arr;
    var upImg = that.data.upImg;
    var remakeImg = that.data.remakeImg;
    var index = e.currentTarget.dataset.index;
    img_arr.splice(index, 1);
    upImg.splice(index, 1);
    remakeImg.splice(index, 1);
    if (img_arr.length === 0) {
      that.setData({
        isHaveImg: true
      })
    }
    that.setData({
      img_arr: img_arr,
      upImg: upImg,
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
    for (var j = 0; j < sort.length / 2; j++) {
      for (var i = 0; i < sort.length; i++) {
        if (sort[i] == j) {
          upImg.push('/UploadWechat/' + sort[i + 1])
        }
      }
    }
    var imgUrl = that.data.remakeImg.concat(upImg).join(',');
    var id = that.data.id;
    wx.request({
      url: app.globalData.base_url + '/save_img',
      data: {
        img: imgUrl,
        album_id:id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        wx.reLaunch({
          url: '/pages/webView/index?state=4&album_id=' + id,
        })
      }
    })
  },

})