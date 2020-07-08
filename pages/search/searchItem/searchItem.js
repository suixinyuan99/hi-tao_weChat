var app = getApp();
var api = require('../../../utils/api');
var API_SEARCH = api.searchUserItem;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    priceShow: ["价格默认排序", "价格升序排列", "价格降序排列"],
    price: ["no", "increase", "decrease"],
    campusShow: ["不限校区", "南校区", "北校区"],
    campus: ["no", "south", "north"],
    priceIndex: 0,
    campusIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    console.log(params);
    this.setData({
      searchValue: params.value
    })
    this.search(this.data.searchValue, "no", "no")
    
    var that=this

    wx.getSystemInfo({
      success: function (res) {
          that.setData({
              winWidth: res.windowWidth,
              winHeight: res.windowHeight
          });
      }
  });
  },

  search: function (value, priceSort, campusSort) {
    wx.showToast({
      title: '搜索中...',
      icon: 'loading',
      mask: true,
      duration: 10000,
      fail: function () {
        console.log('加载超时');
      }
    })
    if (priceSort == "no") {
      if (campusSort == "no") {
        app.request(API_SEARCH, {
          word: value,
          openid: app.globalData.openId,
          searchType: "good"
        }, "POST", this.searchSuccess)
      } else {
        app.request(API_SEARCH, {
          word: value,
          openid: app.globalData.openId,
          searchType: "good",
          campusSort: campusSort
        }, "POST", this.searchSuccess)
      }
    } else {
      if (campusSort == "no") {
        app.request(API_SEARCH, {
          word: value,
          openid: app.globalData.openId,
          searchType: "good",
          priceSort: priceSort
        }, "POST", this.searchSuccess)
      } else {
        app.request(API_SEARCH, {
          word: value,
          openid: app.globalData.openId,
          searchType: "good",
          campusSort: campusSort,
          priceSort: priceSort
        }, "POST", this.searchSuccess)
      }
    }

  },


    searchSuccess: function (data) {
      this.exeData(data.data.result)
      wx.hideToast()
    },
  exeData: function (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].firstImageUrl == null || data[i].firstImageUrl.length == 0) {
        data[i].showImg = false;
      } else {
        data[i].showImg = true;
      }
    }
    this.setData({
      list: data
    })
    console.log(this.data.list)

  },

  // 三个可能导致搜索的行为

  searchConfirm:function (e) {
    var searchName=e.detail.value
    this.search(searchName,this.data.price[this.data.priceIndex],this.data.campus[this.data.campusIndex])
  },

  priceChange: function (e) {
    this.setData({
      priceIndex: e.detail.value
    })
    this.search(this.data.searchValue,this.data.price[this.data.priceIndex],this.data.campus[this.data.campusIndex])
  },
  campusChange: function (e) {
    this.setData({
      campusIndex: e.detail.value
    })
    this.search(this.data.searchValue,this.data.price[this.data.priceIndex],this.data.campus[this.data.campusIndex])
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '搜索结果'
  })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '能买能卖能say hi！',
      path: '/pages/shouquan/shouquan',
      success: (res) => {
          console.log("转发成功", res);
      }
  }

  }
})