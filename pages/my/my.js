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
        // 查看是否授权
        var that = this;

    },
    onShow: function () {
        var that = this;
        if(app.globalData.userInfo){
            this.setData({
                nickName:app.globalData.userInfo.nickName,
                avatarUrl: app.globalData.userInfo.avatarUrl,
            })
        }else{
            //获取头像昵称
            wx.getUserInfo({
                success: function (res) {
                    console.log(res);
                    app.globalData.userInfo = res.userInfo;
                    that.setData({
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl,
                    })
                },
            })
        }
        //查看是否验证
        var userState = parseInt(app.globalData.userState);
        if (userState == 0) {
            that.setData({
                showStudent: true
            })
        } else {
            that.setData({
                showStudent: false
            })
            //再查一遍
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
                content: '服务器开小差了～您的认证状态可能有误，请退出微信后再试',
            })
        }else{
            if(res.data.object){
                if(res.data.object.userState==0){
                    console.log("该用户已认证");
                    app.globalData.userState=0;
                    this.setData({
                        showStudent: true
                    })
                }else{
                    console.log('该用户没有认证')
                }
            }
        }
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的hi淘'
        })
    },
    myIdentification: function () {
        wx.navigateTo({
            url: './myIdentification/myIdentification',
        })
    },
    myPublish: function () {
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
        wx.navigateTo({
            url: './myCollection/myCollection',
        })
    },
    message: function () {
        wx.navigateTo({
            url: './message/message',
        })
    },
    contactUs: function () {
        wx.navigateTo({
            url: './contactUs/contactUs',
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