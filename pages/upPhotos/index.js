// pages/taskUp/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    isHaveImg: true,
    img_arr: [],
    remakeImg:[],
    upImg: [],
    muban_list:'',
    clickId:-1,
    id:0,
    cover:'',
    currently: {//当前音乐和模板
      moban_id:0,
      music_id:0,
      moban_name:'',
      music_name:'',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    console.log(options);
    if(options.id>0){
      var id = options.id;
    }else{
      var id=0;
    }
    that.setData({
      id:id
    })
    if(options.moban_id>0){
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
    wx.request({
      url: app.globalData.base_url + '/upload_img_list',
      data: {
        id:id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.data.status===1){
          var img_arr = [];
          var remakeImg=[];
          for (var i = 0; i < res.data.list.length; i++) {
            remakeImg = remakeImg.concat(res.data.list[i]);
            img_arr = img_arr.concat('https://www.qlgbp.cn/Public' + res.data.list[i])
          }
          that.setData({
            isHaveImg:false,
            img_arr:img_arr,
            remakeImg:remakeImg
          })
        }else{
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
  onShow: function () {
    
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
    var id=that.data.id;
    var moban_id = that.data.currently.moban_id;
    var music_id = that.data.currently.music_id;
    if (that.data.curIndex === index) return
    that.setData({
      curIndex: index,
    }, () => {
      if (index === 0) {

      } else {
        wx.request({
          url: app.globalData.base_url + '/moban_view_list',
          data: {
            id:id,
            moban_id: moban_id,
            music_id:music_id
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              muban_list:res.data.rm_moban,
              currently:res.data.list,
              clickId: res.data.list.moban_id
            })
          }
        })
      }
    })
  },

  goMuban:function(){
    var that=this;
    var moban_id = that.data.currently.moban_id;
    wx.navigateTo({
      url: '/pages/templet/index?moban_id='+moban_id,
    })
  },
  goMusic: function () {
    var that = this;
    var music_id = that.data.currently.music_id;
    wx.navigateTo({
      url: '/pages/music/index?music_id='+music_id,
    })
  },
  chooseMuban:function(e){
    var that=this;
    console.log(e)
    var moban_name = e.currentTarget.dataset.name;
    var moban_id = e.currentTarget.dataset.id;
    var id = e.currentTarget.dataset.index;
    that.setData({
      clickId: id,
      'currently.moban_id': moban_id,
      'currently.moban_name': moban_name
    })
  },
  choose: function() {
    var that = this
    wx.chooseImage({
      count: 20,
      success: function(res) {
        that.setData({
          isHaveImg:false,
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
              'user': 'test'
            },
            success: function(res) {
              that.setData({
                upImg: that.data.upImg.concat('/UploadWechat/'+res.data)
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
    var remakeImg=that.data.remakeImg;
    var index = e.currentTarget.dataset.index;
    img_arr.splice(index, 1);
    upImg.splice(index, 1);
    remakeImg.splice(index,1);
    if(img_arr.length===0){
      that.setData({
        isHaveImg:true
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
    var imgUrl = that.data.remakeImg.concat(that.data.upImg).join(',');
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
        // wx.redirectTo({
        //   url: '/pages/publish/index',
        // })
      }
    })
  },
 
})