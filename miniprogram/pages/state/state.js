// miniprogram/pages/state/state.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // uninitialized 未拿到头像信息 
    // loading 加载中  
    // stranger 未加入  
    // checking 审核中  
    // joined 已加入
    state: 'checking',


    dialogShow: false,
    revocationButtons: [{text: '否'}, {text: '是'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: 'jiazaizhong',
    // })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },
onGetUserProfile: function () {
    if (app.globalData.userInfo) {
      this.toSelect()
      return
    }

    const userInfoKey = 'userInfoKey'
    var storedUserInfo = wx.getStorageSync(userInfoKey)
    if (storedUserInfo) {
      app.globalData.userInfo = storedUserInfo
      this.toSelect()
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserProfile({
            desc: 'lalala',
            success: res => {
              wx.setStorage({
                key: userInfoKey,
                data: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
              this.toSelect()
            },
            fail: error => {
            }
          })
        }
      },
      fail: error => {
        this.setData({
          dialogShow: true
        })
      }
    })
  },
  toSelect: function() {
    wx.redirectTo({
      url: '../select/select',
    })
  },
  checkOpenId: function(openid) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('member').where({
      _openid: openid
    }).get({
      success: res => {
        if(res.data[1]) {

        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  revocation: function() {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton: function(button) {
    console.log(button.detail)
    this.setData({
      dialogShow: false
    })
    if (button.detail.index == 1) {
      const db = wx.cloud.database()
      db.collection('member').where({
        _openid: app.globalData.openid
      }).remove({
        success: res => {
          wx.redirectTo({
            url: '../select/select',
          })
        }
      })
    }
  }
})