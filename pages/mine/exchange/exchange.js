// pages/mine/exchange/exchange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: [],
    userid: '',
    pageNow: 1,
    hasNext: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userid: options.userid
    })
    this.getRecordList()
  },
  
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.hasNext) {
      this.getRecordList()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading'
      })
    }
  },

  getRecordList: function () {
    var that = this
    var datalist = this.data.datalist
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/recordList',
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
        that.setData({
          datalist: datalist,
          pageNow: that.data.pageNow,
          hasNext: e.data.body[0].page.hasNext
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})