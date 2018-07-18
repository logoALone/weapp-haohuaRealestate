var app = getApp()
Page({
  data: {
    pageNow: 1,
    hasNext: false,
    limit: 10,
    room_type: '', //房屋类型
    scrollTop: 0,//最小面积
    selectedArea: '',  // 区域选中的筛选
    selectedprice: '',  // 售价选中的筛选
    shi: 0,
    wei: 0,
    ting: 0,
    sort: 0,
    data: {},
    code:'',
    value:'',
    state: '',
    propertype: '',
    commission: '',
    time: '',
    cityname: '',
    structureList: {
      name: ['零', '一', '二', '三', '四', '五'],
    },
    show: { // popup flag
      'price': false,
      'structure': false,
      'more': false,
    },
    sortWay: ['总价从低到高', '总价从高到低', '面积从小到大', '面积从大到小'],
    priceList: [  // price list
      { name: '100万以下', value: '1' },
      { name: '100万-200万', value: '2' },
      { name: '200万-300万', value: '3' },
      { name: '300万-400万', value: '4' },
      { name: '400万-500万', value: '5' },
      { name: '500万以上', value: '6' },
    ],
    moreList2: [ // more list 
      {
        group: '发布时间',
        name: 'decoration',
        value: [1, 2, 3],
        active: 'default', // 被选中的 range:subs
        subs: ['1天内', '7天内', '30天内']
      },
      {
        group: '物业类型',
        name: 'variety',
        value: [1, 2, 3, 4],
        active: 'default', // 被选中的 range:subs
        subs: ['住宅', '商铺', '公寓', '写字楼']
      },
      {
        group: '佣金',
        name: 'order',
        value: [1, 2, 3, 4],
        active: 'default', // 被选中的 range:subs
        subs: ['1000以内', '1000-5000', '5000-10000', '10000以上']
      },
    ],
    house: [  //house list
    ]
  },
  backToTop: function (e) {
    this.setData({
      'scrollTop': 0
    })
  },
  moreSubmit2: function (e) {
    // var that = this
    this.data.house.splice(0, this.data.house.length)
    this.setData({
      'show': { price: false, structure: false, more: false },
      'selected': '',
      pageNow: 1,
      hasNext: false,
    })
    this.searchlist()
  },
  moreReset: function (e) {
    console.log(e)
    this.setData({
      time: '',
      propertype: '',
      commission: '',
      'selectedArea': '',
      'selectedprice': '',
      value: '',
      code: this.data.original,
      moreList2: [ // more list 
        {
          group: '发布时间',
          name: 'decoration',
          value: [1, 2, 3],
          active: 'default', // 被选中的 range:subs
          subs: ['1天内', '7天内', '30天内']
        },
        {
          group: '物业类型',
          name: 'variety',
          value: [1, 2, 3, 4],
          active: 'default', // 被选中的 range:subs
          subs: ['住宅', '商铺', '公寓', '写字楼']
        },
        {
          group: '佣金',
          name: 'order',
          value: [1, 2, 3, 4],
          active: 'default', // 被选中的 range:subs
          subs: ['1000以内', '1000-5000', '5000-10000', '10000以上']
        },
      ]
    })
  },
  btnCancel: function (e) {
    console.log(e)
    this.setData({
      time: '',
      propertype: '',
      commission: '',
      pageNow: 1,
      hasNext: false,
      'selectedArea': '',
      'selectedprice': '',
      value: '',
      code: this.data.original,
      moreList2: [ // more list 
        {
          group: '发布时间',
          name: 'decoration',
          value: [1, 2, 3],
          active: 'default', // 被选中的 range:subs
          subs: ['1天内', '7天内', '30天内']
        },
        {
          group: '物业类型',
          name: 'variety',
          value: [1, 2, 3, 4],
          active: 'default', // 被选中的 range:subs
          subs: ['住宅', '商铺', '公寓', '写字楼']
        },
        {
          group: '佣金',
          name: 'order',
          value: [1, 2, 3, 4],
          active: 'default', // 被选中的 range:subs
          subs: ['1000以内', '1000-5000', '5000-10000', '10000以上']
        },
      ]
    })
    this.data.house.splice(0, this.data.house.length)
    this.searchlist()
  },
  priceChange: function (e) { // change query.price
    var that = this
    console.log(e)
    var value = e.target.dataset.value
    this.setData({
      value: e.target.dataset.value,
      pageNow: 1,
      hasNext: false,
    })
    this.data.house.splice(0, this.data.house.length)
    this.searchlist()
    that.setData({
      'show': { price: false, structure: false, more: false },
      'selectedprice': e.target.dataset.name
    })
  },
  areaChange: function (e) { // change query.price
    var that = this
    console.log(e)
    var code = e.target.dataset.code
    this.setData({
      code: code,
      pageNow: 1,
      hasNext: false,
    })
    this.data.house.splice(0, this.data.house.length)
    this.searchlist()
    this.setData({
      'show': { price: false, structure: false, more: false },
      'selectedArea': e.target.dataset.name
    })
  },

  structureSubmit: function (e) {
    var that = this
    var data = {}
    data.room = that.data.shi
    data.hall = that.data.ting
    data.toilet = that.data.wei
  },
  subChange: function (e) { //切换选中的sub
    var data = {}
    var value = e.target.dataset.value + 1
    console.log(value)
    console.log('______')
    var index = e.target.dataset.index
    switch (index) {
      case 0:
        this.setData({
          time: value
        })
      break
      case 1:
        this.setData({
          propertype: value
        })
      break
      case 2:
        this.setData({
          commission: value
        })
      break
    }

    data[e.target.dataset.key + '[' + e.target.dataset.index + '].active'] = e.target.dataset.flag
    console.log(data)
    this.setData(data)
  },
  tabChange: function (e) { //切换popup
    console.log(this.show)
    if (this.data.show[e.target.dataset.flag] == true || e.target.dataset.flag == 'modal') {   // hide all
      this.setData({
        'show.price': false,
        'show.structure': false,
        'show.more': false,
      })
    } else {
      if (e.target.dataset.flag == 'price') { //show price
        this.setData({
          'show.price': true,
          'show.structure': false,
          'show.more': false,
        })
      }
      if (e.target.dataset.flag == 'structure') { //show structrure
        this.setData({
          'show.price': false,
          'show.structure': true,
          'show.more': false,
        })
      }
      if (e.target.dataset.flag == 'more') { //show more
        this.setData({
          'show.price': false,
          'show.structure': false,
          'show.more': true,
        })
      }
    }
  },
  sortChange: function (e) {
    var that = this
    console.log(e)
    var data = {}
    data.order = e.detail.value + 1
  },
  searchChange: function (e) {
    console.log(e)
    this.setData({
      'searchText': e.detail.value
    })
  },
  search: function (e) {
    var that = this
    console.log(e)
    var data = {
      'title': that.data.searchText
    }
  },
  scroll: function (e) {
    var that = this
    var data = that.data.data
  },
  onLoad: function (e) {
    console.log(e)
    var that = this
    //获取房屋列表
    var state
    if (e.room_type == '1') {
      wx.setNavigationBarTitle({ title: '新房' })
      state = '1'
    }
    else if (e.room_type == '2') {
      wx.setNavigationBarTitle({ title: '二手房' })
      state = '2'
    } else {
      wx.setNavigationBarTitle({ title: '房屋搜索' })
      state = ''
    }
    this.setData({
      cityname: e.cityname,
      code: e.areaid,
      state: state,
      original: e.areaid
    })
    this.getDistrictList()
    this.searchlist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNext) {
      this.searchlist()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading'
      })
    }
  },

  searchlist: function () {
    var that = this

    console.log("pageNow:" + this.data.pageNow + 
                'areaid:' + this.data.code + 
                 'price:' + this.data.value + 
                 'state:' + this.data.state +
            'propertype:' + this.data.propertype +
            'commission:' + this.data.commission +
                  'time:' + this.data.time)

    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/filterhouseList',
      data: {
        pageNow: this.data.pageNow,
        areaid: that.data.code,
        price: that.data.value,
        state: that.data.state,
        propertype: that.data.propertype,
        commission: that.data.commission,
        time: that.data.time
      },
      success: function (e) {

        console.log(e)
        var datalist = that.data.house
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
  getDistrictList: function (res) {
    var that = this
    wx.request({
      url: 'https://house.haowuwang.cn/house/infa/areaList',
      data: {
        cityname: that.data.cityname
      },
      success: function (res) {
        console.log(res.data.body)
        that.setData({
          areaList: res.data.body
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
