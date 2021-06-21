// miniprogram/pages/create/create.js

import State from '../state'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyingState: 'verifying',
    buttons: [{text: '取消'}, {text: '确定'}],
    rules: [{
      name: 'name',
      rules: [{ required: true, message: '请输入您的姓名' }, { minlength: 2, message: '姓名至少2个字' }],
    }, {
      name: 'mobile',
      rules: [{ required: true, message: '请输入您的手机号' }, { mobile: true, message: '手机号码格式不正确' }],
    }, {
      name: 'organizationName',
      rules: [{ required: true, message: '请输入您的组织名称' }, { minlength: 2, message: '组织名称至少2个字' }],
    }, {
      name: 'organizationId',
      rules: [
        { required: true, message: '请输入您的组织编号' }, 
        { validator: validator }
      ]  
    }],
    viewData: [{
      key: 'name',
      title: '姓名',
      placeholder: '至少2个字',
      showError: false
    }, {
      key: 'mobile',
      title: '手机号',
      placeholder: '11位手机号码',
      showError: false
    }, {
      key: 'organizationName',
      title: '组织名称',
      placeholder: '至少2个字',
      showError: false
    }, {
      key: 'organizationId',
      title: '组织编号',
      placeholder: '6位数字或字母',
      showError: false
    }],
    formData: {
      name: '',
      organizationName: '',
      organizationId: '',
      mobile: '',
      state: State.Creating
    }
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
        [`formData.${field}`]: e.detail.value
    })
  },
  commit: function() {
    let f = this.selectComponent('#form')
    f.validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (valid) {
        // this.requestJoin()
        this.checkOrganizationId().then(existed => {
          if (existed) {
            this.setData({
              error: '该组织编码已存在'
            })
          } else {
            this
          }
        }) 
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
  checkOrganizationId: async function() {
    const db = wx.cloud.database()
    try {
      const res = await db.collection('organization').where({
        organizationId: this.data.formData.organizationId
      }).get()
      return res.data.length > 0
      
    } catch (error) {
    }
  },
  create: function() {
    const db = wx.cloud.database()
    db.collection('organization').add({
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
          title: '创建请求失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }
})

function validator(rule, value, param, models) {
  var reg = /^[a-zA-Z0-9.-]*$/i
  if (!reg.test(value)) {
    return '组织编码为6位数字或字母'
  }
}