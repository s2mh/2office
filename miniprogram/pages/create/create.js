// miniprogram/pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyingState: 'verifying',
    buttons: [{text: '取消'}, {text: '确定'}],
    dialogShow: false,
    rules: [{
      name: 'name',
      rules: [{ required: true, message: '请输入您的组织名称123' }, { minlength: 2, message: '组织名称至少2个字' }],
    }, {
      name: 'organizationId',
      rules: [
        { required: true, message: '请输入您的组织编号' }, 
        { validator: validator }
      ]  
    }],
    viewData: [{
      key: 'name',
      title: '组织名称',
      placeholder: '不少于2个字',
      showError: false
    }, {
      key: 'organizationId',
      title: '组织编号',
      placeholder: '6位数字或字母',
      showError: false
    }],
    formData: {
      name: '',
      organizationId: '',
      mobile: '',
      varified: false
    }
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
        // this.requestJoin()
      } else {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
              error: errors[firstError[0]].message
          })
        }
      }
    })
  }
})

async function validator(rule, value, param, models) {
  var reg = /^[a-zA-Z0-9.-]*$/i
  if (!reg.test(value)) {
    return '组织编码为6位数字或字母'
  }

  const db = wx.cloud.database()
  try {
    const res = await db.collection('organization').where({
      organizationId: value
    }).get()
    if (res.data.length > 0) {
      return '该组织编码已存在'
    }
     
  } catch (error) {
  }
}