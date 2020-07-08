var domain=getApp().globalData.domain;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        content:[],
        page:0,
        loading:false,
        show:false
    },
    onShow:function(){
      var _this=this;
      _this.getSystemMessage(0);
      if(this.data.content==[]){
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
            title : '系统消息'
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
            _this.getPersonal(newpage);
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }
    },
    onPullDownRefresh:function(){
        console.log("上拉")
        wx.showNavigationBarLoading()
        var _this=this;
        var page=_this.data.page;
        var newpage=page+1
        if(!_this.data.loading){
            _this.setData({
                page:newpage,
                loading:true
            })
            _this.getSystemMessage(newpage);
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }
    }, 
    getSystemMessage:function(page){
      var _this=this;
      wx.request({
          url:domain+"/systemMessage/getSystemMessage",
          method:"POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data:{
            page:page
          },
          success:res=>{
            console.log(res);
            if(page==0){
              var data=[];
            }else{
              var data=_this.data.content;
            }
            for(let i=0;i<res.data.length;i++){
              data.push(res.data[i]);
            }
            _this.setData({
              content:data,
              loading:false
            })
          }
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