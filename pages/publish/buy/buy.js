var app = getApp();
var api = require("../../../utils/api")
Page({
    data: {
        data: {
            area: ["南校区", "北校区", "不限校区"],
            areaIndex: -1,
            showImage:false,
            type: ['数码电子', '书籍资料', '日用百货', '美妆护肤', '吃喝分享', '鞋衣配饰', '卡票出让', '其他'],
            typeIndex: -1,
            contact: ['手机号', '微信', 'QQ'],
            contactIndex: 0,
            showContact2: false,
            showContact3: false,
            contact2: ['手机号', '微信', 'QQ'],
            contact2Index: 0,
            contact3: ['手机号', '微信', 'QQ'],
            contact3Index: 0,
            mianze: "《免责声明》",
            images: [],
            title: '',
            introduce: '',
            money: '',
            QQ: "",
            weixin: "",
            telephone: "",
            hiddenmodalput: true,
            checkedMianze: false,
            loading: false,
            contactValue3: "",
            contactValue2: "",
            contactValue1: "",
            tips: '照片是选填的哦，上传照片增加曝光率哦：）(最多6张)',
            titlePlaceholder:"想买啥？",
            introducePlaceholder:"描述地越具体就越多人看哦：）",
        }
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '发布求购'
        })
    },
    change: function (key, value) {
        var data = this.data.data;
        data[key] = value;
        this.setData({
            data: data
        })
    },
    area: function (e) {
        this.change('areaIndex', e.detail.value)
    },
    type: function (e) {
        this.change('typeIndex', e.detail.value)
    },
    contact: function (e) {
        this.change('contactIndex', e.detail.value)
    },
    contact2: function (e) {
        this.change('contact2Index', e.detail.value)
    },
    contact3: function (e) {
        this.change('contact3Index', e.detail.value)
    },
    add: function () {
        var contact2 = this.data.data.contact2;
        var contactIndex = this.data.data.contactIndex;
        contact2.splice(contactIndex, 1);
        this.change("showContact2", true)
        this.change('contact2', contact2)
    },
    add1: function () {
        var contact3 = this.data.data.contact3;
        var contact2Index = this.data.data.contact2Index;
        var contactIndex = this.data.data.contactIndex;
        contact3.splice(contactIndex, 1);
        contact3.splice(contact2Index, 1);
        this.change("showContact3", true)
        this.change('contact3', contact3)
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
            count: 6, // 默认9
            sizeType: ['compressed'],
            sourceType: [type],
            success: function (res) {
                //tempFilePaths是个数组，里面存着临时的路径
                var tempFilePaths = res.tempFilePaths;
                var images = _this.data.data.images;
                var length = images.length;
                for (let i = 0; i < tempFilePaths.length; i++) {
                    if (length >= 6) {
                        wx.showModal({
                            title: '提示',
                            content: '图片不能超过6张',
                            success: function (res) {
                            }
                        })
                    } else {
                        images.push(tempFilePaths[i]);
                        length++;
                    }
                }
                _this.change('images', images);
            }
        })
    },
    // 上传图片到我们自己的服务器
    uploadimg: function (data) {
        var that = this,
            i = data.i ? data.i : 0,
            success = data.success ? data.success : 0,
            fail = data.fail ? data.fail : 0;
        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            name: 'file',
            formData: {
                goodid: data.goodId,
            },
            header: {
                "Content-Type": "multipart/form-data",
            },
            success: (resp) => {
                success++;
            },
            fail: (res) => {
                fail++;
            },
            complete: () => {
                i++;
                if (i == data.path.length) {   //当图片传完时，停止调用
                    wx.showToast({
                        title: '上传成功',
                        duration: 1500,
                        mask: 'false'
                    })
                    wx.hideLoading();
                    wx.redirectTo({
                        url: '../../detailIndex/detailIndex?goodId=' + data.goodId + '&goodProperty=1',
                    })
                } else {//若图片还没有传完，则继续调用函数
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadimg(data);
                }
            }
        });
    },
    title: function (e) {
        if (e.detail.value == "") {
            wx.showModal({
                title: '提示',
                content: '商品标题不能为空',
                success: function (res) {
                }
            })
        } else {
            this.change('title', e.detail.value)
        }
    },
    contactBlur1: function (e) {
        if (e.detail.value == "") {
            wx.showModal({
                title: '提示',
                content: '联系方式至少填一个哦',
                success: function (res) {
                }
            })
        } else {
            this.change('contactValue1', e.detail.value)
        }
    },
    contactBlur2: function (e) {
        this.change('contactValue2', e.detail.value)
    },
    contactBlur3: function (e) {
        this.change('contactValue3', e.detail.value)
    },
    introduce: function (e) {
        if (e.detail.value == "") {
            wx.showModal({
                title: '提示',
                content: '详情描述不能为空',
                success: function (res) {
                }
            })
        } else {
            this.change('introduce', e.detail.value)
        }
    },
    money: function (e) {
        var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!isNum.test(e.detail.value)) {
            wx.showModal({
                title: '提示',
                content: '意向价格请填写两位小数哦～',
                success: function (res) {
                }
            })
        }else{
            this.change('money', e.detail.value)
        }
    },
    submitTap: function (e) {
        var _this = this;
        if(this.data.data.areaIndex==-1){
            wx.showModal({
                title: '提示',
                content: '请选择校区',
                success: function (res) {
                }
            })
            return;
        }
        if(this.data.data.typeIndex==-1){
            wx.showModal({
                title: '提示',
                content: '请选择分类',
                success: function (res) {
                }
            })
            return;
        }
        if (e.detail.value.title.length > 20) {
            wx.showModal({
                title: '提示',
                content: '商品标题不能超过20个字哦～',
                success: function (res) {
                }
            })
            return;
        }
        if (e.detail.value.title == "") {
            wx.showModal({
                title: '提示',
                content: '商品标题不能为空',
                success: function (res) {
                }
            })
            return;
        }
        if (e.detail.value.introduce == "") {
            wx.showModal({
                title: '提示',
                content: '详情描述不能为空',
                success: function (res) {
                }
            })
            return;
        }
        if (e.detail.value.money == "") {
            wx.showModal({
                title: '提示',
                content: '意向价格不能为空',
                success: function (res) {
                }
            })
            return;
        }
        var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!isNum.test(e.detail.value.money)) {
            wx.showModal({
                title: '提示',
                content: '意向价格请填写两位小数哦～',
                success: function (res) {
                }
            })
            return;
        }
        var contactIndex = this.data.data.contactIndex;
        var contactValue1 = this.data.data.contactValue1;
        if (contactIndex == 0) {
            //手机
            var phonereg = /^1[34578]\d{9}$/;
            if (phonereg.test(contactValue1)) {
                this.change('telephone', contactValue1)
            } else {
                wx.showModal({
                    title: '提示',
                    content: '请输入正确的手机号哦~',
                    success: function (res) {
                    }
                })
                return;
            }
        } else if (contactIndex == 1) {
            //微信
            this.change('weixin', contactValue1)
            // var wxreg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
            // if (wxreg.test(contactValue1)) {
            //     this.change('weixin', contactValue1)
            // } else {
            //     wx.showModal({
            //         title: '提示',
            //         content: '请输入正确的微信号哦~',
            //         success: function (res) {
            //         }
            //     })
            //     return;
            // }
        } else {
            //qq
            var qqreg = /^[1-9][0-9]{4,10}$/;
            if (qqreg.test(contactValue1)) {
                this.change('QQ', contactValue1)
            } else {
                wx.showModal({
                    title: '提示',
                    content: '请输入正确的QQ号哦~',
                    success: function (res) {
                    }
                })
                return;
            }
        }
        var showContact2 = this.data.data.showContact2;
        if (showContact2) {
            var contact2Index = this.data.data.contact2Index;
            var contactValue2 = this.data.data.contactValue2;
            var contact2 = this.data.data.contact2;
            console.log(contact2[contact2Index])
            if (contact2[contactValue2] == '手机号') {
                var phonereg = /^1[34578]\d{9}$/;
                if (phonereg.test(contactValue2)) {
                    this.change('telephone', contactValue2)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '请输入正确的手机号哦~',
                        success: function (res) {
                        }
                    })
                    return;
                }
            } else if (contact2[contact2Index] == '微信') {
                this.change('weixin', contactValue2)
                // var wxreg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
                // if (wxreg.test(contactValue2)) {
                //     this.change('weixin', contactValue2)
                // } else {
                //     wx.showModal({
                //         title: '提示',
                //         content: '请输入正确的微信号哦~',
                //         success: function (res) {
                //         }
                //     })
                //     return;
                // }
            } else {
                var qqreg = /^[1-9][0-9]{4,10}$/;
                if (qqreg.test(contactValue2)) {
                    this.change('QQ', contactValue2)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '请输入正确的QQ号哦~',
                        success: function (res) {
                        }
                    })
                    return;
                }
            }
            var showContact3 = this.data.data.showContact3;
            if (showContact3) {
                var contact3Index = this.data.data.contact3Index;
                var contactValue3 = this.data.data.contactValue3;
                var contact3 = this.data.data.contact3;
                console.log(contact3[contactValue3])
                if (contact3[contact3Index] == '手机号') {
                    var phonereg = /^1[34578]\d{9}$/;
                    if (phonereg.test(contactValue3)) {
                        this.change('telephone', contactValue3)
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '请输入正确的手机号哦~',
                            success: function (res) {
                            }
                        })
                        return;
                    }
                } else if (contact3[contact3Index] == '微信') {
                    this.change('weixin', contactValue3)
                    // var wxreg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/;
                    // if (wxreg.test(contactValue3)) {
                    //     this.change('weixin', contactValue3)
                    // } else {
                    //     wx.showModal({
                    //         title: '提示',
                    //         content: '请输入正确的微信号哦~',
                    //         success: function (res) {
                    //         }
                    //     })
                    //     return;
                    // }
                } else {
                    var qqreg = /^[1-9][0-9]{4,10}$/;
                    if (qqreg.test(contactValue3)) {
                        this.change('QQ', contactValue3)
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '请输入正确的QQ号哦~',
                            success: function (res) {
                            }
                        })
                        return;
                    }
                }
            }
        }
        if (e.detail.value.mianze.length == 0) {
            wx.showModal({
                title: '提示',
                content: '请阅读并同意《免责声明》',
                success: function (res) {
                }
            })
            return;
        }
        var areaIndex = this.data.data.areaIndex;
        var typeIndex = this.data.data.typeIndex;
        var openId = getApp().globalData.openId;
        console.log(getApp().globalData.userInfo)
        var userAvatarUrl = getApp().globalData.userInfo.avatarUrl;
        var userName = getApp().globalData.userInfo.nickName;
        var datas = {
            userAvatarUrl: userAvatarUrl,
            userName: userName,
            openid: openId,
            goodTitle: e.detail.value.title,
            goodDesc: e.detail.value.introduce,
            goodPrice: e.detail.value.money,
            goodPlace: this.data.data.area[areaIndex],
            goodType: this.data.data.type[typeIndex],
            goodWx: this.data.data.weixin,
            goodTel: this.data.data.telephone,
            goodQq: this.data.data.QQ
        }
        console.log(datas);
        if (!this.data.data.loading) {
            wx.showLoading({
                title: '上传中',
            })
            _this.change('loading', true)
            app.request(api.publishBuyProduct, datas, "POST", this.publishBuyProductSuccess)
            // wx.request({
            //     url: domain + '/mall/buy',
            //     method: "post",
            //     data: datas,
            //     header: {'Content-Type': 'application/x-www-form-urlencoded'},
            //     success: function (res) {
            //
            //     },
            //     fail: function (res) {
            //         wx.hideLoading();
            //         wx.showToast({
            //             title: '上传失败',
            //             icon: 'fail',
            //             duration: 1000,
            //             mask: true
            //         })
            //         _this.change('loading', false)
            //     }
            // })
        } else {
            wx.showLoading({
                title: '上传中，请等待',
            })
        }
    },
    publishBuyProductSuccess: function (res) {

        console.log(res)
        if (res.data.code == 1020) {
            //成功
            //上传图片
            if (this.data.data.images.length != 0) {
                this.uploadimg({
                    url: api.publishBuyProductImage,
                    path: this.data.data.images,
                    goodId: res.data.object.goodId,
                })
            }else{
                wx.hideLoading();
                wx.showToast({
                    title: '上传成功',
                    duration: 1500,
                    mask: 'false'
                })
                wx.redirectTo({
                    url: '../../detailIndex/detailIndex?goodId=' + res.data.object.goodId + '&goodProperty=1',
                })
            }
        }else{
            this.change('loading', false)
            wx.hideLoading();
            wx.showToast({
                title: "发布失败",
                icon: "none",
                duration: 2000
            })
        }
    },
    jumpMianze: function () {
        console.log(this.data.data.hiddenmodalput)
        this.change('hiddenmodalput', false)
    },
    //取消按钮
    cancel: function () {
        this.change('hiddenmodalput', true);
        this.change('checkedMianze', false);
    },
    //确认
    confirm: function () {
        this.change('hiddenmodalput', true);
        this.change('checkedMianze', true);
    },
    //删除图片
    delete: function (e) {
        var images = this.data.data.images;
        images.splice(e.currentTarget.dataset.index, 1);
        this.change('images', images)
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