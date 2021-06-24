// pages/home/admin/admin.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    rules: [],
    formData: [],
    viewData: [],
    slideButtons: [{
      text: '删除'
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onAdd: function() {
      console.log(this.data)
      this.data.rules.push({
        name: 'name',
        rules: { required: true },
      })
      this.data.formData.push(null)
      this.data.viewData.push({
        showError: false
      })
      this.setData({
        rules: this.data.rules,
        formData: this.data.formData,
        viewData: this.data.viewData,
      })
    }
  }
})
