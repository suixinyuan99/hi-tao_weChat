// pages/search/searchUser/searchUser.js

var app = getApp();
var api = require('../../../utils/api');
var API_SEARCH = api.searchUserItem;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    console.log(params);
    this.setData({
      searchValue: params.value
    })
    this.search(this.data.searchValue)

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
  search: function (value) {
    wx.showToast({
      title: '搜索中...',
      icon: 'loading',
      mask: true,
      duration: 10000,
      fail: function () {
        console.log('加载超时');
      }
    })
    app.request(API_SEARCH, {
      word: value,
      openid: app.globalData.openId,
      searchType: "user",
    }, "POST", this.searchSuccess)
  },

  searchSuccess: function (data) {
    this.exeData(data.data.result)
    wx.hideToast()
  },
exeData: function (data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].userAvartar == null ||data[i].userAvartar == "null" || data[i].userAvartar.length == 0) {
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

goAllIssue:function (e) {
  console.log(e)
  var openid =e.currentTarget.dataset.src
  var url = "../../my/userAllIssue/userAllIssue?openid="+openid
  if(app.globalData.userState!=0){
    wx.showModal({
      title: '提示',
      content: '未认证的用户不能查看其他用户的信息喔',
      success: function (res) {
      }
  })
  } else {
    wx.navigateTo({
      url: url,
    })
  }
  
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