// pages/mine/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ["1",
      "2",
      "1",
      "2"],
    userid: '',
    house: [],
    pageNow: 1,
    hasNext: false
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('收藏出现')
    this.data.house.splice(0, this.data.house.length)
    this.getCollectData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNext) {
      this.getCollectData()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getCollectData: function () {
    var that = this
    var datalist = this.data.house
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/myCollectionList',
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
          house: datalist,
          pageNow: that.data.pageNow,
          hasNext: e.data.body[0].page.hasNext
        })
      }
    })
  },
  clickcell: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var houseid = this.data.house[index].id

    console.log(houseid)

    wx.navigateTo({
      url: '../../../pages/room/details?houseid=' + houseid,
    })
  }
})