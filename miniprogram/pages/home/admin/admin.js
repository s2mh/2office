// pages/home/admin/admin.js
Component({

  externalClasses: ['ext-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    items: Array,
    openid: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    focusInput: true,
    rules: [],
    slideButtons: [{
      type: 'warn',
      text: '删除'
    }],
    addButtons: [
      { text: '取消' },
      { text: '确定' }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAdd: function () {
      this.setData({
        dialogShow: true,
        focusInput: true
      })
    },

    formInputChange: function (input) {
      this.data.inputValue = input.detail.value
      console.log(input.detail)
    },

    tapAddDialogButton: function (button) {
      this.setData({
        dialogShow: false
      })
      if (button.detail.index == 1 && this.data.inputValue.length > 0) {
        this.data.items.push(this.data.inputValue)
        this.data.inputValue = ''
        wx.showLoading({
          title: '更新中',
        })
        const db = wx.cloud.database()
        db.collection('member').where({
          _openid: this.data.openid
        }).update({
          data: {
            items: this.data.items
          },
          success: res => {
            wx.hideLoading()
            this.setData({
              items: this.data.items,
              inputValue: this.data.inputValue
            })
          },
          fail: err => {
            wx.showToast({
              title: '更新失败'
            })
          }
        })

      } else {
        this.setData({
          items: this.data.items,
          inputValue: this.data.inputValue
        })
      }
    }
  }
})
