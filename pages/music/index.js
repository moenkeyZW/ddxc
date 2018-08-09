var app = getApp();

Page({
  data: {
    muban_list: [1, 2, 3, 4, 5, 6],
    clickId: -1,
    mold_list: ['粤语', '民谣', '流行', '合唱', '怀旧', '对唱', '古典', '交响乐', '爱情'],
    chooseId: -1,
    color: '#000000',
    display: 'none',
    showView: true,
  },
  onLoad: function () {

  },
  onShow: function () {

  },
  dianzi: function (e) {
    var that = this;
    that.setData({
      display: 'block',
      color: '#FA7180',
      chooseId: -1,
    })
  },
  qita: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    that.setData({
      chooseId: id,
      display: 'none',
      color: '#000000',
    })
  },
  chooseMuban: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    that.setData({
      clickId: id,
      displays:'block',
      showView: (!that.data.showView),
    })
  },
  saveFile: function () {
    wx: wx.navigateTo({
      url: '/pages/upPhotos/index',
    })
  },
})
