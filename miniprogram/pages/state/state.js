// miniprogram/pages/state/state.js

import State from '../state'

const app = getApp()
const userInfoKey = 'UserInfoKey'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserProfile: false,
    hadDBData: false,
    state: State.Unknown,
    dialogShow: false,
    revocationButtons: [{text: '否'}, {text: '是'}],
    member: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
    this.getUserProfile()
  },
  
  getOpenid: function() {
    /// 用户信息已获取
    if (this.data.hasUserProfile) {
      wx.showLoading({
        title: '数据加载中',
      })
    }
    
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

  getUserProfile: function() {
    if (app.globalData.userInfo) {
      this.didGetUserProfile()
      return
    }
    var storedUserInfo = wx.getStorageSync(userInfoKey)
    if (storedUserInfo) {
      app.globalData.userInfo = storedUserInfo
      this.didGetUserProfile()
    }
  },

  onGetUserProfile: function () {
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
    this.setData({
      hasUserProfile: true
    }, function() {
      if (this.data.hadDBData) {
        this.handleMemberData(this.data.member)
      } else {
        // openid 还没请求到，显示加载中
        wx.showLoading({
          title: '数据加载中....',
        })
      }
    })
  },

  redirectToSelect: function() {
    wx.redirectTo({
      url: '../select/select',
    })
  },

  checkOpenId: function(openid) {
    const db = wx.cloud.database()
    db.collection('member').where({
      _openid: openid
    }).get({
      success: res => {
        this.data.member = res.data[0]
        app.globalData.member = this.data.member
        this.findOrganization(this.data.member.organizationId)
      },
      fail: err => {
        wx.showToast({
          title: 'member查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  findOrganization: function(organizationId) {
    const db = wx.cloud.database()
    db.collection('organization').where({
      organizationId: organizationId
    }).get({
      success: (res) => {
        this.data.hadDBData = true
        app.globalData.organization = res.data[0]
        console.log(app.globalData.organization)
        this.handleMemberData(this.data.member)
      }
    })
  },

  handleMemberData: function(member) {
    // 用户信息和 openid 都获取到之后
    if (this.data.hasUserProfile && this.data.hadDBData) {
      var state = (member && member.state) ? member.state : State.Stranger
      switch(state) {
        case State.Checking:
        case State.Creating:
          this.setData({
            state: state
          }, function() {
            wx.hideLoading()
          })
          break

          case State.Joined:
            wx.hideLoading()
            this.enterHome(false)
          break
          
          case State.Created:
            wx.hideLoading()
            this.enterHome(true)
          break

          default:
            this.redirectToSelect()
      }  
    }
  },

  onRefresh: function(button) {
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
      var task = this.revocateChecking()
      if (this.data.member.state == State.Creating) {
        task = Promise.all([task, this.revocateCreating()]) 
      }
      task.then( res => {
        wx.redirectTo({
          url: '../select/select',
        })
      })
    }
  },
  revocateChecking: function() {
    const db = wx.cloud.database()
    return db.collection('member').where({
      _openid: app.globalData.openid
    }).remove()
  },
  revocateCreating: function() {
    const db = wx.cloud.database()
    return db.collection('organization').where({
      _openid: app.globalData.openid
    }).remove()
  },
  enterHome: function(isAdmin) {
    wx.redirectTo({
      url: '../home/home' + (isAdmin ? '?isAdmin=true' : ''),
    })
  }
})