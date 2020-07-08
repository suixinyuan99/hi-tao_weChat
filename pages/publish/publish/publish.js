var domain=getApp().globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    show:function(){
        wx.showModal({
            title: '提示',
            content: '只有经过一卡通认证的用户才能进行转让和求购哦~',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                        url: '../../my/myIdentification/myIdentification',
                    })
                } else if (res.cancel) {
                    // wx.switchTab ({
                    //     url: '../../index/index',
                    // })
                }
            }
        })
    },
    sell:function(){
      if(parseInt(getApp().globalData.userState)==0){
          wx.navigateTo({
            url: '../sell/sell'
          })
      }else{
         this.show();
      }
    },
    buy:function(){
        if(parseInt(getApp().globalData.userState)==0){
            wx.navigateTo({
                url: '../buy/buy'
            })
        }else{
            this.show();
        }
    },
  onReady: function () {
      wx.setNavigationBarTitle({
          title : '发布'
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