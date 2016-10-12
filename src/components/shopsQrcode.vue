<template>
   <div class="continar">
       <div class="page-header position-relative">
           <div class="header-title">
               <h1>店铺二维码</h1>
           </div>
       </div>


       <div class="page-body">
           <div>
               <h5>搜索条件</h5>
               <select name="选择城市" class="shop_sel" v-model="selectCity" @change="changeSelectCity"  >
                   <option value="" selected="selected">选择城市</option>
                   <template  v-for="item in shopNameList" >
                       <option  >{{ item.name }}</option>
                   </template>


               </select>

               <input type="text" class="form-control conten_width time_width" placeholder="选择时间" v-date-range-picker="timeObj"  :options="{format:'YYYY-MM-DD',language:'zh'}"/>
               <input type="text" class="form-control conten_width" @keyup="enterKeySearch" v-model="searchShop" placeholder="输入店铺号名称/编号"/>
               <div class="searchBtn" @click="searchItem"   >搜索</div>
           </div>

           <div class="shop_lis" >
               <div class="down_more_div">
                   <p class="downLoadMore"  @click.stop="fetchChunkShopFocusQRcode">批量下载</p>
               </div>

               <div class="qr_content">
                   <div class="qrhead">
                       <div  class="float_head ">
                               <input type="checkbox" name=" "   v-model="allChecked"  /><span class="slect_all">全选</span>
                       </div>
                       <div class="float_head pos">开通时间</div>
                       <div class="float_head pos">所在城市</div>
                       <div class="float_head pos">店铺编号</div>
                       <div class="float_head pos">店铺名称</div>
                       <div class="float_head pos">操作</div>
                       <div class="clear_float pos"></div>
                   </div>

                   <div class="shop_list">
                       <template v-for="(index, item) in shoplistData">
                           <div class="qrhead" >
                               <div  class="float_head ">
                                   <input type="checkbox"   id="{{item.shopNo }}" value="{{item.shopNo }}"  v-model="pickedShops"   /><span class="slect_all">{{ index+1 }}</span>
                               </div>
                               <div class="float_head pos text-overflow">{{ item.openTime}}</div>
                               <div class="float_head pos text-overflow">{{item.city ? item.city : "--"}}</div>
                               <div class="float_head pos text-overflow">{{item.shopNo}}</div>
                               <div class="float_head pos text-overflow">{{item.shopName}}</div>
                               <div class="float_head pos down_qr text-overflow" @click="downLoadQrcode(item.shopNo)">下载二维码</div>

                           </div>
                       </template>

                       <div class="row pagePlugin">
                           <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage"  :total-row="totalRows"></pagination>
                       </div>

                   </div>

               </div>


           </div>


       </div>

   </div>

