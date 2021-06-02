// miniprogram/pages/register/register.js
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
      rules: [{ required: true, message: '请输入姓名' }, { minlength: 2, message: '姓名格式不正确' }],
    }, {
      name: 'id',
      rules: [{ required: true, message: '请输入教工号' }, { minlength: 9, message: '教工号不正确' }],
    }, {
      name: 'mobile',
      rules: [{ required: true, message: '请输入手机号码' }, { mobile: true, message: '手机号码格式不正确' }],
    }],
    viewData: [{
      key: 'name',
      title: '姓名',
      placeholder: '请输入姓名',
      showError: false
    }, {
      key: 'id',
      title: '教工号',
      placeholder: '请输入教工号',
      showError: false
    }, {
      key: 'mobile',
      title: '手机号',
      placeholder: '请输入手机号',
      showError: false
    }],
    formData: {
      name: '',
      id: '',
      mobile: ''
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

  tapDialogButton: function (button) {
    this.setData({
      dialogShow: false
    })
    console.log(button)
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
      if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
              this.setData({
                  error: errors[firstError[0]].message
              })
          }
        //   wx.showToast({
        //     title: '校验xxxx'
        // })
      } else {
          wx.showToast({
              title: '校验通过'
          })
      }
  })
    console.log('fdsdfsdf')
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