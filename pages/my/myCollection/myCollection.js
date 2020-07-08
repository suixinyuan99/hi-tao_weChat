var app = getApp();
var api = require('../../../utils/api');
var API_URL = api.myCollection;
Page({
    data: {
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        updateShow: "none",
        list: [],
        avatarUrl: "",
        noDataSell: true,
        noDataBuy: true,
        page: 0
    },
    onLoad: function (options) {
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
        this.getLists();
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的收藏'
        })
    },
    bindChange: function (e) {
        var that = this;
        that.setData({currentTab: e.detail.current});
    },
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    onPullDownRefresh: function () {
        this.getLists();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
    },
    getLists: function () {
        var that = this;
        var openid = getApp().globalData.openId;
        app.request(API_URL, {openid: openid}, 'GET', this.getMyCollectionSuccess);
    },
    getMyCollectionSuccess: function (res) {
        console.log(res);
        if (res.statusCode == 404) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
        }else{
            var dataSell = res.data.sellGood;
            var dataBuy = res.data.buyGood;
            var newDataSell = [];
            if (dataSell.length != 0) {
                for (let i = 0; i < dataSell.length; i++) {
                    if (dataSell[i].sellGood.imageUrl == "" || dataSell[i].sellGood.imageUrl.length == 0) {
                        dataSell[i].sellGood.showImg = false;
                    } else {
                        dataSell[i].sellGood.showImg = true;
                    }
                    newDataSell.push(dataSell[i].sellGood)
                }

            }
            var newDataBuy = [];
            if (dataBuy.length != 0) {
                for (let i = 0; i < dataBuy.length; i++) {
                    if (dataBuy[i].buyGood.imageUrl == "" || dataBuy[i].buyGood.imageUrl.length == 0) {
                        dataBuy[i].buyGood.showImg = false;
                    } else {
                        dataBuy[i].buyGood.showImg = true;
                    }
                    newDataBuy.push(dataBuy[i].buyGood);
                }
            }
            this.setData({
                list: newDataSell,
                list1: newDataBuy
            })
            wx.hideLoading();
        }
    },
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