</template>
<style>
    .text-overflow {
        display:block;/*内联对象需加*/
        /*width:31em*/;/*指定宽度*/
        word-break:keep-all;/* 不换行 */
        white-space:nowrap;/* 强制在同一行内显示所有文本，直到文本结束或者遭遇 br 对象。不换行 */
        overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
        text-overflow:ellipsis;/* IE 专有属性，当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
    }
    .conten_width{width: 150px;display: inline-block}
    .shop_list{}
    .shop_sel{height: 35px;}
    .time_width{width: 222px;text-align: center;font-size:16px;}
    input[type="checkbox"]{opacity:1;position: inherit;margin-left: 8px;}
    .slect_all{position: relative;top:-3px;}
    .continar{width:auto}
    .down_more_div{width:auto;height: 40px;border: 1px solid #afafaf ;line-height: 40px;margin:5px auto;width: 99%;}
    .searchBtn{cursor:pointer; position:relative;top:2px; color:#fff; border-radius: 5px;display: inline-block;margin-left: 20px;width: 60px;height:30px;border: 1px solid #6f85bf;line-height: 30px;font-size:18px;text-align: center;background-color: #0b97c4}
    .downLoadMore{cursor:pointer; border-radius: 20px; margin-top:8px;font-size: 18px;width: 120px;background-color: #0b97c4;color: #fff;text-align: center;position: absolute;right: 5%}
    .shop_lis{margin-top: 10px;border: 1px solid #afafaf}
    .checkbox{display: inline-block;width: 20px;height: 20px;border: 0px solid darkseagreen;background-color: #fff;margin-left: 5px;}
    .checkbox_text{ display: inline-block;width: 40px; height: 20px; margin-top:-5px; position: relative;top:-15px;margin-left: 5px; }
    .float_head{ display: inline-block;width: 65px;}
     .pos{position: relative;font-size: 14px;width: 18%;text-align:center;top:-3px;}
    .down_qr{ color: #5fa6d3;cursor:pointer }
    .pagePlugin{ margin-left: 7px;margin-top: 15px;}

</style>
<script>

    import * as ajaxUtil from '../util/Ajax.js'
    import pagination from './common/Pagination.vue'
    var store = require('store')
    export default{
        data(){
            return{
                shopNameList:[  {name:"深圳市"},{name:"广州市"},
                                {name:"上海市"},{name:"苏州市"},
                                {name:"重庆市"},{name:"长沙市"},{name:"郑州市"},{name:"武汉市"},{name:"成都市"},{name:"南京市"}],
                shoplistData:[],
                selectCity:"",
                searchShop:"",
                pickedShops:[],
                isSearch:false,
                selectAll:false,
                selectSigal:false,
                totalPage:0,
                totalRows:0,
                selectShops:"",
                timeObj:null,
                curPage:1,
                rows:20
            }
        },

        computed:{
            allChecked:{
                get:function(){
                    if(this.checkedCount<6){
                        return false
                    }else {
                        return true
                    }
                },
                set:function(value){
                    console.log("value:"+ value);

                    if(value){
                        var sliceShoplistData=this.shoplistData.slice(0,6);

                        this.pickedShops = sliceShoplistData.map(function(item){
                            return item.shopNo
                        })
                    }else {
                        this.pickedShops =[]
                    }

                }
            },
            checkedCount:{
                get: function(){
                    return this.pickedShops.length;
                }
            }


        },

        ready(){
            this.$parent.menucompact=false;

        },
        beforeDestroy(){

        },

        components: {
            pagination
        },

        compiled(){
            this.updateData();
        },
        methods:{
            updateData (){
                let params = {};
                if(this.isSearch){
                    console.log("search");
                    if(this.timeObj != null){
                       // (new Date()).format("yyyy-M-d h:m:s.S")
                        params.start_time=(new Date(this.timeObj.start_time.getTime())).formats("yyyy-M-d");
                        params.end_time=(new Date( this.timeObj.end_time.getTime())).formats("yyyy-M-d")
                    }
                    if(this.selectCity){
                        params.city=encodeURI(this.selectCity);
                    }

                    if(this.searchShop){
                        params.shop_name= encodeURI(this.searchShop);
                    }

                    params.offset = (this.curPage-1)* this.rows;
                    params.limit = this.rows;
                }else {
                    params.offset = (this.curPage-1)* this.rows;
                    params.limit = this.rows;


                }

                var index = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });

                var url = Url.FETCH_SHOP_LIST;
                var self = this;
                ajaxUtil.doGet(url,params).then((xhr,response) =>{
                    var content = response;

                    if(content.returnCode =="success"){
                        layer.close(index);

                        if(content.shops.length>0){
                            //self.isSearch=false;
                            this.shoplistData = content.shops;
                        }else {
                            this.shoplistData=""
                        }


                        this.totalRows = content.totalCount;
                        if(content.totalCount%this.rows == 0){
                            this.totalPage = Math.floor(content.totalCount/this.rows) ;
                        }else{
                            this.totalPage = Math.floor(content.totalCount/this.rows) +1;
                        }

                    }else {
                        return ajaxUtil.doError(response,this);
                    }



                })
            },


            fetchChunkShopFocusQRcode(){
                var _this=this;
               var params={};
                    if(this.pickedShops.length==0){
                        return
                    }
                    params.shop_nos= this.pickedShops.join("|");
                var url = Url.FETCH_BATCH_SHOP_FOCUS_QRCODE;

                var index = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });

                ajaxUtil.doGet(url,params).then((xhr,response)=>{
                    if(response.returnCode=="success"){
                        console.log("response:",response);

                        store.remove('qrCodeList');
                        store.set('qrCodeList',response.codes);
                        console.log("qrCodeList:",response.codes)




                    var  url =Url. FETCH_BATCH_SHOP_PAY_QECODE;
                    ajaxUtil.doGet(url,params).then((xhr,response)=>{

                        if(response.returnCode == "success"){
                            layer.close(index);
                            console.log("支付",response.payCodes);

                            store.remove("payQrcodeList");
                            store.set("payQrcodeList",response.payCodes);

                            _this.$router.go({"path":"/download/shopsQRcode"});

                        }else{
                            return ajaxUtil.doError(response,this);
                        }

                    });

                    }else{
                        return ajaxUtil.doError(response,this);
                    }



                })

            },
            searchItem(){
                //this.isSearch=true;
                this.updateData();
            },
            changeSelectCity(){

                this.updateData();

            },
            enterKeySearch(event){
                if(event.keyCode == "13"){
                    this.updateData();
                }
            },
            downLoadQrcode(shopNum){
                var _this = this;
                var url =Url.FETCH_SINGLE_SHOP_FOCUS_QRCODE+"/"+ shopNum + "/attention/qrcode";
                let params={};


                ajaxUtil.doGet(url,params).then((xhr,response)=>{
                    var content=response;
                    if (content.returnCode==="success") {
                     console.log("response:",content);

                        store.remove('qrCodeList');
                        store.set('qrCodeList',content.code);


                        var url =Url.FETCH_SINGLE_SHOP_PAY_QRCODE+shopNum+"/pay/qrcode"
                        ajaxUtil.doGet(url,{}).then((xhr,response)=>{
                            if(response.returnCode =="success"){

                                console.log("支付",response.payCode);

                                store.remove("payQrcodeList");
                                store.set("payQrcodeList",response.payCode);

                                _this.$router.go({"path":"/download/shopsQRcode"});
                            }else{
                                return ajaxUtil.doError(response,this);
                            }

                        });





                    }else {
                        return ajaxUtil.doError(response,this);
                    }


                })


            },

        },
        watch:{
            curPage () {
                this.updateData()
            },
            pickedShops(newVal,oldVal){
                if(newVal.length>6){
                    this.pickedShops=newVal.splice(0,5);

                }
            },
            /* 监控是否是搜索模式 */
            timeObj(newVal,oldVal){
                if(newVal){
                    this.isSearch=true
                }else {
                    if(this.selectCity || this.searchShop ){
                        this.isSearch=true
                    }else {
                        this.isSearch=false
                    }

                }
            },
            searchShop(newVal,oldVal){
              if(newVal){
                  this.isSearch=true
              }else {
                  if(this.selectCity || this.timeObj){
                      this.isSearch=true;
                  }else{
                      this.isSearch=false;
                  }

              }
            },
            selectCity(newVal,oldVal){
                if(newVal){
                    this.isSearch=true
                }else {
                    if (this.timeObj || this.searchShop){
                        this.isSearch=true;
                    }else{
                        this.isSearch=false
                    }


                }

            },
            /* 监控 由 搜索模式回到 非搜索模式 加载数据*/
            isSearch(newVal,oldVal){
                if(!newVal && oldVal){
                    this.updateData()
                }
            }
        }


    }



</script>
