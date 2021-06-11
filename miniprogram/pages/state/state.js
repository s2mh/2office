// miniprogram/pages/state/state.js

const State = {
  Unknown   : 'Unknown',  // 未知，接口未返回
  Stranger  : 'Stranger', // 未加入
  Checking  : 'Checking', // 待审核
  Joined    : 'Joined',   // 已加入
  Rejected  : 'Rejected', // 被拒绝
}

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: State.Unknown,

    dialogShow: false,
    revocationButtons: [{text: '否'}, {text: '是'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
  },
  
  getOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.checkOpenId(res.result.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: err,
        })
      }
    })
  },

  onGetUserProfile: function () {
    if (app.globalData.userInfo) {
      this.didGetUserProfile()
      return
    }
    const userInfoKey = 'userInfoKey'
    var storedUserInfo = wx.getStorageSync(userInfoKey)
    if (storedUserInfo) {
      app.globalData.userInfo = storedUserInfo
      this.didGetUserProfile()
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
              this.didGetUserProfile()
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

  didGetUserProfile: function() {
    if (app.globalData.openid) {
      this.redirectToSelect()
    } else {
      wx.showLoading({
        title: '数据加载中',
      })
    }
  },

  redirectToSelect: function() {
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
        var state = State.Stranger
        
        const member = res.data[0]
        if(member) {
           state = member.state
        }

        this.setData({
          state: state
        })
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

  onRefresh: function() {
    this.checkOpenId(app.globalData.openid)
  },

  onRevocation: function() {
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