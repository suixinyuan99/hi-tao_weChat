var app = getApp();
var api = require('../../utils/api');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: "",
        avatarUrl: "",
        showStudent: false,
        canIUse: true,
    },
    onLoad: function () {
     
    },
    onShow: function () {
        console.log(app.globalData.userState)
        var that = this;
        if (app.globalData.userInfo!=null) {
            this.setData({
                nickName: app.globalData.userInfo.nickName,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                canIUse: true
            })
        } else {
            //获取头像昵称
            wx.getUserInfo({
                success: function (res) {
                    console.log(res);
                    app.globalData.userInfo = res.userInfo;
                    that.setData({
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl,
                        canIUse: true
                    })
                    app.globalData.userShouquan=true
                },
                fail:function (res) {
                    that.setData({
                        canIUse: false
                    })
                    app.globalData.userShouquan=false
                }
            })
        }
        //查看是否验证
        if(!app.globalData.userShouquan){
            return
        }
        var userState = app.globalData.userState;
        if (userState == 0) {
            that.setData({
                showStudent: true
            })
            // 获取粉丝数量
            app.globalData.userState = 0;
            app.request(api.getFollowAndFansNum, {
                openid: app.globalData.openId,
            }, "POST", this.getFansNumSuccess)
        } else {
            that.setData({
                showStudent: false
            })
            //再查一遍
            app.request(api.login, {
                userOpenid: app.globalData.openId,
                userName: app.globalData.userInfo.nickName,
                userAvartar: app.globalData.userInfo.avatarUrl
            }, "POST", this.getLoginSuccess)
        }
    },
    getLoginSuccess: function (res) {
        console.log("存入数据库");
        console.log(res);
        if (res.statusCode == 404) {
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～您的认证状态可能有误，请退出微信后再试',
            })
        } else {
            if (res.data.result) {
                if (res.data.result.userState == 1) {
                    console.log("该用户已认证");
                    // 获取粉丝数量
                    app.globalData.userState = 0;
                    app.request(api.getFollowAndFansNum, {
                        openid: app.globalData.openId,
                    }, "POST", this.getFansNumSuccess)
                    this.setData({
                        showStudent: true
                    })
                } else {
                    console.log('该用户没有认证')
                }
            }
        }
    },
    getFansNumSuccess: function (data) {
        this.setData({
            followNum: data.data.result.follow,
            fansNum: data.data.result.fans
        })
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的hi淘'
        })
    },
    toShouquan: function () {
        wx.navigateTo({
            url: '../shouquan/shouquan',
        })
    },

    toMyFollow: function () {
        wx.navigateTo({
            url: './myFollow/myFollow',
        })
    },
    toMyFans: function () {
        wx.navigateTo({
            url: './myFans/myFans',
        })
    },
    myIdentification: function () {
        wx.navigateTo({
            url: './myIdentification/myIdentification',
        })
    },
    mySelling: function () {
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
        if (this.data.showStudent) {
            wx.navigateTo({
                url: './mySelling/mySelling',
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '只有经过一卡通认证的用户才能进行转让和求购哦~',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: './myIdentification/myIdentification',
                        })
                    } else if (res.cancel) {
                        // wx.switchTab ({
                        //     url: '../index/index',
                        // })
                    }
                }
            })
        }
    },
    myPublish: function () {
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
        if (this.data.showStudent) {
            wx.navigateTo({
                url: './myPublish/myPublish',
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '只有经过一卡通认证的用户才能进行转让和求购哦~',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: './myIdentification/myIdentification',
                        })
                    } else if (res.cancel) {
                        // wx.switchTab ({
                        //     url: '../index/index',
                        // })
                    }
                }
            })
        }
    },
    myCollection: function () {
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
        if (this.data.showStudent) {
            wx.navigateTo({
                url: './myCollection/myCollection',
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '只有经过一卡通认证的用户才能进行收藏哦~',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: './myIdentification/myIdentification',
                        })
                    } else if (res.cancel) {
                    }
                }
            })
        }

    },
    message: function () {
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
        if (this.data.showStudent) {
            wx.navigateTo({
                url: './message/message',
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '只有经过一卡通认证的用户才能被同学们联系到哦~',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                            url: './myIdentification/myIdentification',
                        })
                    } else if (res.cancel) {
                        // wx.switchTab ({
                        //     url: '../index/index',
                        // })
                    }
                }
            })
        }
    },
    contactUs: function () {
        wx.navigateTo({
            url: './contactUs/contactUs',
        })
    },
    changeState:function () {
        if( app.globalData.userState=0){
            app.globalData.userState=1
        }else{
            app.globalData.userState=0
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