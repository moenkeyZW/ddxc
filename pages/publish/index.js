// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t_length: 0,
    display:'none',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text
    })
  },
  inputTitle:function(e){
    console.log(e)
  },
  publish: function (e) {
    console.log(e)
    if(e.detail.value.title!==""){
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '标题未填写',
        showCancel:false,
        success: function (res) {
        
        }
      })
    }
  }

})