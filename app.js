//app.js
App({
  onLaunch: function () {

  },
  onLogin: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (wx.getStorageSync('openid')) {
          that.onRefresh(cb);
        } else {
          wx.login({
            success: res => {
              if (res.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res_user) {
                    wx.request({
                      url: that.globalData.base_url + '/login',
                      data: {
                        code: res.code,
                        encryptedData: res_user.encryptedData,
                        iv: res_user.iv
                      },
                      method: 'GET',
                      header: {
                        'content-type': 'application/json'
                      },
                      success: function (res) {
                        console.log(res)
                        that.globalData.userInfo = res.data.userinfo;
                        wx.setStorageSync('session', res.data.hash);
                        wx.setStorageSync('openid', res.data.openid);
                        typeof cb == "function" && cb(that.globalData.userInfo)
                      }
                    })
                  },
                  fail: function (e) {
                    typeof cb == "function" && cb(false)
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            },
          })
        }
      },
      fail: function () {
        wx.login({
          success: res => {
            if (res.code) {
              wx.getUserInfo({
                withCredentials: true,
                success: function (res_user) {
                  wx.request({
                    url: that.globalData.base_url + '/login',
                    data: {
                      code: res.code,
                      encryptedData: res_user.encryptedData,
                      iv: res_user.iv
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      that.globalData.userInfo = res.data.userinfo;
                      wx.setStorageSync('session', res.data.hash);
                      wx.setStorageSync('openid', res.data.openid);
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                },
                fail: function (e) {
                  typeof cb == "function" && cb(false)
                }
              })
            } else { }
          }
        })
      }
    })
  },
  onRefresh: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        if (!that.globalData.userInfo) {
          if (wx.getStorageSync('openid')) {
            wx.request({
              url: that.globalData.base_url + '/login_info',
              data: {
                openid: wx.getStorageSync('openid'),
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                that.globalData.userInfo = res.data.userinfo;
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          } else {
            that.onLogin(cb);
          }
        } else {
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      },
      fail: function (res) {
        that.onLogin(cb);
      },
    })

  },
  globalData: {
    base_url: "https://www.qlgbp.cn/admin/wechat",
    userInfo: null,
  },
})