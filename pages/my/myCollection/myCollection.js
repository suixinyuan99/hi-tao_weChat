var app = getApp();
var api = require('../../../utils/api');
var API_URL = api.getGoodCollection;
var API_END = api.changeCollectState;
var API_URL1 = api.getRSCollection;
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
        that.setData({
            currentTab: e.detail.current
        });
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
        var openid = app.globalData.openId;
        app.request(API_URL, {
            openid: openid
        }, 'GET', this.getGoodCollectionSuccess);
        app.request(API_URL1, {
            openid: openid
        }, 'GET', this.getRSCollectionSuccess);
    },
    getGoodCollectionSuccess: function (res) {
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
                    if (data[i].firstImgUrl == "" ||  data[i].firstImgUrl == null) {
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
    getRSCollectionSuccess: function (res) {
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
                    if (data[i].rsFirstImgUrl == ""  || data[i].rsFirstImgUrl == null) {
                        data[i].showImg = false;
                    } else {
                        data[i].showImg = true;
                    }
                    if (data[i].isCollect == 1) {
                        data[i].isCollection=true
                    }else{
                        data[i].isCollection=false
                    }
                }
            }
            this.setData({
                list1: data
            })
            wx.hideLoading();
        }

    },
    cancelGoodCollection: function (e) {
        console.log(e)
        var that = this;
        wx.showModal({
            title: '取消收藏',
            content: '确定要取消收藏吗？',
            success(res) {
                if (res.confirm) {
                    var goodID = e.currentTarget.dataset.id;
                    var goodType = e.currentTarget.dataset.goodtype;
                    app.request(API_END, {
                        openid: app.globalData.openId,
                        goodID: goodID,
                        goodType: goodType
                    }, 'POST', that.endProductSuccess)
                } else if (res.cancel) {
                    return
                }
            }
        })

    },

    endProductSuccess: function () {
        this.getLists();
    },
    onCollect: function (e) {
        if (app.globalData.userState!=0) {
            wx.showModal({
                title: '提示',
                content: '进行认证才能操作哦',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '../my/myIdentification/myIdentification',
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return
        } 
        app.request(API_END, {
            goodID: e.currentTarget.dataset.id,
            openid: app.globalData.openId,
            goodType:e.currentTarget.dataset.type
        }, 'POST', this.collectSuccess);
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
        })

    },
    collectSuccess: function (res) {
        console.log(res);
        wx.hideToast();
       if (res.data.msg == 'collect success' ) {
        this.getLists();
            
                console.log('收藏成功');
            
            
        } else {
                wx.showToast({
                    title: "操作失败",
                    icon: "none",
                    duration: 2000
                })
    }},
    cancelCollect: function (e) {
        if (app.globalData.userState!=0) {
            wx.showModal({
                title: '提示',
                content: '进行认证才能操作哦',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '../my/myIdentification/myIdentification',
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return
        } 
        console.log(e)
        app.request(API_END, {
            goodID: e.currentTarget.dataset.id,
            openid: app.globalData.openId,
            goodType:e.currentTarget.dataset.type
        }, 'POST', this.cancelCollectSuccess);
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
        })
        var list=this.data.list1
        list[e.currentTarget.dataset.index].isCollection=false
        this.setData({
            list1:list
        })
    },
    cancelCollectSuccess: function (res) {
        console.log(res);
        wx.hideToast();
        if (res.data.msg == "unCollect success") {
            this.getLists();
            console.log('取消收藏')
        } else {
            wx.showToast({
                title: "操作失败",
                icon: "none",
                duration: 2000
            })
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