// pages/mine/mine.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    userData: {},
    uesrinfoFlag: false,
    openidd: '',
    list: [{ "icon": "/images/mine/myRelease.png", "title": "我的发布", "url":"/pages/mine/publish/publish"  },
      { "icon": "/images/mine/myCollection.png", "title": "我的收藏", "url": "/pages/mine/collect/collect" },
      { "icon": "/images/mine/integralMall.png", "title": "积分商城", "url": "/pages/mine/store/store" },
            { "icon": "/images/mine/myExchange.png", "title": "我的兑换", "url": "/pages/mine/exchange/exchange" },
            { "icon": "/images/mine/aboutUs.png", "title": "关于我们", "url": "/pages/mine/aboutus/aboutus" },
            { "icon": "/images/mine/contactUs.png", "title": "联系我们" } ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('我的加载')
  },
  onShow: function () {
    app.editTabBar()
    console.log('我的出现' + app.globalData.userInfo + app.globalData.uesrinfoFlag)
    if (app.globalData.uesrinfoFlag) {
      this.getPersonalInfo()
      this.setData({
        userinfo: app.globalData.userInfo,
        uesrinfoFlag: app.globalData.uesrinfoFlag,
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '浩华房产转介平台',
      path: 'pages/home/home',
      success: function (res) {
        // 转发成功
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  },
  clickCell: function (e) {
    console.log(e)
    switch (e.currentTarget.dataset.index)
    {
      case 4:
        wx.showToast({
          title: '敬请期待',
          icon: 'none'
        })

      break
      default:
        if (app.globalData.uesrinfoFlag) {
          var index = e.currentTarget.dataset.index
          var url = this.data.list[index].url 
          wx.navigateTo({
            url: url + '?userid=' + this.data.userData.userid,
          })
        } else {
          wx.showToast({
            title: '当前未登录',
            icon: 'none'
          })
        }
    }
  },
  getUserInfo: function (res) {
    console.log('获取头像')
    console.log(res)
    var that = this
    if (res.detail.errMsg == 'getUserInfo:ok') {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          app.globalData.uesrinfoFlag = true
          console.log(res.userInfo)
          that.setData({
            userinfo: app.globalData.userInfo,
            uesrinfoFlag: true,
          })
          that.getPersonalInfo()
        }
      })
    }
  },

  getPersonalInfo: function() {
    var that = this
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/personal',
      data: {
        openid: app.globalData.openid
      },
      success: function (e) {
        console.log(e)
        that.setData({
          userData: e.data.body[0],
        })
        that.agreeAuth()
        app.editTabBar()
        app.globalData.isDetails = false
      }
    })
  },

  agreeAuth: function () {
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/agreeAuth',
      data: {
        openid: app.globalData.openid,
        name: this.data.userinfo.nickName,
        image: this.data.userinfo.avatarUrl
      },
      success: res=> {
        console.log(res)
      }
    })
  }

})