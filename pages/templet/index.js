var app = getApp();

Page({
  data: {
    muban_list: [1, 2, 3, 4, 5, 6],
    clickId: -1,
    mold_list: ['生日', '儿歌', '节日', '亲子', '爱情', '快节奏', '钢琴', '聚会', '纯音乐'],
    chooseId:-1,
    color:'#000000',
    display:'none',
    moban_id:'',
    hot_list:'',
  },
  onLoad: function (options) {
    var moban_id=options.moban_id;
    this.setData({
      moban_id:moban_id,
      clickId:moban_id
    })
    console.log(moban_id,this.data.clickId)
  },
  onShow: function () {
    var that=this;
    wx.request({
      url: app.globalData.base_url + '/moban_list',
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          hot_list:res.data.remen
        })
      }
    })
  },
  dianzi:function(e){
    var that = this;
    that.setData({
      display:'block',
      color:'#FA7180',
      chooseId:-1,
    })
  },
  qita:function(e){
    var that = this;
    var id = e.currentTarget.dataset.index;
    that.setData({
      chooseId: id,
      display:'none',
      color:'#000000',
    })
  },
  chooseMuban: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    that.setData({
      clickId: id
    })
  },
  saveFile:function(){
    wx:wx.navigateTo({
      url: '/pages/upPhotos/index',
    })
  },
})
