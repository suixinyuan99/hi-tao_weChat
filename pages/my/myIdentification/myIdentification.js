var app = getApp();
var api = require('../../../utils/api');
var fail=false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageSrc: '',
        showImage:false,
        avatarUrl:"",
        nickName:"",
        fail:false
    },
    onLoad:function(){
        var _this=this;
        wx.getUserInfo({
            success: function (res) {
                console.log(res);
                getApp().globalData.userInfo = res.userInfo;
                _this.setData({
                    nickName: res.userInfo.nickName,
                    avatarUrl: res.userInfo.avatarUrl,
                })
            },
        })
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '学生认证'
        })
    },
    chooseImage: function () {
        let _this = this;
        wx.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: "#259b24",
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        _this.chooseWxImage('album')
                    } else if (res.tapIndex == 1) {
                        _this.chooseWxImage('camera')
                    }
                }
            }
        })
    },
    chooseWxImage: function (type) {
        let _this = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'],
            sourceType: [type],
            success: function (res) {
                // console.log(res);
                //tempFilePaths是个数组，里面存着临时的路径
                var tempFilePaths = res.tempFilePaths;
                console.log(tempFilePaths)
                _this.setData({
                    imageSrc: tempFilePaths,
                    showImage: true
                });
            }
        })
    },
    // 上传图片到我们自己的服务器
    uploadFile: function () {
        let _this = this;
        console.log(this.data.imageSrc);
        if (this.data.imageSrc == "../../../images/image.png") {
            wx.showModal({
                title: '提示',
                content: '请选择图片进行上传',
                success: function (res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        } else {
            var openId = app.globalData.openId;
            console.log(openId);
            wx.showLoading({
                title: '上传中',
            })
            console.log(openId)
            app.requestFile(api.identification, this.data.imageSrc[0], {
                openid: openId
            }, this.identificationSuccess)

            //     success: function (res) {
            //         wx.hideLoading();
            //         var code=JSON.parse(res.data).code;
            //         if(code==200){
            //             wx.showToast({
            //                 title: '验证成功',
            //                 duration: 1500,
            //                 mask: 'false'
            //             })
            //             getApp().globalData.userState=0;
            //             wx.switchTab ({
            //                 url: '../../my/my',
            //             })
            //         }else{
            //             wx.showModal({
            //                 title: '提示',
            //                 content: '一卡通验证失败，非本校人员或图片不清晰',
            //                 success: function(res) {
            //                     if (res.confirm) {
            //                     // console.log('用户点击确定')
            //                     } else if (res.cancel) {
            //                     // console.log('用户点击取消')
            //                     }
            //                 }
            //              })
            //         }
            //     }
            // })
        }
    },
    identificationSuccess: function (res) {
        // console.log(JSON.parse(res.data.data));
        wx.hideLoading();
        var res=JSON.parse(res.data)
        var that=this
        console.log(res);
        if(res.result==0 || res.msg=="无法识别图片，提交人工审核"){
            console.log('图片不能识别');
            wx.showModal({
                title: '提示',
                content: 'sorry，系统开小差去拉！或许可以尝试一下人工认证通道呢：）',
                cancelText:"再试一次",
                confirmText:"人工认证",
                confirmColor:"#FF6201",
                success: function (res) {
                    if (res.confirm) {
                        fail=true
                        that.setData({
                            fail:true
                        })
                        // console.log('用户点击确定')
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        }else if(res.code==1111){
            console.log('图片为空')
            wx.showModal({
                title: '提示',
                content: '图片为空，请再试一次',
                success: function (res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        }else if(res.code==1112){
            console.log('图片写入失败')
            wx.showModal({
                title: '提示',
                content: '图片写入失败，请再试一次',
                success: function (res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            })
        }else{
            console.log('验证成功')
            wx.showToast({
                title: '验证成功',
                icon:"success",
                duration: 1500,
                mask: 'false'
            })
            getApp().globalData.userState = 0;
            wx.switchTab({
                url: '../../my/my',
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