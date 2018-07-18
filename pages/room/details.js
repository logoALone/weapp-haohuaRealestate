// pages/room/details.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: {},
    collection: false,
    propertype: ['住宅', '商铺', '公寓', '写字楼'],
    releaseFocus: false,
    comment: '',
    houseid: '',
    count: 0,
    index: 1,
    isShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload");
    console.log(options)
    this.setData({
      houseid: options.houseid
    })

    if (app.globalData.isDetails) {
      this.setData({
        isShare: true
      })
      wx.hideLoading()
    }


    app.userInfoReadyCallback = res => {
      if (app.globalData.isDetails) {
        this.setData({
          isShare: true
        })
      }
      this.getDetails()
    }

    this.getDetails()
  },

  onShareAppMessage: function () {
    return {
      title: '浩华房产转介平台',
      path: 'pages/room/details?houseid=' + this.data.houseid,
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

  getDetails: function () {
    console.log(app.globalData.userid)
    var that = this
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/houseDetail',
      data: {
        houseid: this.data.houseid,
        userid: app.globalData.isDetails ? '0' : app.globalData.userid
      },
      success: function(res) {
        console.log(res.statusCode)
        if (res.statusCode != 200) {
          wx.showToast({
            title: '数据加载失败，请退出重试',
            icon: 'none'
          })
        } else {
          var datalist = res.data.body[0]
          that.setData({
            datalist: datalist,
            collection: datalist.collection,
            count: datalist.images.length
          })
        }
      }
    })
  },
  addcconsult: function () {
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/addcconsult',
      data: {
        houseid: this.data.houseid,
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  clickCollectionButton: function () {
    if (this.data.isShare) {
      wx.showToast({
        title: '请去我的里面点击微信一键登录',
        icon: 'none'
      })
    } else {
      var that = this
      var state = this.data.collection ? '2' : '1'
      wx.request({
        url: 'https://house.haowuwang.cn/house/infa/collection',
        data: {
          houseid: this.data.houseid,
          userid: app.globalData.userid,
          state: state
        },
        success: function (res) {
          console.log(res)

        },
        complete: function () {
          if (state == 2) {
            that.setData({
              collection: false
            })
          } else {
            that.setData({
              collection: true
            })
          }
        }
      })
    }
  },
  makeCall: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.datalist.house.phone,
      success: function (res) {
        console.log(res)
        that.addcconsult()
      }
    })
  },
  bindReply: function (e) {
    if (this.data.isShare) {
      wx.showToast({
        title: '请去我的里面点击微信一键登录',
        icon: 'none'
      })
    } else {
      this.setData({
        releaseFocus: true
      })
    }
  },
  textinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      comment: e.detail.value
    })
  },
  addComment: function (e) {
    var that = this
    if (this.data.comment.length != 0) {
      wx.request({
        url: 'https://house.haowuwang.cn/house/infa/addComment',
        data: {
          houseid: this.data.houseid,
          userid: app.globalData.userid,
          comment: this.data.comment
        },
        success: function (res) {
          console.log(res)
          that.setData({
            releaseFocus: false,
            comment: ''
          })
          if (res.data.rec == "SUC") {
            that.getDetails()
          }
        }
      })
    } else {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      })
    }    
  },
  change: function (e) {
    console.log(e.detail.current)
    this.setData({
      index: e.detail.current + 1
    })
  },
  checkImage: function (e) {
    console.log(e.currentTarget.dataset.index)
    var index
    var urlArray = new Array();
    for (index in this.data.datalist.images) {
      console.log(this.data.datalist.images[index].images)
      urlArray.push(this.data.datalist.images[index].images)
    }

    wx.previewImage({
      current: urlArray[e.currentTarget.dataset.index],
      urls: urlArray,
    })
  },
  goBackHome: function () {

    if (app.globalData.uesrinfoFlag) {
      wx.redirectTo({
        url: '/pages/home/home',
      })
    } else {
      wx.redirectTo({
        url: '/pages/mine/mine',
      })
    }
  }

})

