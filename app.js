//app.js
var api = require("./utils/api");
App({
    request: function (url, data, method, callback) {
        if (method == 'GET') {
            wx.request({
                url: url,
                data: data,
                method: method,
                header: {
                    'content-type': 'application/json'
                },
                success: res => {
                    callback(res)
                },
                fail: res => {
                    wx.showToast({
                        title: '服务器出小差了～',
                        icon: 'none',
                    })
                }
            })
        } else {
            wx.request({
                url: url,
                data: data,
                method: method,
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: res => {
                    callback(res)
                },
                fail: res => {
                    wx.showToast({
                        title: '服务器出小差了～',
                        icon: 'none',
                    })
                }
            })
        }
    },
    onLaunch: function () {
        // 展示本地存储能力
        var _this = this;
        wx.login({
            success: res_login => {
                console.log("获取code")
                console.log(res_login)
                // 获取用户信息
                wx.getUserInfo({
                    success: res => {
                        console.log("获取用户信息")
                        console.log(res)
                        _this.globalData.userInfo = res.userInfo;
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (_this.userInfoReadyCallback) {
                            _this.userInfoReadyCallback(res)
                        }
                        console.log(_this.globalData)
                        //获取openid
                        this.request(api.getOpenid, {
                            code: res_login.code,
                        }, "GET", this.getOpenidSuccess)
                    }
                })
            }
        })
    },
    getOpenidSuccess: function (res) {
        console.log("获取openid");
        console.log(res);
        if(res.statusCode==404){
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～请退出微信后再试',
            })
            console.log(404)
        }else{
            this.globalData.openId = res.data.openid;
            this.globalData.session_key = res.data.session_key;
            //将用户的信息存入数据库
            this.request(api.login, {
                openid: this.globalData.openId,
                userName: this.globalData.userInfo.nickName,
                userAvatarUrl: this.globalData.userInfo.avatarUrl
            }, "POST", this.getLoginSuccess)
        }
    },
    getLoginSuccess: function (res) {
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
                this.globalData.userState=0;
            }else{
                console.log('该用户没有认证')
            }
        }
    },
    requestFile:function(url,file,data,callback){
        wx.uploadFile({
            url: url,
            filePath: file,
            name: 'file',
            formData: data,
            header: {
                "Content-Type": "multipart/form-data",
            },
            success:res=>{
                callback(res)
            },
            fail:res=>{
                wx.showToast({
                    title: '服务器出小差了～',
                    icon: 'none',
                })
            }
        })
    },
    globalData: {
        userInfo: null,
        openId: null,
        session_key: null,
        userState: null
    }
})