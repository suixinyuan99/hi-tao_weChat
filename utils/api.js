const domain="http://132.232.65.50:8082/";
//const domain="https://www.qing-tai.club";
// const domain = "http://13.76.169.167:8088";
// const domain = "http://rest.apizza.net/mock/889b8687e7b5129ccb12f71adff583ef"
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
    getSellProductDetail: domain + '/mall/getSellGoodById',
    //2（10)编辑某件转让商品
    editSellProduct: domain + '/mall/editSellGood',
    //3（1）首页求购商品信息获取
    getBuyProduct: domain + '/mall/getBuyGood',
    //3（2）发布求购商品
    publishBuyProduct: domain + '/mall/saveBuyGood',
    //3（3）求购商品图片上传
    publishBuyProductImage: domain + '/mall/saveBuyGoodImage',
    //3（5）求购商品浏览数+1
    plusBuyGoodClick: domain + '/mall/plusBuyGoodClick',
    //3（6）根据goodId获取某件求购商品信息
    getBuyProductDetail: domain + '/mall/getBuyGoodById',
    //3（7）收藏某件求购商品
    collectionBuyProduct: domain + '/mall/saveBuyCollection',
    //3（8）查看是否收藏了某件求购商品
    isCollectionBuyProduct: domain + '/mall/getOneBuyCollection',
    //3（9）编辑某件求购商品
    editBuyProduct: domain + '/mall/editBuyGood',
    //4（1）针对某件转让商品进行评论
    commentSellProduct: domain + '/comment/commentSellGood',
    //4（2）获取某件转让商品的所有评论
    getSellProductAllComments: domain + '/comment/getSellGoodComments',
    //4（3）针对某件求购商品进行评论
    commentBuyProduct: domain + '/comment/commentBuyGood',
    //4（4）获取某件求购商品的所有评论
    getBuyProductAllComments: domain + '/comment/getBuyGoodComments',
    //4（5）获取我的留言
    getMyComments: domain + '/comment/getMyComments',



    // 已有接口

    // 登录授权——————————————————————————

    // 获取openID √
    getOpenid: domain + '/user/getOpenid',
    // 登录 √
    login: domain + '/user/getUserState',
    //一卡通学生认证
    identification: domain + '/user/authrize',



    //获取首页相关信息————————————————

    // 获取轮播图
    getSwiper: domain + '/good/getImages',
    //获取商品
    getProdect: domain + '/good/getGood',
    // 获取全部商品
    getAllProdect: domain + '/good/getAllGood',
    // 获取我关注的商品
    getMyFollowProdect: domain + '/good/getMyFollowDynamic',
    // 获得商品详情
    getGoodDetail: domain + '/good/getGoodDetail',






    // 关注——————————————————————

    // 发起关注 √
    followUser: domain + '/follow/follow',
    // 获取关注和粉丝数 √
    getFollowAndFansNum: domain + '/follow/getFollowAndFansNum',
    // 获取关注人列表 √
    getFollowList: domain + '/follow/getFollow',
    // 获取粉丝列表 √
    getFansList: domain + '/follow/getFans',
    // 某用户是否关注某用户 √
    isFollow: domain + '/follow/isFollow',
    // 关注人，粉丝发布详情 √
    getUserAllIssue: domain + '/follow/userAllIssue',


    // 收藏——————————————————————————————

    // 收藏或取消收藏
    changeCollectState: domain + '/collect/collect',
    // 返回收藏商品列表
    getGoodCollection: domain + '/collect/getGoodCollection',
    // 某用户是否收藏某商品
    getCrowProdect: domain + '/follow/isCollect',

    // 搜索————————————————————————

    // 搜索商品或用户 √
    searchUserItem: domain + '/search/search',
    // 获取个人搜索历史记录 √
    getSearchHistory: domain + '/search/history',
    // 获取搜索榜单 √
    getSearchBoard: domain + '/search/board',
    // 删除个人搜索历史
    deleteHistory: domain + '/search/deleteHistory',
    //根据openid返回用户信息
    getUserInfo: domain + '/user/getUserInfo',

    // 提交商品——————————————

    // 发布商品
    publish: domain + '/good/issue',
    publishPicture: domain + '/good/goodImageUpload',
    // 存储草稿
    getCrowProdect: domain + '/good/saveDraft',
    // 获取草稿
    getCrowProdect: domain + '/good/getDraft',

    // 评论相关————————————————————

    // 添加评论
    addComment: domain + '/comment/addcomment',
    // 删除评论
    deleteComment: domain + '/comment/deletecomment',
    // 获取商品评论
    getGoodComment: domain + '/comment/getGoodComment',
    //获取新消息数量
    getNewCommentNum:domain+"/notify/getnotreadnum",

    // 消息相关——————————————

    // 获取用户消息列表
    getNotify: domain + '/notify/getnotify',
    // 消息已读
    readNotify: domain + '/notify/getnotifydetails',
    // 获取未读消息总数
    getUnreadNotify: domain + '/notify/getnotifydetails',
    // 删除消息
    deleteNotify: domain + '/notify/deletenotify',

    // 用户

    // 获取我的发布
    getMyPublish: domain + '/good/getMyIssue',
    // 擦亮商品
    shineGoods:domain + '/good/renewGood',
    // 完成交易
    finishProduct:domain + '/good/finishTrade',
    // 删除交易
    delateGoods:domain + '/good/deleteGood',
    //获取我卖出的
    getMySelling: domain + '/good/getMySellGood',
    // 编辑商品
    editGood: domain + '/good/editGood',


    //获取精选收藏
    getRSCollection: domain + '/collect/getRsCollection',
    getRS: domain + '/good/getRs',
    







}