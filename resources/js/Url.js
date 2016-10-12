(function(){
    var CONTEXT = "http://wx.mljiadev.cn/wechat";

    var UPLOAD_URL = "http://upload.mljiadev.cn/upload/cloud/image";

    var DOWNLOAD_URL = "http://dl.mljia.cn/download/image";

    var imgDownLoadUrl= "http://dl.mljia.cn/";

    var MPSERVER ="http://wx.mljiadev.cn/mp";

    var Url={
        MENU:CONTEXT +"/admin/sys/menu",
        CUSTOM_LIST:CONTEXT +"/admin/user/search",
        APP_LIST:CONTEXT + "/admin/app/list",
        INDEX_STATIC:CONTEXT + "/admin/index",
        APP_DETAIL:CONTEXT +"/admin/app/user/list",
          UNBIND_APP:CONTEXT +"/admin/app/unbind/",
        DATA_LIST: CONTEXT + "/admin/platform/list",
        USER_UNBIND:CONTEXT + "/admin/user/unbind/",
        MENU_ALL: CONTEXT + "/admin/sys/allmenu/",
        MENU_DETAIL:CONTEXT + "/admin/menu/view/",
        MENU_DEL:CONTEXT + "/admin/menu/del/",
        MENU_SAVE:CONTEXT + "/admin/menu/save",
        MENU_EXPORTAll:CONTEXT+'/admin/menu/exportAll',
        LOGIN:CONTEXT +"/admin/login",
        /*意见反馈列表*/
         COMMENT : CONTEXT +"/admin/comment/list",

        /*待发布素材模板列表*/
          UNEXPORT_MATERIAL : CONTEXT +"/admin/material/unexport/list",
        /*发布素材模板列表*/
          HISTORY_MATERIAL : CONTEXT +"/admin/material/export/list",
        /*添加素材模板*/
          ADD_MATERIAL : CONTEXT+"/admin/material/add",

          UPDATE_MATERIAL : CONTEXT +"/admin/material/update",
        /*获取店铺类型*/
          GET_TAGS : CONTEXT +"/admin/material/tag/list",
        /*获取店铺列表*/
          GET_SHOPS : CONTEXT +"/admin/material/shop/list",
        /*获取素材详情*/
          MATERIAL_INFO : CONTEXT +"/admin/material/info",
        /*发布素材模板*/
          EXPORT_MATERIAL : CONTEXT +"/admin/material/export",
        /*撤消发布素材模板*/
          REVERSE_MATERIAL : CONTEXT +"/admin/material/reverse",
        /*删除素材模板*/
          DEL_MATERIAL : CONTEXT +"/admin/material/del",
        /*素材模板预览*/
          PREVIEW_MATERIAL : CONTEXT +"/admin/material/preview",
        /**美丽秘籍列表 */
          TAG_RELS : CONTEXT +"/admin/material/tagrel/list",
        /**秘籍详情 */
          TAG_INFO : CONTEXT +"/admin/material/tagrel/info",
        /* 图片库列表*/
          MATERIAL_LIST : CONTEXT +"/admin/image/list",
        /**添加图片 */
          ADD_IMAGE : CONTEXT +"/admin/image/add",
        /**删除图片 */
          DEL_IMAGE : CONTEXT + "/admin/image/del",
        /* 获取店铺列表 */
         FETCH_SHOP_LIST :MPSERVER + "/shop/list",
        /* 获取店铺关注二维码  */
        FETCH_SINGLE_SHOP_FOCUS_QRCODE: MPSERVER+"/shop",
        /* 批量获取店铺关注二维码 */
        FETCH_BATCH_SHOP_FOCUS_QRCODE : MPSERVER +"/shop/batch/qrcode",
        /* 批量获取店铺支付二维码 */
        FETCH_BATCH_SHOP_PAY_QECODE : MPSERVER +"/shop/batch/pay/qrcode",
        /* 获取单个店铺支付二维码 */
        FETCH_SINGLE_SHOP_PAY_QRCODE : MPSERVER + "/shop/",

        /* 服务号意见反馈 */
        FETCH_SERVER_IDEA_FEEDBACK: MPSERVER+ "/feedback/list"

    };
    window.Url=Url;
    window.UPLOAD_URL = UPLOAD_URL;
    window.DOWNLOAD_URL = DOWNLOAD_URL;
    window.imgDownLoadUrl =imgDownLoadUrl;
    /*::::::::::::::::::::::::::::::::::::::::::::::::::::::
     菜单配置url
     ::::::::::::::::::::::::::::::::::::::::::::::::::::::*/


    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    if(!Date.prototype.formats){
        Date.prototype.formats =function(format){
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            };
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        };
    }
    
    
    

})();
