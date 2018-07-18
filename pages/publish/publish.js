// pages/mine/aboutus/aboutus.js
var area = require('../../utils/area.js')
var app = getApp()

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    items: [
      { name: 1, value: '新房', checked: 'true' },
      { name: 2, value: '二手房' },
    ],
    formatArr: ["住宅", "商铺", "公寓", "写字楼"],
    taglist: [1],
    imagelist: [],
    imgPath: [],
    imageIcon: '',
    imageIconPath: '',
    imageSelect: true,
    format: '请选择房屋类型',
    region: ['山东省', '青岛市', '市南区'],
    tag1: '',
    tag2: '',
    tag3: '',
    tagIndex: '0',
    url: '',
    propertype: '',
    state: '1',
    areaid: '',
    areaname: '',
    areaflag: true,
    selectCity: '',
    commissionTye: ['固定金额', '百分比'],
    commissionTtle: '',
    commissionSelector: true,
    commissionprice: -1,
    hidden: false,
  },
  bindSelectCommission: function (e) {
    console.log(e)
    var commissionprice
    if (e.detail.value == 0){
      commissionprice = 0
    }else {
      commissionprice = -1 
    }
    this.setData({
      commissionTtle: this.data.commissionTye[e.detail.value],
      commissionSelector: false,
      commissionprice: commissionprice
    })

  },
  bindscroll: function (e) {
    console.log(e)
  },
  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;

    console.log(index + " => " + val);

    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      city: citys[val[1]].name,
      county: countys[val[2]].name,
      areaid: countys[val[2]].code,
      areaname: countys[val[2]].name,
      selectCity: provinces[val[0]].name + citys[val[1]].name + countys[val[2]].name,
      areaflag: false
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.uesrinfoFlag) {

      if (app.globalData.userid == null || app.globalData.userid == undefined || app.globalData.userid == '') {
        console.log('---------------------')
        wx.showModal({
          title: '提示',
          content: '请到我的点击微信一键登录',
          confirmText: '确定',
          showCancel: false,
          // cancelText: '取消',
          success: function () {
            wx.navigateBack({

            })
          }
        })
      } else {
        console.log('+++++++++++++++++++++')
        var that = this;
        //获取省市区县数据
        area.getAreaInfo(function (arr) {
          areaInfo = arr;
          //获取省份数据
          getProvinceData(that);
        });
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请到我的点击微信一键登录',
        confirmText: '确定',
        showCancel: false,
        // cancelText: '取消',
        success: function() {
          wx.navigateBack({
            
          })
        }
      })
    }


  },
  // ------------------- 分割线 --------------------
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },

  onShow: function() {
    var that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];

    console.log('publish appear')
    if (currPage.data.cropImg) {
      console.log(currPage.data.img)
      wx.uploadFile({
        url: 'https://house.haowuwang.cn/house/uploadhouseImage',
        filePath: currPage.data.img,
        name: 'file',
        complete: function (e) {
          console.log(e)
          var url = 'http://house.haowuwang.cn/houseImg/' + currPage.data.img.slice(9)
          console.log(url)
          that.setData({
            imageIcon: currPage.data.img,
            imageIconPath: url,
            imageSelect: false
          })
        }
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
  //移动按钮点击事件
  translate: function (e) {
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);
    this.setData({
      hidden: true
    })

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
    this.setData({
      hidden: false
    })

  },
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    var index = this.data.multiIndex[2]
    console.log(this.data.arealist[index])
  },
  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      state: e.detail.value
    })
  },
  bindPickerChangeFormat: function (e) {
    console.log(e.detail.value)
    var index = e.detail.value
    var propertype = parseInt(index) + 1
    this.setData({
      format: this.data.formatArr[index],
      propertype: propertype
    })
    console.log(this.data.propertype)
  },
  addtag: function () {
    var taglist = this.data.taglist
    if (this.data.tagIndex == '0') {
      if (this.data.tag1.length != 0) {
        console.log(this.data.tag1)
        taglist.push('')
        this.setData({
          taglist: taglist,
          tagIndex: 1
        })
      } else {
        wx.showToast({
          title: '您有未填入的标签',
          icon: 'none'
        })
      }
    } else if (this.data.tagIndex == '1') {
      if (this.data.tag2.length != 0) {
        console.log(this.data.tag2)
        taglist.push('')
        this.setData({
          taglist: taglist,
          tagIndex: 2
        })
      } else {
        wx.showToast({
          title: '您有未填入的标签',
          icon: 'none'
        })
      }
    }
    console.log('addtag')
  },
  bindtaginput: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.id
    var str = e.detail.value
    this.setData({
      tagIndex: index
    })
    if (str.length > 0) {
      switch (index) {
        case 0:
          this.data.tag1 = str
          break
        case 1:
          this.data.tag2 = str
          break
        case 2:
          this.data.tag3 = str
          break
      }
    } else {
      if (this.data.taglist.length > 1) {
        this.data.taglist.splice(index, 1)
        this.setData({
          taglist: this.data.taglist
        })
        if (index == 0) {
          this.setData({
            tag1: this.data.tag2,
            tag2: this.data.tag3,
            tag3: ''
          })
        } else if (index == 1) {
          this.setData({
            tag1: this.data.tag1,
            tag2: this.data.tag3,
            tag3: ''
          })
        } else {
          this.setData({
            tag1: this.data.tag1,
            tag2: this.data.tag2,
            tag3: ''
          })
        }
      }
      if (this.data.taglist.length == 1) {
        this.setData({
          tagIndex: 0
        })
      } else {
        this.setData({
          tagIndex: 1
        })
      }
    }
  },
  deleteTag: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.id
    if (this.data.taglist.length > 1) {
      this.data.taglist.splice(index, 1)
      this.setData({
        taglist: this.data.taglist
      })
      if (index == 0) {
        this.setData({
          tag1: this.data.tag2,
          tag2: this.data.tag3,
          tag3: ''
        })
      } else if (index == 1) {
        this.setData({
          tag1: this.data.tag1,
          tag2: this.data.tag3,
          tag3: ''
        })
      } else {
        this.setData({
          tag1: this.data.tag1,
          tag2: this.data.tag2,
          tag3: ''
        })
      }
    }
    if (this.data.taglist.length == 1) {
      this.setData({
        tagIndex: 0
      })
    } else {
      this.setData({
        tagIndex: 1
      })
    }
  },
  addIcon: function () {
    var that = this
    console.log(11111111111)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const src = res.tempFilePaths[0]
        wx.navigateTo({
          url: `/pages/publish/upload/upload?src=${src}`,
        })
      },
    })
  },

  addimage: function () {
    var that = this
    var imagelist = that.data.imagelist
    var imgPath = that.data.imgPath
    var count = that.data.imagelist.length
    console.log(count)
    wx.chooseImage({
      count: 5 - count,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
          mask: true,
        })
        var fileList = res.tempFilePaths
        console.log(fileList)
        var lg = fileList.length
        var add = 0;
        var arr = []
        var dataArr = []//上传图片路径
        for (let k = 0; k < lg; k++) {
          var tmpRes
          arr.push(fileList[k])
          imagelist.push(fileList[k])
          wx.uploadFile({
            url: 'https://house.haowuwang.cn/house/uploadhouseImage',
            filePath: fileList[k],
            name: 'file',
            complete: function (e) {
              console.log(e)
              var url = 'http://house.haowuwang.cn/houseImg/' + fileList[k].slice(9)
              imgPath.push(url)
              add += 1
              that.setData({
                imagelist: imagelist,
                imgPath: imgPath
              })
              if (lg == add) {
                wx.hideLoading()
              }
            }
          })
        }
      },
    })
  },
  deleteImage: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.id
    this.data.imagelist.splice(index, 1)
    this.data.imgPath.splice(index, 1)
    this.setData({
      imagelist: this.data.imagelist
    })
  },
  checkImage: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.id
    wx.previewImage({
      current: this.data.imagelist[index],
      urls: this.data.imagelist,
    })
  },
  formSubmit: function (e) {
    wx.showLoading({
      title: '发布中',
      mask: true,
    })
    var tag
    if (this.data.tag2.length == 0) {
      tag = this.data.tag1
    } else if (this.data.tag3.length == 0) {
      tag = this.data.tag1 + ';' + this.data.tag2
    } else if (this.data.tag3.length != 0){
      tag = this.data.tag1 + ';' + this.data.tag2 + ';' + this.data.tag3
    }


    var path
    var image = ''
    for (path in this.data.imgPath) {
      if (path < this.data.imgPath.length - 1) {
        image = image + this.data.imgPath[path] + ';'
        console.log(1111111 + image)
      } else {
        image = image + this.data.imgPath[path]
        console.log(2222222 + image)
      }
    }

    if (e.detail.value.username == null || e.detail.value.username == undefined || e.detail.value.username == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    } else if (e.detail.value.phone == null || e.detail.value.phone == undefined || e.detail.value.phone == '') {
      wx.showToast({
        title: '请输入手机',
        icon: 'none'
      })
    } else if (this.data.imageIconPath == null || this.data.imageIconPath == undefined || this.data.imageIconPath == '') {
      wx.showToast({
        title: '请上传本人头像',
        icon: 'none'
      })
    } else if (e.detail.value.title == null || e.detail.value.title == undefined || e.detail.value.title == '') {
      wx.showToast({
        title: '请输入项目名称',
        icon: 'none'
      })
    } else if (e.detail.value.price == null || e.detail.value.price == undefined || e.detail.value.price == '') {
      wx.showToast({
        title: '请输入总价',
        icon: 'none'
      })
    } else if (e.detail.value.size == null || e.detail.value.size == undefined || e.detail.value.size == '') {
      wx.showToast({
        title: '请输入面积',
        icon: 'none'
      })
    } else if (e.detail.value.commission == null || e.detail.value.commission == undefined || e.detail.value.commission == '') {
      wx.showToast({
        title: '请输入金额或百分比',
        icon: 'none'
      })
    } else if (this.data.propertype == null || this.data.propertype == undefined || this.data.propertype == '') {
      wx.showToast({
        title: '请选择房屋类型',
        icon: 'none'
      })
    } else if (e.detail.value.type == null || e.detail.value.type == undefined || e.detail.value.type == '') {
      wx.showToast({
        title: '请输入户型',
        icon: 'none'
      })
    } else if (this.data.areaid == null || this.data.areaid == undefined || this.data.areaid == '') {
      wx.showToast({
        title: '请选择项目区域',
        icon: 'none'
      })
    } else if (e.detail.value.address == null || e.detail.value.address == undefined || e.detail.value.address == '') {
      wx.showToast({
        title: '请选择项目区域',
        icon: 'none'
      })
    } else if (tag == null || tag == undefined || tag == '') {
      wx.showToast({
        title: '添加标签',
        icon: 'none'
      })
    } else if (e.detail.value.content == null || e.detail.value.content == undefined || e.detail.value.content == '') {
      wx.showToast({
        title: '请输入详情描述',
        icon: 'none'
      })
    } else if (image == null || image == undefined || image == '') {
      wx.showToast({
        title: '请添加项目图片',
        icon: 'none'
      })
    } else {
      console.log(e)
      console.log(this.data.imgPath)
      console.log('form发生了submit事件，携带数据为：', e.detail.value)

      var end = e.detail.value.commission
      end = end.slice(end.length - 1, end.length)

      var commissionP = parseInt(e.detail.value.commission)

      console.log(commissionP)

      if (!Boolean(commissionP)){
        wx.showToast({
          title: '转介佣金输入有误',
          icon: 'none'
        })
      } else {
        console.log(end)

        if (end == "%") {
          this.setData({
            commissionprice: -1
          })
        } else {
          this.setData({
            commissionprice: commissionP
          })
        }

        console.log(image)
        console.log(this.data.areaid)
        console.log(this.data.areaname)

        wx.request({
          url: 'https://house.haowuwang.cn/house/infa/addhouse',
          data: {
            areaid: this.data.areaid,
            areaname: this.data.areaname,
            state: this.data.state,
            type: e.detail.value.type,
            price: e.detail.value.price,
            title: e.detail.value.title,
            content: e.detail.value.content,
            username: e.detail.value.username,
            commission: e.detail.value.commission,
            commissionprice: this.data.commissionprice,
            propertype: this.data.propertype,
            size: e.detail.value.size,
            phone: e.detail.value.phone,
            address: e.detail.value.address,
            label: tag,
            userid: app.globalData.userid,
            image: image,
            userimage: this.data.imageIconPath
          }, success: function (res) {
            console.log(res)
            if (res.data.rec == "SUC") {
              wx.showToast({
                title: '发布成功',
                icon: 'none',
                success: function (e) {
                  wx.hideLoading()
                  wx.navigateBack({

                  })
                }
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '发布失败,请检查网络!',
                icon: 'none'
              })
            }
          }
        })
      }
    }
  }

})

function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province: "北京市",
    city: "市辖区",
    county: "东城区",
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}