var imageUtil = require('../../utils/util.js');
var app = getApp();
var api = require('../../utils/api');
7
var API_URL = api.getGoodDetail,
    API_USER = api.getUserInfo,
    API_Collect = api.changeCollectState,
    API_GetComment = api.getGoodComment,
    API_Comment = api.addComment;
  var  API_Follow=api.followUser;


Page({
    data: {
        // banner
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        duration: 1000, //  滑动动画时长1s
        imageList: [], //图片列表
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
        commentValue: "",
        publishUserName: "",
        publishHeadUrl: "",
        publishOpenId: "",
        level:0,
        userState:false
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
        if(app.globalData.userState==0){
            this.setData({
                userState:true
            })
        }
        console.log(params);
        if (app.globalData.userState == 0) {} else {
            this.setData({
                isShouquan: true
            })
        }
        this.setData({
            goodType: params.goodType,
            goodID: params.goodID
        })
        var that = this;
        //调用获取详情和评论API
        app.request(API_URL, {
            goodID: params.goodID,
            goodType: params.goodType,
            openid: app.globalData.openId
        }, 'GET', this.getDetailSuccess);

        app.request(API_GetComment, {
            goodID: params.goodID,
            goodType:params.goodType
        }, 'GET', this.getCommentSuccess);

        if (app.globalData.userState !== 0) {
            that.setData({
                noState: true
            })
        }
    },
    getDetailSuccess: function (res) {
        var data = res.data.result;
        console.log(data)
        var imageList = [];
        if (data.imgList == null || data.imgList.length == 0) {
            data.showImg = false;
        } else {
            data.showImg = true;
        }
        //判断是否是发布者进入详情
        if (data.isMyGood == 1) {
            data.isMe = true;
        } else {
            data.isMe = false;
        }
        // 判断是否收藏
        if (data.isCollect == 0) {
            console.log('没有收藏')
        } else {
            console.log('已收藏')
            this.setData({
                scIcon: false
            })
        }
        if (data.isFollow == 0) {
            console.log('没有关注')
            data.isFollow=false
        } else {
            data.isFollow=true
        }

        // 获取用户资料

        app.request(API_USER, {
            openid: data.openid
        }, 'GET', this.getUserSuccess);

        // 设置QQ等联系消息的显示
        if(data.goodQQ == null || data.goodQQ==""){
            data.showQQ=false
        }else{
            data.showQQ=true
        }
        if(data.goodWX == null || data.goodWX==""){
            data.showWX=false
        }else{
            data.showWX=true
        }
        if(data.goodTel == null || data.goodTel==""){
            data.showTel=false
        }else{
            data.showTel=true
        }


        this.setData({
            detailList: data,
            imageList: imageList,
            publishOpenId: data.openid
        });
        wx.hideToast();
    },
    getUserSuccess:function (res) {
        var data=res.data.result
        this.setData({
            publishUserName: data.userName,
            publishHeadUrl: data.userAvartar,
        })
    },
    getCommentSuccess: function (res) {
        console.log(res);
        if (res.status == 404) {
            wx.showModal({
                title: '提示',
                content: '服务器开小差了～留言可能未显示，请稍后再试',
            })
        } else {
            var commentShow = res.data.result;
            if (commentShow) {
                this.setData({
                    commentShow: commentShow
                })
            }
        }
    },
    
    //跳转详情页
    shouquan: function () {
        wx.switchTab({
            url: '../index/index',
        })
    },
    imgShow: function (event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var that = this;
        //图片预览
        console.log(src);
        console.log(this.data.imageList);
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: that.data.detailList.imgList // 需要预览的图片http链接列表
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
                    app.request(api.finishProduct, {
                        openid: app.globalData.openId,
                        goodID: that.data.goodID,
                        goodType: that.data.goodType
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
            wx.reLaunch({
                url: '../home/home'
              })

        } else {
            wx.showToast({
                title: "交易失败，请稍候再试吧！",
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
            goodID: this.data.goodID,
            openid: app.globalData.openId,
            goodType:this.data.goodType
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
       if (res.data.msg =="collect success") {
            
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
    }},
    cancelCollect: function () {
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
            goodID: this.data.goodID,
            openid: app.globalData.openId,
            goodType:this.data.goodType
        }, 'POST', this.cancelCollectSuccess);
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
        if (res.data.msg == "unCollect success") {
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
    follow: function () {
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
        app.request(API_Follow, {
            openid: app.globalData.openId,
            followedOpenid:this.data.detailList.openid
        }, 'POST', this.followSuccess);
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
        })
    },
    followSuccess: function (res) {
        console.log(res);
        wx.hideToast();
       if (res.data.msg == 'follow success') {
           var data=this.data.detailList
           data.isFollow=true
            
                console.log('收藏成功');
                this.setData({
                    detailList: data
                })
              
            
        } else {
                wx.showToast({
                    title: "操作失败",
                    icon: "none",
                    duration: 2000
                })
    }},
    unfollow: function () {
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
        app.request(API_Follow, {
            openid: app.globalData.openId,
            followedOpenid:this.data.detailList.openid
        }, 'POST', this.unfollowSuccess);
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            mask: true,
            duration: 10000,
        })
    },
    unfollowSuccess: function (res) {
        console.log(res);
        wx.hideToast();
       if (res.data.msg == "unFollow success") {
           var data=this.data.detailList
           data.isFollow=false
            
                console.log('收藏成功');
                this.setData({
                    detailList: data
                })
              
            
        } else {
                wx.showToast({
                    title: "操作失败",
                    icon: "none",
                    duration: 2000
                })
    }},
    cantCopy: function () {
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
        let weixin = that.data.detailList.goodWX.trim();
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
        let qq = that.data.detailList.goodQQ != null ? that.data.detailList.goodQQ.trim() : "";
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
    edit: function (e) {
        wx.navigateTo({
            url: "../edit/edit?goodID=" + this.data.goodID + "&goodType=" + this.data.goodType
        })
    },
    onComment: function () {
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
        this.setData({
            showBottom: false,
            comment: true
        })
    },
    cancleComment: function () {
        this.setData({
            showBottom: true,
            comment: false,
            commentId: 0,
            level:0,
            commentUsername:""
        })
    },
    replyComment: function (e) {
        console.log(e)
        var commentId = e.currentTarget.dataset.id;
        var commentUsername = e.currentTarget.dataset.username;
        var level=e.currentTarget.dataset.level;
        this.setData({
            showBottom: false,
            comment: true,
            commentId: commentId,
            commentUsername: commentUsername,
            level:level
        })
    },
    submitForm(e) {
        var form = e.detail.value.comment;
        var that = this;
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
        
        if (form.comment == "" || form =="" ) {
            wx.showToast({
                title: '请评论！',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (this.data.level == 0) {
            console.log('一级评论')
            var data = {
                openid:app.globalData.openId,
                fatherID:this.data.goodID,
                commentType:1,
                comment: form,
                goodType:this.data.goodType,
            }
        } else if(this.data.level == 1) {
            console.log('二级评论')
            var data = {
                openid:app.globalData.openId,
                fatherID:this.data.commentId,
                commentType:2,
                comment: form,
            }
        }else if(this.data.level == 2) {
            console.log('三级评论')
            var data = {
                openid:app.globalData.openId,
                fatherID:this.data.commentId,
                commentType:3,
                comment: form,
            }
        }
        console.log(data);
        wx.showToast({
            title: "加载中...",
            icon: "loading"
        })
        app.request(API_Comment, data, 'POST', this.commentSuccess)
    },
    commentSuccess: function (res) {
        console.log(res);
        wx.hideToast();
            if (res.data.msg == "addcomment success") {
                wx.showToast({
                    title: "留言成功",
                    icon: "success"
                })
                this.setData({
                    commentValue: ""
                })
                app.request(API_GetComment, {
                    goodID: this.data.goodID,
                    goodType:this.data.goodType
                }, 'GET', this.getCommentSuccess);
            } else {
                wx.showToast({
                    title: "留言失败",
                    icon: "none"
                })
            }
    

    },
    cantPersonal: function () {
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
            path: '/pages/shouquan/shouquan?goodId=' + this.data.goodId + '&goodProperty=' + this.data.goodProperty,
            success: (res) => {
                console.log("转发成功", res);
            }
        }
    }
})