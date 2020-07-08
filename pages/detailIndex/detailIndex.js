/*
* @Author: Jackhzh
* @Date:   2018-11-05 21:08:13
* @Last Modified by:   Jackhzh
* @Last Modified time: 2019-04-11 14:16:26
*/
var imageUtil = require('../../utils/util.js');
var app = getApp();
var api = require('../../utils/api');
var API_SELL_URL = api.getSellProductDetail,
    API_BUY_URL = api.getBuyProductDetail,
    API_IS_SELL_COLLECT = api.isCollectionSellProduct,
    API_IS_BUY_COLLECT = api.isCollectionBuyProduct,
    API_SELL_Collect = api.collectionSellProduct,
    API_BUY_Collect = api.collectionBuyProduct,
    API_SELL_GetComment = api.getSellProductAllComments,
    API_BUY_GetComment = api.getBuyProductAllComments,
    API_SELL_Comment = api.commentSellProduct,
    API_BUY_Comment = api.commentBuyProduct,
    API_SELL_CLICK=api.plusSellGoodClick,
    API_BUY_CLICK=api.plusBuyGoodClick,
    API_CANCEL_Collect = api.cancelCollection,
    API_END_PRODUCT = api.finishProduct;
var API_URL = '',
    API_Collect = '',
    API_GetComment = '',
    API_Comment = '',
    API_IS_COLLECT = '',
    API_CLICK='';
