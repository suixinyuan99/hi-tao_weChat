var app = getApp();
var api = require('../../../utils/api');
var API_GET = api.getUserAllIssue;
var API_ISFOLLOW = api.isFollow;
var API_FOLLOW = api.followUser;
var API_USERINFO=api.getUserInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchOpenid:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    console.log(params);
    this.setData({
      searchOpenid: params.openid
    })

    app.request(API_GET, {
      openid: this.data.searchOpenid,
    }, "GET", this.getSuccess)

    app.request(API_USERINFO, {
      openid: this.data.searchOpenid,
    }, "GET", this.getInfoSuccess)

    app.request(API_ISFOLLOW, {
      openid1: app.globalData.openId,
      openid2: this.data.searchOpenid
    }, "GET", this.getFollowSuccess)

    var that = this

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  getFollowSuccess: function (data) {

    var isFollow = false
    if (data.data.result == 1) {
      isFollow = true
    }
    this.setData({
      isFollow: isFollow
    })
  },

  getInfoSuccess:function (data) {

    var info=data.data.result
    console.log(info)
    if(info.userAvartar==null||info.userAvartar==""){
      info.showImg=false
    }
    this.setData({
      showImg:info.showImg,
      userAvartar:info.userAvartar,
      userName:info.userName,
      fansNum:info.fansNum,
      followNum:info.followNum
    })
    
  },


  getSuccess: function (data) {
    this.exeData(data.data.result)
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
  changeFollow: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.src
    app.request(API_FOLLOW, {
      openid: app.globalData.openId,
      followedOpenid: this.data.searchOpenid
    }, "POST", this.changeFollowSuccess)
    var isFollow = this.data.isFollow
    isFollow = !isFollow
    this.setData({
      isFollow:isFollow
    })
  },

  changeFollowSuccess: function () {
    wx.showToast({
      title: '成功',
      icon: 'succes',
      mask: true,
      duration: 1500,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '用户详情'
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