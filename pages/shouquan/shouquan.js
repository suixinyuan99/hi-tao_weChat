/**
 * Created by Administrator on 2018/12/22.
 */
var app = getApp();
var api = require("../../utils/api");
Page({
    data: {
        jump: "index",
        goodId: 0,
        goodProperty:0,
    },
    onLoad: function (options) {
        console.log(options);
        if (!options.goodId) {
        } else {
            this.setData({
                jump: "detailIndex",
                goodId: options.goodId,
                goodProperty:options.goodProperty
            })
        }
    },
    onShow: function () {
        var _this = this;
        //判断用户是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("用户已经授权")
                            //用户已经授权过
                            if (_this.data.jump == "index") {
                                wx.switchTab({
                                    url: '../index/index',
                                })
                            } else {
                                wx.redirectTo({
                                    url: '../detailIndex/detailIndex?goodId=' + _this.data.goodId +'&goodProperty='+_this.data.goodProperty +'&shouquan=' + 1,
                                })
                            }
                        },
                        fail: function (res) {
                            wx.hideToast();
                            //未授权
                        }
                    })
                } else {
                    wx.hideToast();
                    //未授权
                }
            },
            fail: function (res) {
                wx.hideToast();
                //未授权
            }
        })
    },
    bindGetUserInfo: function (e) {
        var _this = this;
        wx.showToast({
            title: "正在加载用户",
            icon: "loading",
            mask: true,
            duration: 30000
        });
        if (e.detail.userInfo) {
            app.globalData.userInfo = e.detail.userInfo;
            wx.login({
                success: res_login => {
                    app.request(api.getOpenid, {
                        code: res_login.code,
                    }, "GET", this.getOpenidSuccess)
                }
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '授权失败，将无法查看商品详情页！',
                success(res) {
                    if (res.confirm) {
                        return
                    } else if (res.cancel) {
                        return
                    }
                }
            })
        }
    },
    getOpenidSuccess: function (res) {
        console.log("获取openid");
        console.log(res);
        if(res.statusCode==404){
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
        }else{
            app.globalData.openId = res.data.openid;
            app.globalData.session_key = res.data.session_key;
            //将用户的信息存入数据库
            app.request(api.login, {
                openid: app.globalData.openId,
                userName: app.globalData.userInfo.nickName,
                userAvatarUrl: app.globalData.userInfo.avatarUrl
            }, "POST", this.getLoginSuccess)
        }
    },
    getLoginSuccess:function(res){
        console.log("存入数据库");
        console.log(res);
        if(res.statusCode==404){
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
        }else{
            if(res.data.object.userState==0){
                console.log("该用户已认证");
                app.globalData.userState=0;
            }else{
                console.log('该用户没有认证')
            }
            if (this.data.jump == "index") {
                wx.switchTab({
                    url: '../index/index',
                })
            } else {
                wx.redirectTo({
                    url: '../detailIndex/detailIndex?goodId=' + this.data.goodId +'&goodProperty='+this.data.goodProperty +'&shouquan=' + 1,
                })
            }
        }
    }
})