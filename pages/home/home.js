var app = getApp();
var api = require('../../utils/api');
var API_URL = api.getProdect;
var API_RS = api.getRS;
var API_ALL = api.getAllProdect;
var API_SearchHistory = api.getSearchHistory;
var API_SearchBoard = api.getSearchBoard,
    API_Collect = api.changeCollectState;
var currentTab = 0,
    currentSecTab=0;
var page = [1, 1, 1, 1];
var pageAll = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var pageAllIsFirst = [true, true, true, true, true, true, true, true, true, true];

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
        currentSecTab: 0,
        updateShow: "none",
        isCollect: false,
        // canIUse       : wx.canIUse('button.open-type.getUserInfo')
        // canIUse       : true,
        isNotSearch: true,
        focus: false,
        beforeChooseCategory: false,
        //首页轮播图图片地址
        swiperAddress: [],
        goodType: ['关注', '南校区', '北校区', '数码电子', '书籍资料', '日用百货', '美妆护肤', '吃喝分享', '鞋衣配饰', '卡票出让', '其他'],
        page: [1, 1, 1, 1],
        pageAll: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        pageAllIsFirst: [true, true, true, true, true, true, true, true, true, true],
        onTop: true,
        type: ["物品", "用户"],
        typeIndex: 0,
        listAll0:[],listAll1:[],listAll2:[],listAll3:[],listAll4:[],listAll5:[],listAll6:[],listAll7:[],listAll8:[],listAll9:[],
        list3:[],listFollow:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //下拉刷新后reLaunch时把page清零
        page = [1, 1, 1, 1];
        pageAll = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        pageAllIsFirst = [true, true, true, true, true, true, true, true, true, true];

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
            listAll0:[],listAll1:[],listAll2:[],listAll3:[],listAll4:[],listAll5:[],listAll6:[],listAll7:[],listAll8:[],listAll9:[],
            list:[],list1:[],list2:[],list3:[],listFollow:[],
            currentTab: currentTab,
            currentSecTab:currentSecTab,
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

        app.request(API_URL, {
            page: page[0],
            goodType: "sg"
        }, "GET", this.getSellProductSuccess)
        app.request(API_URL, {
            page: page[1],
            goodType: "bg"
        }, "GET", this.getBuyProductSuccess)
        app.request(API_URL, {
            page: page[2],
            goodType: "tg"
        }, "GET", this.getCrowProductSuccess)
        app.request(API_RS, {
            page: page[3],
            openid:app.globalData.openId
        }, "GET", this.getRSProductSuccess)
        app.request(api.getMyFollowProdect, {
            openid: app.globalData.openId
        }, "GET", this.getFollowProductSuccess)

        app.request(api.getSwiper, {
            page: 1
        }, "GET", this.getSwiperSuccess)

        app.request(API_SearchHistory, {
            openid: app.globalData.openId
        }, "GET", this.getSearchHistorySuccess)
        app.request(API_SearchBoard, {}, "GET", this.getSearchBoardSuccess)

        app.request(api.getNewCommentNum, {
            openid: app.globalData.openId
        }, "GET", this.getNewCommentNumSuccess)
    },

    // 一级商品加载

    getSellProductSuccess: function (res) {
        console.log(res);
        var data = res.data.result;
        this.exeData(data, 0);
    },
    getBuyProductSuccess: function (res) {
        console.log(res);
        var data = res.data.result;
        this.exeData(data, 1);
    },
    getCrowProductSuccess: function (res) {
        console.log(res);
        var data = res.data.result;
        this.exeData(data, 2);
    },
    getRSProductSuccess: function (res) {
        console.log(res);
        var data = res.data.result;
        this.exeData(data, 3);
    },
    getFollowProductSuccess: function (res) {
        console.log(res);
        var data = res.data.result;
        if (res.data.msg=="该用户无关注对象"){

        }else{
        this.exeData(data, 4);    
        }
 
    },
    exeData: function (data, type) {

        for (let i = 0; i < data.length; i++) {
            if (data[i].firstImgUrl == null ||  data[i].firstImgUrl == "null" ) {
                data[i].showImg = false;
            } else {
                data[i].showImg = true;
            }
            if (type == 3) {
                if (data[i].isCollect == 1) {
                    data[i].isCollection = true
                } else {
                    data[i].isCollection = false
                }
                if (data[i].rsFirstImgUrl == null || data[i].rsFirstImgUrl == "null") {
                    data[i].showImg = false;
                } else {
                    data[i].showImg = true;
                }
            }
            if (type == 4) {
                if (data[i].goodType == 'sg') {
                    data[i].goodTypeShow = '转让'
                } else if (data[i].goodType == 'bg') {
                    data[i].goodTypeShow = '求购'
                } else if (data[i].goodType == 'tg') {
                    data[i].goodTypeShow = '拼单'
                }
            }
        }
        if (type == 0) {
            this.setData({
                list: data
            })
        } else if (type == 1) {
            this.setData({
                list1: data
            })
        } else if (type == 2) {
            this.setData({
                list2: data
            })
        } else if (type == 3) {
            this.setData({
                list3: data
            })
        } else if (type == 4) {
            this.setData({
                listFollow: data
            })
        }
        wx.hideToast();
    },
    getSwiperSuccess: function (res) {
        console.log("Swiper")
        console.log(res.data.result)
        this.setData({
            swiperAddress: res.data.result
        })

    },
    getNewCommentNumSuccess:function(res){
        
        this.setData({
            notifyNums: res.data.result["Not Read Notify Nums"]
        })
        console.log("notify"+this.data.notifyNums)
    },
    // swiper转换
    bindChange: function (e) {
        var that = this;
        
        that.setData({
            currentTab: e.detail.current
        });
        currentTab = e.detail.current;
    },
    bindChangeAll: function (e) {
        var that = this;
        that.setData({
            currentSecTab: e.detail.current
        });
        currentSecTab = e.detail.current;
        var index = currentSecTab - 1
        if (pageAllIsFirst[index] && index != -1) {
            this.getNewAll("OK")
            console.log("!111")
        }
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
    swichSecNav: function (e) {
        var that = this;
        if (this.data.currentSecTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentSecTab: e.target.dataset.current
            })
            currentSecTab = e.detail.current;
            var index = e.target.dataset.current - 1
            if (pageAllIsFirst[index] && index != -1) {
                this.getNewAll("OK")
                pageAllIsFirst[index] = false
            }
        }

    },


    //搜索

    getSearchHistorySuccess: function (data) {
        this.setData({
            searchHistory: data.data.result
        })
    },
    getSearchBoardSuccess: function (data) {
        this.setData({
            searchBoard: data.data.result
        })
    },

    Search: function (e) {
        var searchName = "";
        var url = "";
        if (e.type == "tap") {
            searchName = e.target.dataset.src
        } else if (e.type == "confirm") {
            searchName = e.detail.value
        }
         
        if (searchName == "") {
            wx.showToast({
                title: '请输入内容喔',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (this.data.typeIndex == 0) {
            url = '../search/searchItem/searchItem?value=' + searchName;
            wx.navigateTo({
                url: url
            })
        } else if (this.data.typeIndex == 1) {
            url = '../search/searchUser/searchUser?value=' + searchName;
            wx.navigateTo({
                url: url
            })
        }
    },

    toDetail:function (e) {
        if(e.currentTarget.dataset.state==1) {
            {
                wx.showToast({
                    title: '这个交易已经完成啦，看看别的商品吧',
                    icon: 'none',
                    duration: 2000
                })
                return;
            }
        }else{
            var goodID= e.currentTarget.dataset.id
            var goodType= e.currentTarget.dataset.type
            var url= "../detailIndex/detailIndex?goodID="+goodID+"&goodType="+goodType
            wx.navigateTo({
                url: url
            })
        }
        
    },
    toMessage:function () {
        if (!app.globalData.userShouquan) {
            wx.showModal({
                title: '提示',
                cancelText:"先不授权",
                confirmText:"前往授权",
                content: '授权登录才能操作哦',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '../shouquan/shouquan',
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return
        } 

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

            var url="../my/message/message"
            wx.navigateTo({
                url: url
            })

        
    },

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
        app.request(API_Search, {
            keywords: e.detail.value
        }, "GET", this.getSearchSuccess)
    },
    searchByCategory: function (e) {
        wx.showToast({
            title: "搜索中...",
            icon: "loading",
            duration: 5000
        });
        this.setData({
            showSell: true,
            showBuy: true,
            isNotSearch: false,
            beforeChooseCategory: false
        })
        var category = e.currentTarget.dataset.category;
        app.request(API_Search, {
            keywords: category
        }, "GET", this.getSearchSuccess);

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
            beforeChooseCategory: false,
            searchValue: ''
        })
        wx.setNavigationBarTitle({
            title: 'hi淘首页'
        })
        this.onLoad();
    },
    onFocus: function () {
        this.setData({
            focus: true,
            beforeChooseCategory: true
        })
        wx.setNavigationBarTitle({
            title: '搜索'
        })
    },
    onBlur: function () {
        this.setData({
            focus: false,
            beforeChooseCategory: false
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
            url: "/pages/home/home",
            success: function () {
                console.log("下拉刷新");
            }
        })
        currentTab = that.data.currentTab
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
        page[0]++;
        console.log("pull up load")
        app.request(API_URL, {
            page: page[0],
            goodType: "sg"
        }, "GET", this.getMoreSellProductSucces)
    },
    getMoreSellProductSucces: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            page[0]--;
            console.log("触底");
        } else {
            this.exeMoreData(new_data, 0);
        }
    },
    pullUpLoad1: function () {
        page[1]++;
        app.request(API_URL, {
            page: page[1],
            goodType: "bg"
        }, "GET", this.getMoreBuyProductSucces)
    },
    getMoreBuyProductSucces: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            page[1]--;
            console.log("触底");
        } else {
            this.exeMoreData(new_data, 1);
            console.log("Push 1")
        }
    },
    pullUpLoad2: function () {
        page[2]++;
        app.request(API_URL, {
            page: page[2],
            goodType: "tg"
        }, "GET", this.getMoreCrowProductSucces)
    },
    getMoreCrowProductSucces: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            page[2]--;
            console.log("触底");
        } else {
            this.exeMoreData(new_data, 2);
        }
    },
    pullUpLoad3: function () {
        page[3]++;
        app.request(API_RS, {
            page: page[3],
            openid:app.globalData.openId
        }, "GET", this.getMoreRSProductSucces)
    },
    getMoreRSProductSucces: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            page[3]--;
            console.log("触底");
        } else {
            this.exeMoreData(new_data, 3);
        }
    },
    exeMoreData: function (new_data, type) {
        wx.showLoading({
            title: '加载更多数据',
            icon: 'loading',
            duration: 2000
        })
        for (let i = 0; i < new_data.length; i++) {
            if (new_data[i].firstImgUrl == null ) {
                new_data[i].showImg = false;
            } else {
                new_data[i].showImg = true;
            }
            if (type == 3) {
                if (new_data[i].isCollection == 1) {
                    new_data[i].isCollection = true
                } else {
                    new_data[i].isCollection = false
                }
                if (new_data[i].rsFirstImgUrl==null) {
                    new_data[i].showImg = false;
                } else {
                    new_data[i].showImg = true;
                }
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
        } else if (type == 1) {
            var moment_list = this.data.list1;
            //把新加载的数据加入到原来的商品列表
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                list1: moment_list
            })
        } else if (type == 2) {
            var moment_list = this.data.list2;
            //把新加载的数据加入到原来的商品列表
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                list2: moment_list
            })
        } else if (type == 3) {
            var moment_list = this.data.list3;
            //把新加载的数据加入到原来的商品列表
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                list3: moment_list
            })
        }
        wx.hideLoading();
    },

    typeChange: function (e) {
        this.setData({
            typeIndex: e.detail.value
        })
    },




    getNewAll: function (e) {
        if (this.data.currentSecTab == 1) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[0],
                    type: "南校区"
                }, "GET", this.getAllSuccess0)
            } else {
                pageAll[0]++
                app.request(API_ALL, {
                    page: pageAll[0],
                    type: "南校区"
                }, "GET", this.getAllSuccess0)
            }
        } else if (this.data.currentSecTab == 2) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[1],
                    type: "北校区"
                }, "GET", this.getAllSuccess1)
            } else {
                pageAll[1]++
                app.request(API_ALL, {
                    page: pageAll[1],
                    type: "北校区"
                }, "GET", this.getAllSuccess1)
            }
        } else if (this.data.currentSecTab == 3) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[2],
                    type: "数码电子"
                }, "GET", this.getAllSuccess2)
            } else {
                pageAll[2]++
                app.request(API_ALL, {
                    page: pageAll[2],
                    type: "数码电子"
                }, "GET", this.getAllSuccess2)
            }
        } else if (this.data.currentSecTab == 4) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[3],
                    type: "书籍资料"
                }, "GET", this.getAllSuccess3)
            } else {
                pageAll[3]++
                app.request(API_ALL, {
                    page: pageAll[3],
                    type: "书籍资料"
                }, "GET", this.getAllSuccess3)
            }
        } else if (this.data.currentSecTab == 5) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[4],
                    type: "日用百货"
                }, "GET", this.getAllSuccess4)
            } else {
                pageAll[4]++
                app.request(API_ALL, {
                    page: pageAll[4],
                    type: "日用百货"
                }, "GET", this.getAllSuccess4)
            }
        } else if (this.data.currentSecTab == 6) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[5],
                    type: "美妆护肤"
                }, "GET", this.getAllSuccess5)
            } else {
                pageAll[5]++
                app.request(API_ALL, {
                    page: pageAll[5],
                    type: "美妆护肤"
                }, "GET", this.getAllSuccess5)
            }
        } else if (this.data.currentSecTab == 7) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[6],
                    type: "吃喝分享"
                }, "GET", this.getAllSuccess6)
            } else {
                pageAll[6]++
                app.request(API_ALL, {
                    page: pageAll[6],
                    type: "吃喝分享"
                }, "GET", this.getAllSuccess6)
            }
        } else if (this.data.currentSecTab == 8) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[7],
                    type: "鞋服配饰"
                }, "GET", this.getAllSuccess7)
            } else {
                pageAll[7]++
                app.request(API_ALL, {
                    page: pageAll[7],
                    type: "鞋服配饰"
                }, "GET", this.getAllSuccess7)
            }
        } else if (this.data.currentSecTab == 9) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[8],
                    type: "卡票出让"
                }, "GET", this.getAllSuccess8)
            } else {
                pageAll[8]++
                app.request(API_ALL, {
                    page: pageAll[8],
                    type: "卡票出让"
                }, "GET", this.getAllSuccess8)
            }
        } else if (this.data.currentSecTab == 10) {
            if (e == "OK") {
                app.request(API_ALL, {
                    page: pageAll[9],
                    type: "其它"
                }, "GET", this.getAllSuccess9)
            } else {
                pageAll[9]++
                app.request(API_ALL, {
                    page: pageAll[9],
                    type: "其它"
                }, "GET", this.getAllSuccess9)
            }
        }
    },

    getAllSuccess0: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[0]>1)
            pageAll[0]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 0);
            pageAllIsFirst[0] = false
        }
    },
    getAllSuccess1: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[1]>1)
            pageAll[1]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 1);
            pageAllIsFirst[1] = false
        }
    },
    getAllSuccess2: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[2]>1)
            pageAll[2]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 2);
            pageAllIsFirst[2] = false
        }
    },
    getAllSuccess3: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[3]>1)
            pageAll[3]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 3);
            pageAllIsFirst[3] = false
        }
    },
    getAllSuccess4: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[4]>1)
            pageAll[4]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 4);
            pageAllIsFirst[4] = false
        }
    },
    getAllSuccess5: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[5]>1)
            pageAll[5]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 5);
            pageAllIsFirst[5] = false
        }
    },
    getAllSuccess6: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[6]>1)
            pageAll[6]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 6);
            pageAllIsFirst[6] = false
        }
    },
    getAllSuccess7: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[7]>1)
            pageAll[7]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 7);
            pageAllIsFirst[7] = false
        }
    },
    getAllSuccess8: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[8]>1)
            pageAll[8]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 8);
            pageAllIsFirst[8] = false
        }
    },
    getAllSuccess9: function (res) {
        console.log(res);
        var new_data = res.data.result;
        if (new_data == null) {
            wx.showToast({
                title: '亲，到底啦！',
                icon: 'none',
                duration: 2000
            })
            console.log("到底");
            if(pageAll[9]>1)
            pageAll[9]--;
            console.log("触底");
        } else {
            this.exeDataAll(new_data, 9);
            pageAllIsFirst[9] = false
        }
    },


    exeDataAll: function (new_data, type) {
        console.log(new_data)
        wx.showLoading({
            title: '加载更多数据',
            icon: 'loading',
            duration: 2000
        })
        for (let i = 0; i < new_data.length; i++) {
            if (new_data[i].firstImgUrl == null) {
                new_data[i].showImg = false;
            } else {
                new_data[i].showImg = true;
            }
            if (new_data[i].goodType == 'sg') {
                new_data[i].goodTypeShow = '转让'
            } else if (new_data[i].goodType == 'bg') {
                new_data[i].goodTypeShow = '求购'
            } else if (new_data[i].goodType == 'tg') {
                new_data[i].goodTypeShow = '拼单'
            }
        }
        console.log("new_data")
        console.log(new_data)
        if (type == 0) {
            var moment_list = this.data.listAll0;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            console.log(moment_list)
            this.setData({
                listAll0: moment_list
            })
        } else if (type == 1) {
            var moment_list = this.data.listAll1;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll1: moment_list
            })
        } else if (type == 2) {
            var moment_list = this.data.listAll2;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll2: moment_list
            })
        } else if (type == 3) {
            var moment_list = this.data.listAll3;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll3: moment_list
            })
        }else if (type == 4) {
            var moment_list = this.data.listAll4;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll4: moment_list
            })
        }else if (type == 5) {
            var moment_list = this.data.listAll5;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll5: moment_list
            })
        }else if (type == 6) {
            var moment_list = this.data.listAll6;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll6: moment_list
            })
        }else if (type == 7) {
            var moment_list = this.data.listAll7;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll7: moment_list
            })
        }else if (type == 8) {
            var moment_list = this.data.listAll8;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll8: moment_list
            })
        }else if (type == 9) {
            var moment_list = this.data.listAll9;
            for (var i = 0; i < new_data.length; i++) {
                moment_list.push(new_data[i]);
            }
            this.setData({
                listAll9: moment_list
            })
        }
        wx.hideLoading();
    },


    onCollect: function (e) {
        if (!app.globalData.userShouquan) {
            wx.showModal({
                title: '提示',
                content: '授权登录才能操作哦',
                cancelText:"先不授权",
                confirmText:"前往授权",
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '../shouquan/shouquan',
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return
        } 
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
        app.request(API_Collect, {
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
        var list=this.data.list3
        list[e.currentTarget.dataset.index].isCollection=true
        this.setData({
            list3:list
        })

    },
    collectSuccess: function (res) {
        console.log(res);
        wx.hideToast();
       if (res.data.msg == 'collect success' ) {
            
                console.log('收藏成功');
            
            
        } else {
                wx.showToast({
                    title: "操作失败",
                    icon: "none",
                    duration: 2000
                })
    }},
    cancelCollect: function (e) {
        if (!app.globalData.userShouquan) {
            wx.showModal({
                title: '提示',
                cancelText:"先不授权",
                confirmText:"前往授权",
                content: '授权登录才能操作哦',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: '../shouquan/shouquan',
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return
        } 
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
        app.request(API_Collect, {
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
        var list=this.data.list3
        list[e.currentTarget.dataset.index].isCollection=false
        this.setData({
            list3:list
        })
    },
    cancelCollectSuccess: function (res) {
        console.log(res);
        wx.hideToast();
        if (res.data.msg == "unCollect success") {
            console.log('取消收藏')
        } else {
            wx.showToast({
                title: "操作失败",
                icon: "none",
                duration: 2000
            })
        }        

    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    onPageScroll: function (e) {
        if (e.scrollTop >= 160 && this.data.onTop == true) {
            this.setData({
                onTop: false
            })
        } else if (e.scrollTop <= 130 && this.data.onTop == false) {
            this.setData({
                onTop: true
            })
        }

    },
    onShow:function (params) {
        app.request(api.getNewCommentNum, {
            openid: app.globalData.openId
        }, "GET", this.getNewCommentNumSuccess)

        if(app.globalData.needRefresh){
            this.onLoad()
            app.globalData.needRefresh=false
        }
        
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