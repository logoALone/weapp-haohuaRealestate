/**
 * Network API 模块
 * @type {Object}
 */
const network = require('../../utils/network.js')

var app = getApp()
Page({

  /**
   * Network API
   */
  network: network,

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    msgList: [],
    house: [],
    hothouse: [],
    newhouse: [],
    tab_flag: "house",
    city: '青岛市',
    selAddress: false,
    sign: false,
    areaid: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    if (app.changeCityFlag) {
      this.setData({
        city: app.globalData.currentCity
      })
    }
    this.loadHomedata()
    var that = this
    app.userInfoReadyCallback = res => {
      if (app.globalData.uesrinfoFlag) {
        this.agreeAuth(res.userInfo)
      }
      this.loadHomedata()
      if (res.city != '青岛市') {
        wx.showModal({
          title: '提示',
          content: `是否切换到${res.city}`,
          confirmText: '切换',
          cancelText: '取消',
          success: function (res) {
            if(res.confirm) {
              console.log('用户点击确定')
              that.changeCity()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  changeCity: function() {
    this.setData({
      city: app.globalData.currentCity
    })
    app.changeCityFlag = true
    this.loadHomedata()
  },
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    this.setData({
      tabbar: app.globalData.tabbar
    });


    // app.editTabBar()
    var that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.selAddress ) {
      that.setData({//将携带的参数赋值
        city: currPage.data.city
      });
      app.globalData.currentCity = currPage.data.city
      app.changeCityFlag = true
      this.loadHomedata()
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
  /**
   * 按钮点击回调函数--进入城市选择列表
   */
  switchCity: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../pages/switchcity/switchcity?city=' + this.data.city,
    })
  },
  /**
   * 按钮点击回调函数--切换(热门、最新)
   */
  tab_change: function (event) {
    if (event.currentTarget.dataset.flag == "house") {
      console.log(event)
      this.setData({
        tab_flag: event.currentTarget.dataset.flag,
        house: this.data.hothouse
      })
    }else {
      console.log(event)
      this.setData({
        tab_flag: event.currentTarget.dataset.flag,
        house: this.data.newhouse
      })
    }

  },
  /**
   * 网络请求加载首页数据
   */
  loadHomedata: function () {

    var that = this
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/index',
      data: {
        cityname: this.data.city ,
        openid: app.globalData.openid
      },
      success: function (res) {
        app.editTabBar()
        console.log(res.data.body[0])
        var dataList = res.data.body[0]
        app.globalData.userid = dataList.userid
        app.globalData.isDetails = false
        that.setData({
          images: dataList.banner,
          msgList: dataList.dynamic,
          hothouse: dataList.hothouse,
          newhouse: dataList.newhouse,
          sign: dataList.sign,
          areaid: dataList.areaid,
          tabbar: app.globalData.tabbar
        })

        if (dataList.userid == null || dataList.userid == undefined || dataList.userid == '') {
          console.log('---------------------')
        } else {
          console.log('+++++++++++++++++++++')
          wx.hideLoading()
        }


        if (that.data.tab_flag != "house") {
          that.setData({
            house: that.data.newhouse
          })
        } else {
          that.setData({
            house: that.data.hothouse
          })
        }
      },
      fail: function (res) {
        console.log(res)
        app.editTabBar()
        wx.hideLoading()
      },
      complete: function () {

      }
    })
  },

  agreeAuth: function (userInfo) {

    console.log('agreeAuth')

    console.log(userInfo)

    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/agreeAuth',
      data: {
        openid: app.globalData.openid,
        name: userInfo.nickName,
        image: userInfo.avatarUrl
      },
      success: res => {
        console.log(res)
      }
    })
  },

  /**
   * 按钮点击回调函数--点击搜索栏
   */
  bindRoomSearchlist: function () {
    var room_type = '3'
    wx.navigateTo({
      url: '/pages/home/roomList/roomList?room_type=' + `${room_type}` + '&cityname=' + this.data.city + '&areaid=' + this.data.areaid
    })
  },
  /**
   * 按钮点击回调函数--点击新房
   */
  bindRoomNewlist: function () {
    if (app.globalData.uesrinfoFlag) {
      var room_type = '1'
      wx.navigateTo({
        url: '/pages/home/roomList/roomList?room_type=' + `${room_type}` + '&cityname=' + this.data.city + '&areaid=' + this.data.areaid
      })
    } else {
      wx.showToast({
        title: '当前未登录，请到我的点击微信一键登录',
        icon: 'none'
      })
    }
  },
  /**
   * 按钮点击回调函数--点击二手房
   */
  bindRoomSeclist: function () {
    if (app.globalData.uesrinfoFlag) {
      var room_type = '2'
      wx.navigateTo({
        url: '/pages/home/roomList/roomList?room_type=' + `${room_type}` + '&cityname=' + this.data.city + '&areaid=' + this.data.areaid
      })
    } else {
      wx.showToast({
        title: '当前未登录，请到我的点击微信一键登录',
        icon: 'none'
      })
    }
  },
  /**
   * 按钮点击回调函数--点击签到
   */
  clickSigiin: function () {
    if (app.globalData.uesrinfoFlag) {
      network
        .signin(app.globalData.userid) 
        .then(res => {
          console.log(res)
          if (res.rec == "SUC") {
            this.setData({
              sign: false
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      wx.showModal({
        title: '提示',
        content: '请到我的点击微信一键登录',
        confirmText: '确定',
        cancelText: '取消',
      })
    }
  },
  /**
   * 按钮点击回调函数--点击房源进入详情
   */
  clickcell: function (e) {
    if (app.globalData.uesrinfoFlag) {
      console.log(e)
      var index = e.currentTarget.dataset.index
      var houseid = this.data.house[index].id
      wx.navigateTo({
        url: '../../pages/room/details?houseid=' + houseid,
      })
    } else {
      wx.showToast({
        title: '当前未登录，请到我的点击微信一键登录',
        icon: 'none'
      })
    }
  }
})