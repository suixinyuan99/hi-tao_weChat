var app = getApp();
var api = require('../../../utils/api');
var GET_MESSAGE=api.getNotify;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // personal:[],
      message:[],
    loading:false,
    page:0,
      showStudent:false
  },
  onShow:function(){
      app.request(GET_MESSAGE,{openid:app.globalData.openId},'GET',this.getMyCommentsSuccess)
      //查看是否验证
      wx.showToast({
          title:"加载中...",
          icon:"loading",
          duration: 50000
      })
  },
  onReady: function () {
      wx.setNavigationBarTitle({
          title : '消息通知'
      })
  },
    getMyCommentsSuccess:function(res){
      console.log(res)
        var data=res.data.result;
        if(data){
            for (let i = 0; i < data.length; i++) {
                if ( data[i].firstImgUrl=="null" ||data[i].firstImgUrl==null) {
                    data[i].showImg = false;
                } else {
                    data[i].showImg = true;
                }
            }
            this.setData({
                message:data
            })
        }else{

        }
        wx.hideToast();
    },
    onReachBottom:function(){
        if(this.data.showStudent){
            wx.showNavigationBarLoading()
            var _this=this;
            var page=_this.data.page;
            var newpage=page+1
            if(!_this.data.loading){
                _this.setData({
                    page:newpage,
                    loading:true
                })
                // _this.getPersonal(newpage);
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
        }else{

        }
    },
    //下拉刷新
  onPullDownRefresh:function(){
      if(this.data.showStudent){
          wx.showToast({
              title: '刷新中...',
              icon: 'loading',
              duration:1000
          })
          // this.getPersonal(0);
          this.setData({
              page:0,
          })
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
      }else{

      }
  },
  words:function(){
      wx.navigateTo({
          url: './words/words',
      })
  },
    message:function(e){
        var id=e.currentTarget.dataset.id;
        var goodType=e.currentTarget.dataset.goodtype;
        wx.redirectTo({
            url: '../../detailIndex/detailIndex?goodID=' +id + '&goodType='+goodType,
        })
        app.request(api.readNotify,{notifyID:e.currentTarget.dataset.notify},'GET',this.getNotifySuccess)
    },
    getNotifySuccess:function(e){
        console.log(e)
    },
    system:function(){
        wx.navigateTo({
            url: './system/system',
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