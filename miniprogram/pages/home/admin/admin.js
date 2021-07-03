// pages/home/admin/admin.js
Component({

  externalClasses: ['ext-class'],
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    focusInput: true,
    rules: [],
    formData: [],
    viewData: [],
    slideButtons: [{
      type: 'warn',
      text: '删除'
    }],
    addButtons: [{ text: '取消' }, { text: '确定' }]
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

      console.log('gegegegegegegegegegege')
      this.setData({
      })
    },
    addItem: function (item) {
      this.data.formData.push(item)
      this.setData({
        formData: this.data.formData,
      })
    },
    formInputChange: function(input) {
      this.data.inputValue = input.detail.value
      console.log(input.detail)
    },

    tapAddDialogButton: function (button) {
      this.setData({
        dialogShow: false
      })
      if (button.detail.index == 1 && this.data.inputValue.length > 0) {
        this.data.formData.push(this.data.inputValue)
        this.data.inputValue = ''
      }
      this.setData({
        formData: this.data.formData,
        inputValue: this.data.inputValue
      })
    }
  }
})
