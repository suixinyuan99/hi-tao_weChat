var domain=getApp().globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      personal:[],
      page:0,
      loading:false,
      show:false
  },
  onShow:function(){
      var _this=this;
      _this.getWords(0);
      if(this.data.personal==[]){
         this.setData({
             show:false
         })
      }else{
          this.setData({
              show:true
          })
      }
  },
  onReady: function () {
      wx.setNavigationBarTitle({
          title : '留言消息'
      })
  },
    //触底事件
    onReachBottom:function(){
        wx.showNavigationBarLoading()
        var _this=this;
        var page=_this.data.page;
        var newpage=page+1
        if(!_this.data.loading){
            _this.setData({
                page:newpage,
                loading:true
            })
            _this.getWords(newpage);
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }
    },
    //上拉刷新
  onPullDownRefresh:function(){
      this.getWords(0);
      this.setData({
        page:0
      })
      wx.stopPullDownRefresh();
       wx.hideNavigationBarLoading();
    }, 
  getWords:function(page){
    var _this=this;
    wx.request({
      url:domain+"/comment/getComment",
      method:"POST",
      header: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:{
        openid:getApp().globalData.openId,
        page:page
      },
      success:res=>{
        console.log(res);
         if(page==0){
              var data=[];
            }else{
              var data=_this.data.personal;
            }
            for(let i=0;i<res.data.length;i++){
              if(!res.data[i].imageUrl){
                res.data[i].showImg=false;
              }else{
                res.data[i].showImg=true;
              }
                if(res.data[i].commentContent.length>10){
                    res.data[i].commentContent=res.data[i].commentContent.substring(0,10)+"...";
                }
                if(res.data[i].userName.length>10){
              res.data[i].userName=res.data[i].userName.substring(0,10)+"...";
            }
            res.data[i].date=res.data[i].date.substring(5,res.data[i].date.length-3);
              data.push(res.data[i]);
            }
            _this.setData({
              personal:data,
              loading:false
            })
      }
    })
  },
  //跳转
  personal:function(e){
    var goodId=e.currentTarget.dataset.goodid;
    var goodProperty=e.currentTarget.dataset.goodproperty;
    console.log(goodProperty)
    wx.navigateTo({
      url:"../../../detailIndex/detailIndex?goodId="+goodId+"&goodProperty="+goodProperty
    });
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