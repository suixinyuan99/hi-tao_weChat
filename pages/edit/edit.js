var app = getApp();
var api = require('../../utils/api');
var API_GET = api.getGoodDetail;
var API_EDIT = api.editGood;
Page({
    data: {
        data: {
            area: ["南校区", "北校区", "不限校区"],
            showImage: true,
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
        goodID: 0,
        goodProperty: 0,
        isEdit:true
    },
    onLoad: function (params) {
        console.log(params)
        this.setData({
            goodID: params.goodID,
            goodProperty: params.goodType //
        })
        wx.showToast({
            title: "加载中...",
            icon: "loading"
        })
        app.request(API_GET, {
            goodID: params.goodID,
            goodType: params.goodType,
            openid: app.globalData.openId
        }, 'GET', this.getDetailSuccess);
    },
    getDetailSuccess: function (res) {
        console.log(res)
        var data = res.data.result;
        console.log(data)
        this.change('title', data.goodTitle);
        this.change('introduce', data.goodDesc);
        this.change('images', data.imageList);
        if (data.goodCampus == '南校区') {

        } else if (data.goodCampus == '北校区') {
            this.change('areaIndex', 1);
        } else {
            this.change('areaIndex', 2);
        }
        this.change('money', data.goodPrice);
        if (data.goodCatagoty == '数码电子') {

        } else if (data.goodCatagoty == '书籍资料') {
            this.change('typeIndex', 1);
        } else if (data.goodCatagoty == '日用百货') {
            this.change('typeIndex', 2);
        } else if (data.goodCatagoty == '美妆护肤') {
            this.change('typeIndex', 3);
        } else if (data.goodCatagoty == '吃喝分享') {
            this.change('typeIndex', 4);
        } else if (data.goodCatagoty == '鞋衣配饰') {
            this.change('typeIndex', 5);
        } else if (data.goodCatagoty == '卡票出让') {
            this.change('typeIndex', 6);
        } else {
            this.change('typeIndex', 7);
        }
        if (data.goodTel != '' && data.goodTel != "null" &&data.goodTel != null) {
            this.change('contactValue1', data.goodTel);
            if (data.goodWX != '' &&data.goodWX != 'null' && data.goodWX != null) {
                this.change('contactValue2', data.goodWX);
                this.add();
                if (data.goodQQ != '' &&data.goodQQ != 'null' &&data.goodQQ != null) {
                    this.change('contactValue3', data.goodQQ);
                    this.add1();
                }
            } else {
                if (data.goodQQ != '' &&data.goodQQ != 'null' &&data.goodQQ != null) {
                    this.change('contactValue2', data.goodQQ);
                    this.change('contact2Index', 1);
                    this.add();
                }
            }
        } else if (data.goodWX != '' &&data.goodWX != 'null' &&data.goodWX != null) {
            this.change('contactValue1', data.goodWX);
            this.change('contactIndex', 1);
            if (data.goodQQ != '' && data.goodQQ != 'null' && data.goodQQ != null) {
                this.change('contactValue2', data.goodQQ);
                this.change('contact2Index', 1);
                this.add();
            }
        } else {
            this.change('contactValue1', data.goodQQ);
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
    delate1: function () {
        if(this.data.data.showContact3!=true){
            var tep = this.data.data.contact2[this.data.data.contact2Index];
            var origin =['手机号', '微信', 'QQ'];
            var index =this.data.data.contact.indexOf(tep)
            var value=this.data.data.contactValue2
            this.change("contactIndex",index)
            this.change("contactValue1",value)
            this.change('contact2', origin)
            this.change("contact2Index",0)
            this.change("contactValue2","")
            this.change("showContact2", false)
            // console.log("delate1")
            // console.log("c1")
            // console.log(this.data.data.contact)
            // console.log(this.data.data.contactIndex)
            // console.log("c2")
            // console.log(this.data.data.contact2)
            // console.log(this.data.data.contact2Index)
        }else{
            var origin =['手机号', '微信', 'QQ'];
            var c1item=this.data.data.contact2[this.data.data.contact2Index]
            var c1index=this.data.data.contact.indexOf(c1item)
            var c1v=this.data.data.contactValue2

            var c2item=this.data.data.contact3[this.data.data.contact3Index]
            origin.splice(c1index, 1);
            var c2=origin
            var c2index=c2.indexOf(c2item)
            var c2v=this.data.data.contactValue3

            this.change("contactIndex",c1index)
            this.change("contactValue1",c1v)
            this.change('contact2', c2)
            this.change("contact2Index",c2index)
            this.change("contactValue2",c2v)
            this.change('contact3', ['手机号', '微信', 'QQ'])
            this.change("contact3Index",0)
            this.change("contactValue3","")
            this.change("showContact3", false)

            // console.log("delate2")
            // console.log("c1")
            // console.log(this.data.data.contact)
            // console.log(this.data.data.contactIndex)
            // console.log("c2")
            // console.log(this.data.data.contact2)
            // console.log(c2)
            // console.log(this.data.data.contact2Index)

        }
    },
    delate2:function () {

        var origin =['手机号', '微信', 'QQ'];
        var c1item=this.data.data.contact[this.data.data.contactIndex]
        var c1index=this.data.data.contact.indexOf(c1item)

        var c2item=this.data.data.contact3[this.data.data.contact3Index]
        origin.splice(c1index, 1);
        var c2=origin
        var c2index=c2.indexOf(c2item)
        var c2v=this.data.data.contactValue3

        this.change('contact2', c2)
        this.change("contact2Index",c2index)
        this.change("contactValue2",c2v)
        this.change('contact3', ['手机号', '微信', 'QQ'])
        this.change("contact3Index",0)
        this.change("contactValue3","")
        this.change("showContact3", false)
        
    },
    title: function (e) {
        if (e.detail.value == "") {
            wx.showModal({
                title: '提示',
                content: '商品标题不能为空',
                success: function (res) {}
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
                success: function (res) {}
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
                success: function (res) {}
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
                success: function (res) {}
            })
        } else {
            this.change('money', e.detail.value)
        }
    },
    submitTap: function (e) {
        var _this = this;
        if (this.data.data.areaIndex == -1) {
            wx.showModal({
                title: '提示',
                content: '请选择校区',
                success: function (res) {}
            })
            return;
        }
        if (this.data.data.typeIndex == -1) {
            wx.showModal({
                title: '提示',
                content: '请选择分类',
                success: function (res) {}
            })
            return;
        }
        if (e.detail.value.title.length > 30) {
            wx.showModal({
                title: '提示',
                content: '商品标题不能超过20个字哦～',
                success: function (res) {}
            })
            return;
        }
        if (e.detail.value.title == "") {
            wx.showModal({
                title: '提示',
                content: '商品标题不能为空',
                success: function (res) {}
            })
            return;
        }
        if (e.detail.value.introduce == "") {
            wx.showModal({
                title: '提示',
                content: '详情描述不能为空',
                success: function (res) {}
            })
            return;
        }
        var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!isNum.test(e.detail.value.money)) {
            wx.showModal({
                title: '提示',
                content: '意向价格请填写两位小数哦～',
                success: function (res) {}
            })
            return;
        }
        if (e.detail.value.money == "") {
            wx.showModal({
                title: '提示',
                content: '意向价格不能为空',
                success: function (res) {}
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
                    success: function (res) {}
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
                    success: function (res) {}
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
                        success: function (res) {}
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
                        success: function (res) {}
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
                            success: function (res) {}
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
                            success: function (res) {}
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
                success: function (res) {}
            })
            return;
        }
        var areaIndex = this.data.data.areaIndex;
        var typeIndex = this.data.data.typeIndex;
        var openId = app.globalData.openId;
        var userAvatarUrl = app.globalData.userInfo.avatarUrl;
        var userName = app.globalData.userInfo.nickName;
        var datas = {
            goodType: this.data.goodProperty,
            goodID: this.data.goodID,
            goodTitle: e.detail.value.title,
            goodDesc: e.detail.value.introduce,
            goodCampus: this.data.data.area[areaIndex],
            goodWX: this.data.data.weixin,
            goodTel: this.data.data.telephone,
            goodQQ: this.data.data.QQ,
            goodPrice: e.detail.value.money,
            goodCatagory: this.data.data.type[typeIndex],
            openid: openId,
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
    EditProductSuccess: function (res) {
        console.log(res);
        if (res.data.msg == "success") {
            wx.showToast({
                title: "编辑成功",
                icon: "success"
            })

            wx.redirectTo({
                url: '../detailIndex/detailIndex?goodID=' + this.data.goodID + '&goodType=' + this.data.goodProperty,
            })

        } else {
            wx.showToast({
                title: "编辑失败",
                icon: "none"
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