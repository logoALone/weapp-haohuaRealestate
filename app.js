//app.js
/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat.js')

/**
 * Network API 模块
 * @type {Object}
 */
const network = require('./utils/network.js')

/**
 * Baidu API 模块
 * @type {Object}
 */
const baidu = require('./utils/baidu.js')
App({

  /**
   * WeChat API
   */
  wechat: wechat,

  /**
   * Network API
   */
  network: network,

  /**
   * Baidu API
   */
  baidu: baidu,
  onLaunch: function (e) {
    console.log(e)
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    if ((e.scene == "1007" || e.scene == "1008") && e.path == "pages/room/details") {
      this.globalData.isDetails = true;
    }


    wechat.login()
      .then(res => {
        console.log(res.code)
        return network.login(res.code)
      })
      .then(res => {
        console.log(res.openid)
        this.globalData.openid = res.openid
        return wechat.getLocation() 
      })
      .then(res => {
        const { latitude, longitude } = res
        return baidu.getCityName(latitude, longitude)
      })
      .then(name => {
        this.globalData.currentCity = name
        console.log(`currentCity : ${this.globalData.currentCity}`)
 
        return wechat.getSetting()
      })
      .then(res => {
        console.log(res)
        return wechat.getUserInfo()
      })
      .then(res => {
          this.globalData.userInfo = res.userInfo
          this.globalData.uesrinfoFlag = true
          console.log('APP_onLaunch')
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback({ city: this.globalData.currentCity,
                                        userInfo: this.globalData.userInfo })
          }
      })
      .catch(err => {
        console.log('错误')
        console.log(err)
        console.log('错误')
        if (err.errMsg == 'getLocation:fail auth deny') {
          this.globalData.currentCity = '青岛市'
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback({ city: this.globalData.currentCity })
          }
        } else {
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback({ city: this.globalData.currentCity })
          }
        }
      })
  },

  onShow: function () {
    console.log('APP_onShow')
  },

  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  globalData: {
    isDetails: false,
    changeCityFlag: false,
    currentCity: '青岛市',
    openid: '',
    userid: '',
    uesrinfoFlag: false,
    userInfo: null,
    tabbar: {
      color: "#000000",
      selectedColor: "#333333",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [
        {
          pagePath: "/pages/home/home",
          text: "首页",
          iconPath: "/images/tabbar/home.png",
          selectedIconPath: "/images/tabbar/home_sel.png",
          selected: true,
          flag: true
        },
        {
          pagePath: "/pages/publish/publish",
          text: "发布",
          iconPath: "/images/tabbar/submit.png",
          selectedIconPath: "/images/tabbar/submit.png",
          selected: false,
          flag: false
        },
        {
          pagePath: "/pages/mine/mine",
          text: "我的",
          iconPath: "/images/tabbar/mine.png",
          selectedIconPath: "/images/tabbar/mine_sel.png",
          selected: false,
          flag: true
        }
      ],
      position: "bottom"
    }
  }
})


