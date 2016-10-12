<template>
    <div class="continar">
        <div class="page-header position-relative">
            <div class="header-title">
                <h1>下载店铺二维码</h1>
            </div>
        </div>


        <div class="page-body page-body-download">
            <template v-if="qrCodeList.length>0">
                <template  v-for="item in qrCodeList">
                    <div class="cavans_container">

                        <div class="cavas_text"  v-bind:id= " item.shopNo "  >

                        </div>
                        <div class="text_info">
                            <p class="shopName" v-text="item.shopName"></p>
                                <div class="shopInfo_in shopNo">
                                    <span>店铺号：</span>
                                    <p class="shop_no" v-text=" item.shopNo"> </p>
                                </div>

                        </div>
                    </div>
                </template>
            </template>

            <template v-else>
                <div class="cavans_container">


                    <div class="cavas_text"  v-bind:id= "qrCodeList.shopNo"  >

                    </div>
                    <div class="text_info">
                        <p class="shopName" v-text="qrCodeList.shopName"></p>
                        <div class="shopInfo_in shopNo">
                            <span>店铺号：</span>
                            <p class="shop_no" v-text=" qrCodeList.shopNo"> </p>
                        </div>
                    </div>
                </div>


            </template>

        </div>

    </div>
</template>
<style>
    .page-body-download{text-align:center;width:750pt;margin: 0px auto;position:relative;left: 12px;}
    .shop_no{display: inline-block;}
   .cavans_container{display: inline-block;margin-left: 15px;}
   .cavas_text{padding: 5px; border: 1px solid #dadada;background-color: #ffffff; border-bottom: 0px solid gray}
    .shopName{text-align: center;font-weight:600}
    .shopNo{text-align: center;position:relative;top:-23px;margin-left:-8px; }
    .text_info{line-height: 40px; border: 1px solid #dadada;height:40px;background-color: #ffffff;border-top: 0px solid #dadada; }
    canvas{display: block;width:278px;}
    canvas:nth-child(2){margin-top: 5px;border-top: 1px solid #dadada;padding-top: 5px; }


</style>
<script>
    import * as ajaxUtil from '../util/Ajax.js'
    var store = require('store');
    export default{
        data(){
            return{
                qrCodeList:[],
                qrPayCodeList:[],
                qrPayCodeList:[]
                //payImg:"/resources/img/pay.jpg"
            }
        },
        beforeCompile(){
            this.getqQrCodeList();
            this.getPayQrShopList();

        },
        compiled(){
            this.$parent.menucompact=true;

        },
        methods:{
            getqQrCodeList:function(){
                var qrCodeLis =store.get("qrCodeList");
                this.qrCodeList=qrCodeLis;


                console.log("qrCodeLis:",qrCodeLis)
            },
            Point:function(x, y) {
                    return {x:x, y:y};
            },
            getPayQrShopList:function(){
                var qrPayCodeList = store.get("payQrcodeList");
                this.qrPayCodeList=qrPayCodeList;

                //支付二维码 添加 logo
              /*  for(var i=0;i<qrPayCodeList.length;i++){
                    this.qrPayCodeList[i].logoName =this.payImg;
                }
                console.log("qrPayCodeList:",this.qrPayCodeList);*/

            },

            Rect:function(x, y, w, h) {
                return {x:x, y:y, width:w, height:h};
            },
            drawRoundedRect:function(rect, r, ctx) {
                var ptA = this.Point(rect.x + r, rect.y);
                var ptB = this.Point(rect.x + rect.width, rect.y);
                var ptC = this.Point(rect.x + rect.width, rect.y + rect.height);
                var ptD = this.Point(rect.x, rect.y + rect.height);
                var ptE = this.Point(rect.x, rect.y);

                ctx.beginPath();

                ctx.moveTo(ptA.x, ptA.y);
                ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

                ctx.stroke();
            },
            generateQRImg:function(item){
                var _this = this;
                var  defineLogoImg =imgDownLoadUrl +item.logoName;
               /* if( item.codeUrl.indexOf("weixin.qq.com") == -1 ){//支付
                    defineLogoImg=item.logoName;
                }else{//关注
                    defineLogoImg=imgDownLoadUrl +item.logoName;

                }*/

                var qrnode= new AraleQRCode({
                    render: 'canvas',
                    correctLevel: 3,
                    text: item.codeUrl ,
                    size: 268,   /*278*/
                    background: '#ffffff',
                    foreground: '#000000',
                    pdground: '#000000',
                    image :defineLogoImg,
                    imageSize :45
                });
              /*  qrnode.width=278;
                qrnode.height=278;*/
                if(item.logoName){
                   qrnode.id=item.shopNo;
                    var ctx     = qrnode.getContext('2d');
                    ctx.lineWidth = 10;
                    ctx.strokeStyle = "#fff";
                /*
                    var rect = this.Rect(118, 115, 35, 35);
                    this.drawRoundedRect(rect, 5, ctx);*/

                    ctx.strokeRect(113, 114, 41, 41);// 横坐标 纵坐标 宽   高

                }

                setTimeout(function(){
                    if(qrnode){
                        document.getElementById(item.shopNo).appendChild(qrnode);
                    }


                },500)

            }


        },
        ready(){




           if(Object.prototype.toString.call(this.qrPayCodeList)=='[object Array]'){
                for(var i= 0;i<this.qrPayCodeList.length;i++){
                    this.generateQRImg(this.qrPayCodeList[i]);
                }

            }else  {
                this.generateQRImg(this.qrPayCodeList);
            }

            if(Object.prototype.toString.call(this.qrCodeList)=='[object Array]'){
                for(var i= 0;i<this.qrCodeList.length;i++){
                    this.generateQRImg(this.qrCodeList[i]);
                }

            }else  {
               this.generateQRImg(this.qrCodeList);
            }






        }

    }
</script>
