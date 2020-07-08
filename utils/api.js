const domain="https://www.qing-tai.club";
// const domain = "http://13.76.169.167:8088";
module.exports = {
    //1（1）获取openId
    getOpenid: domain + '/wx/getOpenId',
    //1（2）用户登录
    login: domain + '/user/login',
    //1（3）一卡通学生认证
    identification: domain + '/user/authrize',
    //1（4）获取我的收藏
    myCollection: domain + '/user/getMyCollection',
    //1（5）取消收藏某件商品
    cancelCollection: domain + '/user/cancelOneCollection',
    //1（6）我发布的所有商品
    myPublish: domain + '/user/getMyPublish',
    //1（7）设置交易成功
    finishProduct: domain + '/user/setSuccessTrade',
    //2（1）首页转让商品信息获取
    getSellProduct: domain + '/mall/getSellGood',
    //2（2）发布转让商品
    publishSellProduct: domain + '/mall/saveSellGood',
    //2（3）转让商品图片上传
    publishSellProductImage: domain + '/mall/saveSellGoodImage',
    //2（4）商品关键字搜索
    search: domain + '/mall/searchGood',
    //2（5）查看是否收藏了某件转让商品
    isCollectionSellProduct: domain + '/mall/getOneSellCollection',
    //2（6）收藏某件转让商品
    collectionSellProduct: domain + '/mall/saveSellCollection',
    //2（8）转让商品浏览数+1
    plusSellGoodClick: domain + '/mall/plusSellGoodClick',
    //2（9）根据商品goodId获取某件转让商品信息
    getSellProductDetail:domain+'/mall/getSellGoodById',
    //2（10)编辑某件转让商品
    editSellProduct:domain+'/mall/editSellGood',
    //3（1）首页求购商品信息获取
    getBuyProduct: domain + '/mall/getBuyGood',
    //3（2）发布求购商品
    publishBuyProduct: domain + '/mall/saveBuyGood',
    //3（3）求购商品图片上传
    publishBuyProductImage: domain + '/mall/saveBuyGoodImage',
    //3（5）求购商品浏览数+1
    plusBuyGoodClick:domain+'/mall/plusBuyGoodClick',
    //3（6）根据goodId获取某件求购商品信息
    getBuyProductDetail:domain+'/mall/getBuyGoodById',
    //3（7）收藏某件求购商品
    collectionBuyProduct: domain + '/mall/saveBuyCollection',
    //3（8）查看是否收藏了某件求购商品
    isCollectionBuyProduct: domain + '/mall/getOneBuyCollection',
    //3（9）编辑某件求购商品
    editBuyProduct:domain+'/mall/editBuyGood',
    //4（1）针对某件转让商品进行评论
    commentSellProduct: domain + '/comment/commentSellGood',
    //4（2）获取某件转让商品的所有评论
    getSellProductAllComments: domain + '/comment/getSellGoodComments',
    //4（3）针对某件求购商品进行评论
    commentBuyProduct: domain + '/comment/commentBuyGood',
    //4（4）获取某件求购商品的所有评论
    getBuyProductAllComments: domain + '/comment/getBuyGoodComments',
    //4（5）获取我的留言
    getMyComments:domain+'/comment/getMyComments'
}