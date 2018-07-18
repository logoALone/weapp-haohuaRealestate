// pages/mine/publish/publish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNext) {
      this.getpublishData()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading'
      })
    }
  },
  onShow: function () {
    this.data.house.splice(0, this.data.house.length)
    this.getpublishData()
  },
  getpublishData: function () {
    var that = this
    var datalist = this.data.house
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/myList',
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
  },
  clickEdit: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var houseid = this.data.house[index].id
    var areaid = this.data.house[index].areaid
    console.log(houseid)

    wx.navigateTo({
      url: '../publish/edit?'+`houseid=${houseid}&areaid=${areaid}`,
    })
  },
  clickDelete: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var houseid = this.data.house[index].id
    var that = this
    console.log(houseid)
    wx.showModal({
      title: '提示',
      content: '确定删除这条发布！',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: 'https://house.haowuwang.cn/house/infa/deletehouse',
            data: {
              houseid: houseid
            },
            success: function (res) {
              console.log(res.data.rec)
              if (res.data.rec == 'SUC') {
                that.data.house.splice(index, 1)
                that.setData({
                  house: that.data.house,
                })
                wx.showToast({
                  title: '删除成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
              }
            },
            fail: function (res) {

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})