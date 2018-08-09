var app = getApp();

Page({
  data: {
    muban_list: [1, 2, 3, 4, 5, 6],
    clickId: -1,
    mold_list: ['生日', '儿歌', '节日', '亲子', '爱情', '快节奏', '钢琴', '聚会', '纯音乐'],
    chooseId:-1,
    color:'#000000',
    display:'none',
  },
  onLoad: function () {

  },
  onShow: function () {

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
