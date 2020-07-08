var app = getApp();
var api = require('../../../utils/api');
var API_URL = api.getMyPublish;
var API_END = api.finishProduct;
var API_SHINE = api.shineGoods;
var API_DELATE = api.delateGoods;
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
        }, 'GET', this.getMyPublishSuccess);
    },
    getMyPublishSuccess: function (res) {
        console.log(res);
        if (res.statusCode == 404) {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
        } else {
            var data = res.data.result;
            if (data.length != 0) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].firstImgUrl == "" || data[i].firstImgUrl == null) {
                        data[i].showImg = false;
                    } else {
                        data[i].showImg = true;
                    }
                    if (data[i].goodType == "bg") {
                        data[i].goodTypeShow = "求购"
                    }
                    if (data[i].goodType == "sg") {
                        data[i].goodTypeShow = "转让"
                    }
                    if (data[i].goodType == "tg") {
                        data[i].goodTypeShow = "拼单"
                    }
                }
            }
            this.setData({
                list: data
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
                    var goodID = e.currentTarget.dataset.id;
                    var goodType = e.currentTarget.dataset.goodtype;
                    app.request(API_END, {
                        goodID: goodID,
                        goodType: goodType
                    }, 'POST', that.endProductSuccess)
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    endProductSuccess: function (res) {
        console.log(res);
        if (res.data.msg == "success") {
            wx.showToast({
                title: '交易成功！',
                icon: 'success',
                duration: 2000
            })
            this.getLists();
            app.globalData.needRefresh=true
        } else {
            wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
            })
            this.getLists();
        }
    },
    edit: function (e) {
        var goodID = e.currentTarget.dataset.id;
        var goodType = e.currentTarget.dataset.goodtype;
        wx.navigateTo({
            url: "../../edit/edit?goodID=" + goodID + "&goodType=" + goodType
        })
    },
    shine: function (e) {
        var that = this;
        wx.showModal({
            title: '擦亮商品',
            content: '确定要擦亮这个商品吗？',
            success(res) {
                if (res.confirm) {
                    var goodID = e.currentTarget.dataset.id;
                    var goodType = e.currentTarget.dataset.goodtype;
                    app.request(API_SHINE, {
                        goodID: goodID,
                        goodType: goodType
                    }, 'POST', that.shineSuccess)
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    shineSuccess: function (res) {
        console.log(res);
        if (res.data.msg == "success") {
            wx.showToast({
                title: '擦亮成功！',
                icon: 'success',
                duration: 2000
            })
            this.getLists();
            app.globalData.needRefresh=true
        } else {
            wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
            })
            this.getLists();
        }
    },
    delate: function (e) {
        var that = this;
        wx.showModal({
            title: '删除商品',
            content: '确定要删除这个商品吗？',
            success(res) {
                if (res.confirm) {
                    var goodID = e.currentTarget.dataset.id;
                    var goodType = e.currentTarget.dataset.goodtype;
                    app.request(API_DELATE, {
                        goodID: goodID,
                        goodType: goodType
                    }, 'POST', that.delateSuccess)
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    delateSuccess: function (res) {
        console.log(res);
        if (res.data.msg == "success") {
            wx.showToast({
                title: '删除成功！',
                icon: 'success',
                duration: 2000
            })
            this.getLists();
            app.globalData.needRefresh=true
        } else {
            wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
            })
            this.getLists();
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