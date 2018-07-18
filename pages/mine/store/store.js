// pages/mine/store/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    pointlist: [],
    banner: [],
    broad: [],
    points: '',
    pageNow: 1,
    hasNext: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      userid: options.userid
    })
    
  },
  onShow: function (options) {
    this.data.pointlist.splice(0, this.data.pointlist.length)
    this.getStoreInfo()
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.hasNext) {
      this.getStoreInfo()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading'
      })
    }
  },
  getStoreInfo: function () {
    var that = this
    var datalist = this.data.pointlist
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/pointStore',
      data: {
        userid: this.data.userid,
        pageNow: this.data.pageNow
      },
      success: function (e) {
        console.log(e)
        if (e.data.body[0].page.hasNext) {
          that.data.pageNow = that.data.pageNow + 1
        }
        var index
        for (index in e.data.body[0].rows) {
          datalist.push(e.data.body[0].rows[index])
        }
        console.log(datalist)
        that.setData({
          banner: e.data.body[0].banner,
          broad: e.data.body[0].broad,
          points: e.data.body[0].points,
          pointlist: datalist,
          pageNow: that.data.pageNow,
          hasNext: e.data.body[0].page.hasNext,
          count: e.data.body[0].banner.length
        })
      }
    })
  },
  clickExchangelistButton: function () {
    wx.navigateTo({
      url: '/pages/mine/exchange/exchange' + '?userid=' + this.data.userid,
    })
  },
  clickExchangeButton: function (e) {
    console.log(e)
    console.log("兑换商品")
    var tag = e.currentTarget.id
    if (parseInt(this.data.pointlist[tag].number) > parseInt(this.data.points)) {
      wx.showToast({
        title: '积分不足',
        icon: 'none'
      })
    }else {
      var commodityid = this.data.pointlist[tag].id
      wx.navigateTo({
        url: '/pages/mine/store/address' + '?commodityid=' + commodityid,
      })
    }
  }   
})