Page({
    data: {
        // banner
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        duration: 1000, //  滑动动画时长1s
        imageList: [],//图片列表
        detailList: {},
        showBottom: true,
        comment: false,
        // goodProperty:0, //确定是转让还是求购
        goodId: 0,
        noState: false,
        identify: false,
        commentId: 0,
        isShouquan: false,
        scIcon: true,
        commentValue:"",
        publishUserName:"",
        publishHeadUrl:"",
        publishOpenId:""
    },

    onLoad: function (params) {
        // let goodProperty = params.goodProperty;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
            fail: function () {
                console.log('加载超时');
            }
        })
        console.log(params);
        if (!params.shouquan) {
            console.log("false" + params.shouquan)
        } else {
            console.log("true" + params.shouquan)
            this.setData({
                isShouquan: true
            })
        }
        this.setData({
            goodProperty: params.goodProperty,
            goodId: params.goodId
        })
        console.log(this.data.goodProperty);
        initAPI();

        function initAPI() {
            if (params.goodProperty == 0) {
                API_URL = API_SELL_URL;
                API_Collect = API_SELL_Collect;
                API_GetComment = API_SELL_GetComment;
                API_IS_COLLECT = API_IS_SELL_COLLECT;
                API_Comment = API_SELL_Comment;
                API_CLICK=API_SELL_CLICK;
            } else if (params.goodProperty == 1) {
                API_URL = API_BUY_URL;
                API_Collect = API_BUY_Collect;
                API_GetComment = API_BUY_GetComment;
                API_IS_COLLECT = API_IS_BUY_COLLECT;
                API_Comment = API_BUY_Comment;
                API_CLICK=API_BUY_CLICK;
            }
        }

        var that = this;
        //调用获取详情和评论API
        app.request(API_URL, {goodId: params.goodId}, 'GET', this.getDetailSuccess);
        app.request(API_GetComment, {goodid: params.goodId}, 'GET', this.getCommentSuccess);
        app.request(API_IS_COLLECT, {
            goodId: params.goodId,
            openid: app.globalData.openId
        }, 'GET', this.getIsCollectSuccess);
        if (app.globalData.userState !== 0) {
            that.setData({
                noState: true
            })
        }
    },
    getDetailSuccess: function (res) {
        console.log(res);
        var data = res.data;
        console.log(data)
        var imageList = [];
        if (data.imageUrl == null||data.imageUrl.length==0) {
            data.showImg = false;
        } else {
            data.showImg = true;
        }
        //判断是否是发布者进入详情
        var openId = app.globalData.openId;
        if (data.openid == openId) {
            data.isMe = true;
        } else {
            data.isMe = false;
        }
        this.setData({
            detailList: data,
            imageList: imageList,
            publishUserName:data.user.userName,
            publishHeadUrl:data.user.userAvatarUrl,
            publishOpenId:data.openid
        });
        app.request(API_CLICK,{
            clickRate:data.clickRate,
            goodId:this.data.goodId
        },'GET',this.clickSuccess)
        wx.hideToast();
    },
    getCommentSuccess: function (res) {
        console.log(res);
        if(res.status==404){
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～留言可能未显示，请稍后再试',
            })
        }else{
            var commentShow = res.data;
            if(commentShow){
                this.setData({
                    commentShow: commentShow
                })
            }
        }
    },
    getIsCollectSuccess: function (res) {
        console.log(res);
        if(this.data.goodProperty=="0"){
            if (res.data.code == 1040) {
                console.log('没有收藏')
            } else {
                console.log('已收藏')
                this.setData({
                    scIcon: false
                })
            }
        }else{
            if (res.data.code == 1500) {
                console.log('没有收藏')
            } else {
                console.log('已收藏')
                this.setData({
                    scIcon: false
                })
            }
        }

    },
    clickSuccess:function(res){
        console.log(res)
    },
    //跳转详情页
    shouquan: function () {
        wx.switchTab({
            url: '../index/index',
        })
    },
    imgShow: function (event) {
        var src = event.currentTarget.dataset.src;//获取data-src
        var that = this;
        //图片预览
        console.log(src);
        console.log(this.data.imageList);
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: that.data.imageList // 需要预览的图片http链接列表
        })
    },
    //结贴
    end: function () {
        var that = this;
        wx.showModal({
            title: '完成交易',
            content: '确定完成并关闭交易吗？',
            success(res) {
                if (res.confirm) {
                    var goodId = that.data.goodId;
                    app.request(API_END_PRODUCT, {
                        openid: app.globalData.openId,
                        goodId: goodId,
                        type: that.data.goodProperty
                    }, 'GET', that.endProductSuccess)
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    endProductSuccess: function (res) {
        console.log(res);
        if (res.data.code == 1080) {
            wx.showToast({
                title: '交易成功！',
                icon: 'success',
                duration: 2000
            })
        } else {
            wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
            })
        }
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '宝贝详情'
        })
    },
    onCollect: function () {
        app.request(API_Collect, {goodId: this.data.goodId, openid: app.globalData.openId}, 'GET', this.collectSuccess);
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
        if(this.data.goodProperty=='0'){
            if (res.data.code == 1030) {
                console.log('收藏成功');
                this.setData({
                    scIcon: false
                })
            } else {
                wx.showToast({
                    title: "操作失败",
                    icon: "none",
                    duration: 2000
                })
            }
        }else{
            if (res.data.code == 1400) {
                console.log('收藏成功');
                this.setData({
                    scIcon: false
                })
            } else {
                wx.showToast({
                    title: "操作失败",
                    icon: "none",
                    duration: 2000
                })
            }
        }

    },
    cancelCollect: function () {
        app.request(API_CANCEL_Collect, {
            goodId: this.data.goodId,
            openid: app.globalData.openId,
            type: this.data.goodProperty
        }, 'GET', this.cancelCollectSuccess);
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
        })
    },
    cancelCollectSuccess: function (res) {
        console.log(res);
        wx.hideToast();
        if (res.data.code == 1070) {
            console.log('取消收藏')
            this.setData({
                scIcon: true
            })
        } else {
            wx.showToast({
                title: "操作失败",
                icon: "none",
                duration: 2000
            })
        }
    },
    cantCopy: function () {
        wx.showModal({
            title: '提示',
            content: '只有经过一卡通认证的用户才能进行查看信息哦~',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../my/myIdentification/myIdentification',
                    })
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    copyWx: function () {
        let that = this;
        let weixin = that.data.detailList.goodWx.trim();
        if (weixin === '') {
            wx.showToast({
                title: '微信号为空！复制失败！',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.setClipboardData({
                data: weixin,
                success: function (res) {
                    wx.showToast({
                        title: '复制成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            });
        }

    },
    copyQq: function () {
        let that = this;
        let qq = that.data.detailList.goodQq !=null ? that.data.detailList.goodQq.trim() : "";
        if (qq === '') {
            wx.showToast({
                title: 'qq为空！复制失败！',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.setClipboardData({
                data: qq,
                success: function (res) {
                    wx.showToast({
                        title: '复制成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            });
        }

    },
    copyTel: function () {
        let that = this;
        let tel = that.data.detailList.goodTel.trim();
        if (tel === '') {
            wx.showToast({
                title: '手机号为空！复制失败！',
                icon: 'none',
                duration: 2000
            })
        } else {
            wx.setClipboardData({
                data: tel,
                success: function (res) {
                    wx.showToast({
                        title: '复制成功！',
                        icon: 'success',
                        duration: 2000
                    })
                }
            });
        }
    },
    edit:function(e){
        wx.navigateTo({
            url:"../edit/edit?goodId="+this.data.goodId+"&goodProperty="+this.data.goodProperty
        })
    },
    onComment: function () {
        this.setData({
            showBottom: false,
            comment: true
        })
    },
    cancleComment: function () {
        this.setData({
            showBottom: true,
            comment: false,
            commentId: 0
        })
    },
    replyComment: function (e) {
        var commentId = e.currentTarget.dataset.id;
        var commentUsername = e.currentTarget.dataset.username;
        this.setData({
            showBottom: false,
            comment: true,
            commentId: commentId,
            commentUsername: commentUsername
        })
    },
    submitForm(e) {
        var form = e.detail.value.comment;
        var that = this;
        if (form.comment == "") {
            wx.showToast({
                title: '请评论！',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (this.data.commentId == 0) {
            console.log('一级评论')
            var data = {
                commentData:form,
                sendAvatarurl:app.globalData.userInfo.avatarUrl,
                sendUsername:app.globalData.userInfo.nickName,
                sendOpenid:app.globalData.openId,
                goodId: this.data.goodId,
                recOpenid:this.data.publishOpenId,
                recUsername:this.data.publishUserName,
                recAvatarurl:this.data.publishHeadUrl,
                commentType:1
            }
        }else{
            console.log('二级评论')
            var data = {
                commentData:form,
                sendAvatarurl:app.globalData.userInfo.avatarUrl,
                sendUsername:app.globalData.userInfo.nickName,
                sendOpenid:app.globalData.openId,
                goodId: this.data.goodId,
                recOpenid:this.data.publishOpenId,
                recUsername:this.data.publishUserName,
                recAvatarurl:this.data.publishHeadUrl,
                commentType:2,
                commentOneId:this.data.commentId
            }
        }
        console.log(data);
        wx.showToast({
            title:"加载中...",
            icon:"loading"
        })
        app.request(API_Comment,data,'POST',this.commentSuccess)
    },
    commentSuccess:function(res){
        console.log(res);
        wx.hideToast();
        if(this.data.goodProperty=='0'){
            if(res.data.code==1050){
                wx.showToast({
                    title:"留言成功",
                    icon:"success"
                })
                this.setData({
                    commentValue:""
                })
                app.request(API_GetComment, {goodid: this.data.goodId}, 'GET', this.getCommentSuccess);
            }else{
                wx.showToast({
                    title:"留言失败",
                    icon:"none"
                })
            }
        }else{
            if(res.data.code==1060){
                wx.showToast({
                    title:"留言成功",
                    icon:"success"
                })
                this.setData({
                    commentValue:""
                })
                app.request(API_GetComment, {goodid: this.data.goodId}, 'GET', this.getCommentSuccess);
            }else{
                wx.showToast({
                    title:"留言失败",
                    icon:"none"
                })
            }
        }

    },
    cantPersonal: function () {
        wx.showModal({
            title: '提示',
            content: '只有经过一卡通认证的用户才能进行私信哦~',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../my/myIdentification/myIdentification',
                    })
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    onShareAppMessage: function () {
        return {
            title: '能买能卖能say hi！',
            path: '/pages/shouquan/shouquan?goodId=' + this.data.goodId+'&goodProperty='+this.data.goodProperty,
            success: (res) => {
                console.log("转发成功", res);
            }
        }
    }
})		