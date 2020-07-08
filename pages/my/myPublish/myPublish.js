var app = getApp();
var api = require('../../../utils/api');
var API_URL = api.myPublish;
var API_END=api.finishProduct;
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
            title: '我的发布'
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
        app.request(API_URL, {openid: openid}, 'GET', this.getMyPublishSuccess);
    },
    getMyPublishSuccess: function (res) {
        console.log(res);
        if(res.statusCode==404){
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
        }else{
            var dataSell = res.data.sellGood;
            var dataBuy = res.data.buyGood;
            if(dataSell.length!=0){
                for (let i = 0; i < dataSell.length; i++) {
                    if (dataSell[i].imageUrl == ""||dataSell[i].imageUrl.length == 0) {
                        dataSell[i].showImg = false;
                    } else {
                        dataSell[i].showImg = true;
                    }
                }
            }
            if(dataBuy.length!=0){
                for (let i = 0; i < dataBuy.length; i++) {
                    if (dataBuy[i].imageUrl == ""||dataBuy[i].imageUrl.length == 0) {
                        dataBuy[i].showImg = false;
                    } else {
                        dataBuy[i].showImg = true;
                    }
                }
            }
            this.setData({
                list: dataSell,
                list1:dataBuy
            })
            wx.hideLoading();
        }
    },
    //结贴
    end: function (e) {
        var that = this;
        wx.showModal({
            title: '完成交易',
            content: '确定完成并关闭交易吗？',
            success(res) {
                if (res.confirm) {
                    var goodId = e.currentTarget.dataset.id;
                    var goodProperty = e.currentTarget.dataset.goodproperty;
                    app.request(API_END, {
                        openid: app.globalData.openId,
                        goodId: goodId,
                        type: goodProperty
                    }, 'GET', that.endProductSuccess)
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    endProductSuccess:function(res){
        console.log(res);
        if (res.data.code == 1080) {
            wx.showToast({
                title: '交易成功！',
                icon: 'success',
                duration: 2000
            })
            this.getLists();
        } else {
            wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
            })
        }
    },
    edit:function(e){
        var goodId = e.currentTarget.dataset.id;
        var goodProperty = e.currentTarget.dataset.goodproperty;
        wx.navigateTo({
            url:"../../edit/edit?goodId="+goodId+"&goodProperty="+goodProperty
        })
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