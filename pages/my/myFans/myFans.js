var app = getApp();
var api = require('../../../utils/api');
var API_GET = api.getFansList;
var API_FOLLOW = api.followUser;


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    app.request(API_GET, {
      openid: app.globalData.openId,
    }, "GET", this.getSuccess)

  },

  getSuccess: function (data) {
    this.exeData(data.data.result)
  },

  exeData: function (data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].userAvartar == null || data[i].userAvartar == "null" || data[i].userAvartar.length == 0) {
        data[i].showImg = false;
      } else {
        data[i].showImg = true;
      }
      data[i].isFollow=true;
    }
    this.setData({
      list: data
    })
    console.log(this.data.list)
  },
  goAllIssue: function (e) {
    console.log(e)
    var openid = e.currentTarget.dataset.src
    var url = "../userAllIssue/userAllIssue?openid=" + openid
    if (app.globalData.userState != 0) {
      wx.showModal({
        title: '提示',
        content: '未认证的用户不能查看其他用户的信息喔',
        success: function (res) {}
      })
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  },

  changeFollow:function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.src
    var that =this
    app.request(API_FOLLOW, {
      openid: app.globalData.openId,
      followedOpenid:that.data.list[index].userOpenid
    }, "POST", this.changeFollowSuccess)
    var list =this.data.list
    list[index].isFollow = !list[index].isFollow
    this.setData({list:list})
  },

  changeFollowSuccess:function () {
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    wx.setNavigationBarTitle({
      title: '我的粉丝'
    })

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