var app = getApp();
var api = require('../../../utils/api');
var API_URL = api.getMySelling;

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
        page: 0,
        loading: false
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
            title: '我卖出的'
        })
    },
    onPullDownRefresh: function () {
        this.getLists();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
    },
    getLists: function () {
        var that = this;
        var openid = app.globalData.openId;
        app.request(API_URL, {
            openid: openid
        }, 'GET', this.getMySellingSuccess);
    },
    getMySellingSuccess: function (res) {
        console.log(res);
        if (res.statusCode == 404) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
        } else {
            var data = res.data.result
            var money =0
            if (data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    money=money+parseFloat(data[i].sgPrice)
                    if (data[i].sgFirstImgUrl == "" ||  data[i].sgFirstImgUrl == null) {
                        data[i].showImg = false;
                    } else {
                        data[i].showImg = true;
                    }
                    if (data[i].sgType == "bg") {
                        data[i].goodTypeShow = "求购"
                    }
                    if (data[i].sgType == "sg") {
                        data[i].goodTypeShow = "转让"
                    }
                    if (data[i].sgType == "tg") {
                        data[i].goodTypeShow = "拼单"
                    }
                }
            }
            this.setData({
                list: data,
                money:money
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