var app = getApp();
var api = require('../../utils/api');
var API_SELL_URL = api.getSellProductDetail,
    API_BUY_URL = api.getBuyProductDetail,
    API_EDIT_SELL = api.editSellProduct,
    API_EDIT_BUY = api.editBuyProduct;
var API_GET = '',
    API_EDIT = '';
Page({
    data: {
        data: {
            area: ["南校区", "北校区", "不限校区"],
            showImage:true,
            areaIndex: 0,
            type: ['数码电子', '书籍资料', '日用百货', '美妆护肤', '吃喝分享', '鞋衣配饰', '卡票出让', '其他'],
            typeIndex: 0,
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
            weixin: "",
            QQ: "",
            telephone: "",
            hiddenmodalput: true,
            checkedMianze: false,
            loading: false,
            contactValue3: "",
            contactValue2: "",
            contactValue1: "",
            tips: '(必填) 上传照片会增大您的成功几率哦！(最多6张)'
        },
        goodId: 0,
        goodProperty: 0
    },
    onLoad: function (params) {
        console.log(params)
        this.setData({
            goodId: params.goodId,
            goodProperty: params.goodProperty
        })
        if (params.goodProperty == '0') {
            API_GET = API_SELL_URL;
            API_EDIT=API_EDIT_SELL;
        } else {
            API_GET = API_BUY_URL
            API_EDIT=API_EDIT_BUY;
        }
        wx.showToast({
            title: "加载中...",
            icon: "loading"
        })
        app.request(API_GET, {goodId: params.goodId}, 'GET', this.getDetailSuccess);
    },
    getDetailSuccess: function (res) {
        console.log(res)
        var data = res.data;
        this.change('title', data.goodTitle);
        this.change('introduce', data.goodDesc);
        this.change('images', data.imageUrl);
        if (data.goodPlace == '南校区') {

        } else if (data.goodPlace == '北校区') {
            this.change('areaIndex', 1);
        } else {
            this.change('areaIndex', 2);
        }
        this.change('money', data.goodPrice);
        if (data.goodType == '数码电子') {

        } else if (data.goodType == '书籍资料') {
            this.change('typeIndex', 1);
        } else if (data.goodType == '日用百货') {
            this.change('typeIndex', 2);
        } else if (data.goodType == '美妆护肤') {
            this.change('typeIndex', 3);
        } else if (data.goodType == '吃喝分享') {
            this.change('typeIndex', 4);
        } else if (data.goodType == '鞋衣配饰') {
            this.change('typeIndex', 5);
        } else if (data.goodType == '卡票出让') {
            this.change('typeIndex', 6);
        } else {
            this.change('typeIndex', 7);
        }
        if (data.goodTel != '') {
            this.change('contactValue1', data.goodTel);
            if (data.goodWx != '') {
                this.change('contactValue2', data.goodWx);
                this.add();
                if (data.goodQq != '') {
                    this.change('contactValue3', data.goodQq);
                    this.add1();
                }
            } else {
                if (data.goodQq != '') {
                    this.change('contactValue2', data.goodQq);
                    this.change('contact2Index', 1);
                    this.add();
                }
            }
        } else if (data.goodWx != '') {
            this.change('contactValue1', data.goodWx);
            this.change('contactIndex', 1);
            if (data.goodQq != '') {
                this.change('contactValue2', data.goodQq);
                this.change('contact2Index', 1);
                this.add();
            }
        } else {
            this.change('contactValue1', data.goodQq);
            this.change('contactIndex', 2);
        }
        wx.hideToast();
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
        if (e.detail.value.money == "") {
            wx.showModal({
                title: '提示',
                content: '意向价格不能为空',
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
            // var wxreg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
            // if (wxreg.test(contactValue1)) {
            //
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
            if (contact2[contact2Index] == '手机号') {
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
        var openId = app.globalData.openId;
        var userAvatarUrl = app.globalData.userInfo.avatarUrl;
        var userName = app.globalData.userInfo.nickName;
        var datas = {
            goodType: this.data.data.type[typeIndex],
            goodId:this.data.goodId,
            goodTitle: e.detail.value.title,
            goodDesc: e.detail.value.introduce,
            goodPlace: this.data.data.area[areaIndex],
            goodWx: this.data.data.weixin,
            goodTel: this.data.data.telephone,
            goodQq: this.data.data.QQ,
            goodPrice: e.detail.value.money,
        }
        console.log(this.data.data.loading)
        if (!this.data.data.loading) {
            wx.showLoading({
                title: '上传中',
            })
            _this.change('loading', true)
            console.log(_this.data.data.loading)
            app.request(API_EDIT, datas, "POST", this.EditProductSuccess)
        } else {
            wx.showLoading({
                title: '上传中，请等待',
            })
        }
    },
    EditProductSuccess:function(res){
        console.log(res);
        if(res.data.code==1600){
            wx.showToast({
                title:"编辑成功",
                icon:"success"
            })
            if(this.data.goodProperty=='0'){
                wx.redirectTo({
                    url: '../detailIndex/detailIndex?goodId=' + this.data.goodId + '&goodProperty=0',
                })
            }else{
                wx.redirectTo({
                    url: '../detailIndex/detailIndex?goodId=' + this.data.goodId + '&goodProperty=1',
                })
            }
        }else{
            wx.showToast({
                title:"编辑失败",
                icon:"none"
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
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '编辑'
        })
    },
})