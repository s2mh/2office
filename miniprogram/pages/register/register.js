// miniprogram/pages/register/register.js

import State from '../state'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // verifying: 验证用户状态
    // unverified: 未验证
    // verified: 已验证
    verifyingState: 'verifying',
    buttons: [{text: '取消'}, {text: '确定'}],
    dialogShow: false,
    rules: [{
      name: 'name',
      rules: [{ required: true, message: '请输入您的姓名' }, { minlength: 2, message: '姓名至少2个字' }],
    }, {
      name: 'mobile',
      rules: [{ required: true, message: '请输入您的手机号' }, { mobile: true, message: '手机号码格式不正确' }],
    }, {
      name: 'organizationId',
      rules: [{ required: true, message: '请输入您的组织编号' }, { rangelength: [6, 6], message: '组织编号为6位字母或数字' }],
    }],
    viewData: [{
      key: 'name',
      title: '姓名',
      placeholder: '不少于2个字',
      showError: false
    }, {
      key: 'mobile',
      title: '手机号',
      placeholder: '11位手机号码',
      showError: false
    }, {
      key: 'organizationId',
      title: '组织编号',
      placeholder: '6位字母或数字',
      showError: false
    }],
    formData: {
      name: '',
      organizationId: '',
      mobile: '',
      state: State.Checking
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = getApp().globalData.userInfo
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName
    })
  },

  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`formData.${field}`]: e.detail.value
    })
  },

  commit: function () {
    let f = this.selectComponent('#form')
    f.validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (valid) {
        this.requestJoin()
      } else {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
              error: errors[firstError[0]].message
          })
        }
      }
    })
  },
  requestJoin: function () {
    const db = wx.cloud.database()
    db.collection('member').add({
      data: this.data.formData,
      success: res => {
       
        wx.showToast({
          title: '已申请',
          duration: 3,
          complete: (res) => {
            wx.reLaunch({
              url: '../state/state',
            })
          }
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '申请加入请求失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})