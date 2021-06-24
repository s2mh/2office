// miniprogram/pages/home/home.js

const TabType = {
  Templet: 'Templet',
  MemberInfo: 'MemberInfo',
  Admin: 'Admin',
}

Page({
  data: {
    selectedTabType: TabType.Templet
  },
  templetData: {
    'text': '模板',
    // 'iconPath': '../../images/tabbar_icon_setting_default.png',
    // 'selectedIconPath': '../../images/tabbar_icon_setting_active.png'
    type: TabType.Templet,
  },
  memberInfoData: {
    'text': '信息',
    // 'iconPath': '../../images/tabbar_icon_setting_default.png',
    // 'selectedIconPath': '../../images/tabbar_icon_setting_active.png'
    type: TabType.MemberInfo,
  },
  adminTabData: {
    'text': '入录',
    // 'iconPath': '../../images/tabbar_icon_setting_default.png',
    // 'selectedIconPath': '../../images/tabbar_icon_setting_active.png'
    type: TabType.Admin,
  },

  tabChange(e) {
    console.log('tab change', e)
    const selectedIndex = e.detail.index
    this.setData({
      selectedTabType: this.data.list[selectedIndex].type
    })
  },

  onLoad: function (options) {
    console.log(options)
    var list = [this.templetData, this.memberInfoData]
    if (options.isAdmin) {
      list.push(this.adminTabData) 
    }
    var data = {
      list: list
    }
    if (options.tab) {
      data.selectedTabType = options.tab
    }
    this.setData(data)
  },
})