var app = getApp();
var api = require('../../utils/api');
var API_URL = api.getSellProduct,
    API_URL1 = api.getBuyProduct;
var API_Search = api.search;
var currentTab = 0;
var page = 1,
    page1 = 1;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        /**
         * 页面配置
         */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        updateShow: "none",
        isCollect: false,
        // canIUse       : wx.canIUse('button.open-type.getUserInfo')
        // canIUse       : true,
        isNotSearch: true,
        focus: false,
        beforeChooseCategory:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        page = 1;//下拉刷新后reLaunch时把page清零
        page1 = 1;

        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
            fail: function () {
                console.log('加载超时');
            }
        })

        //解决首页在求购刷新的bug
        this.setData({
            list: null,
            currentTab: currentTab,
            showSell: true,
            showBuy: true
        });
        var that = this;

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
        app.request(API_URL, {page: page}, "GET", this.getSellProductSuccess)
        app.request(API_URL1, {page: page1}, "GET", this.getBuyProductSuccess)
    },
    getSellProductSuccess: function (res) {
        console.log(res);
        var data = res.data.sellGood;
        this.exeData(data, 0);
    },
    getBuyProductSuccess: function (res) {
        console.log(res);
        var data = res.data.buyGood;
        this.exeData(data, 1);
    },
    exeData: function (data, type) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].imageUrl.length == 0) {
                data[i].showImg = false;
            } else {
                data[i].showImg = true;
            }
        }
        console.log(data);
        if (type == 0) {
            this.setData({
                list: data
            })
        } else {
            this.setData({
                list1: data
            })
        }
        wx.hideToast();
    },
    // swiper转换
    bindChange: function (e) {
        var that = this;
        that.setData({currentTab: e.detail.current});
        currentTab = e.detail.current;
    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
            currentTab = e.detail.current;
        }
    },
    //搜索
    onSearch: function (e) {
        wx.showToast({
            title: "搜索中...",
            icon: "loading",
            duration: 5000
        });
        this.setData({
            showSell: true,
            showBuy: true,
            isNotSearch: false
        })
        var that = this;
        app.request(API_Search, {keywords: e.detail.value}, "GET", this.getSearchSuccess)
    },
    searchByCategory: function(e){
        wx.showToast({
            title: "搜索中...",
            icon: "loading",
            duration: 5000
        });
        this.setData({
            showSell: true,
            showBuy: true,
            isNotSearch: false,
            beforeChooseCategory:false
        })
        var category = e.currentTarget.dataset.category;
        app.request(API_Search, {keywords: category}, "GET", this.getSearchSuccess);

    },
    getSearchSuccess: function (res) {
        console.log(res);
        this.setData({
            list: res.data,
            focus: true
        })  
        wx.hideToast();
    },
    onCancelSearch: function () {
        this.setData({
            isNotSearch: true,
            focus: false,
            beforeChooseCategory:false,
            searchValue: ''
        })
        this.onLoad();
    },
    onFocus: function () {
        this.setData({
            focus: true,
            beforeChooseCategory:true
        })
    },
    onBlur: function () {
        this.setData({
            focus: false,
            beforeChooseCategory:false
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: 'hi淘首页'
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
        var that = this;
        wx.reLaunch({
            url: "/pages/index/index",
            success: function () {
                console.log("下拉刷新");
            }
        })
        currentTab = that.data.currentTab === 0 ? 0 : 1;
    },
    refresh: function (e) {
        var that = this;
        this.setData({
            top: true
        })
        setTimeout(function () {
            that.setData({
                top: false
            })
        }, 1500)
    },
    //触底加载更多
    pullUpLoad: function () {
        var that = this;
        page++;
        app.request(API_URL, {page: page}, "GET", this.getMoreSellProductSucces)
    },
    getMoreSellProductSucces: function (res) {
        console.log(res);
        var new_data = res.data.sellGood;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            page--;
            console.log("触底");
        } else {
            this.exeMoreData(new_data, 0);
        }
    },
    exeMoreData: function (new_data, type) {
        wx.showLoading({
            title: '加载更多数据',
            icon: 'loading',
            duration: 2000
        })
        for (let i = 0; i < new_data.length; i++) {
            if (new_data[i].imageUrl.length == 0) {
                new_data[i].showImg = false;
            } else {
                new_data[i].showImg = true;
            }
        }
        if (type == 0) {
            var moment_list = this.data.list;
            //把新加载的数据加入到原来的商品列表
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            console.log(moment_list)
            this.setData({
                list: moment_list
            })
        } else {
            var moment_list = this.data.list1;
            //把新加载的数据加入到原来的商品列表
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                list1: moment_list
            })
        }
        wx.hideLoading();
    },
    pullUpLoad1: function () {
        page1++;
        app.request(API_URL1, {page: page1}, "GET", this.getMoreBuyProductSucces)
    },
    getMoreBuyProductSucces: function (res) {
        console.log(res);
        var new_data = res.data.buyGood;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            page1--;
            console.log("触底");
        } else {
            this.exeMoreData(new_data, 1);
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

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