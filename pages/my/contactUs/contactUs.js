Page({

    /**
    * 页面的初始数据
    */
    data: {

    },
    onReady: function () {
      wx.setNavigationBarTitle({
          title : '联系我们'
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
    },
    previewImage: function () {  
    // var current=e.target.dataset.src;
    wx.previewImage({
        // current: current, // 当前显示图片的http链接
        urls: ["https://likun-1257851268.cos.ap-chengdu.myqcloud.com/860f0645-a97e-41b6-9365-c2648e4e99e3.jpg"] // 需要预览的图片http链接列表
    })
  },
  copy:function(){
    wx.setClipboardData({
                data: "QTworkshop",
                success: function(res) {
                    wx.showToast({
                        title       : '复制成功！',
                        icon        : 'success',
                        duration    : 2000
                    })
                }
            });
  }
})