<template>
  
<tabs>
	<tab header="店铺类型" > 
        <div class="row">
            <div class="col-sm-3">
                <label>店铺类型</label>
            </div>
            <div class="col-sm-9">
                 <label>
                    <input type="checkbox"  @change="selectAllTags()" :value="tagCheck" v-model="tagCheck">
                    <span class="text">全部</span>&nbsp;&nbsp;
                </label>
                <label v-for="tag in tags">
                    <input type="checkbox" :value="tag.id" v-model="tagList">
                    <span class="text">{{tag.tag_name}}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                
            </div>
        </div>
	</tab>
	<tab header="店铺详情"> 
		<div class="row" >
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="shopSearch">店铺名称搜索</label>
                    <span class="input-icon icon-right">
                        <input type="text" class="form-control" id="shopSearch" placeholder="店铺名称搜索" v-model="shopName">
                       
                    </span>
                </div>
            </div>
            <div class="col-sm-6">
                 <div class="form-group">
                    <label for="appSearch">公众号搜索</label>
                    <span class="input-icon icon-right">
                        <input type="text" class="form-control" id="appSearch" placeholder="公众号搜索" v-model="appName"> 
                    </span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                     <button type="submit" class="btn btn-blue" @click="searchShop()">查询</button>
                </div>
            </div>
            
        </div>
		                          
		                        
        <div class="row" >
          <div class="col-xs-12 col-md-12">
            <div class="well with-header  with-footer">
	           <table class="table table-hover" >
		           <thead>
			           <tr>
				           <th width="10%"> 
					           <label>
                                    <input type="checkbox"  @change="selectAllShops()" :value="shopCheck" v-model="shopCheck">
	                                    <span class="text"></span>
                                </label>
                            </th>
				           <th width="30%">公众号名称</th>
				           <th width="30%">店铺名称</th>
				           <th width="30%">店铺类型</th>
				       </tr>
			       </thead>
			       <tbody>
	                   <tr v-if="shops.length == 0"><td colspan = "4" >暂无数据</td></tr>
	                   <tr v-else v-for="shopInfo in shops">
		                    <td width="10%">
			                     <label>
                                        <input type="checkbox"  :value="shopInfo.shop_id" v-model="shopList">
                                      <span class="text"></span>
                                    </label>
		                    </td>
				            <td width="30%">{{shopInfo.app_name}}</td>
				            <td width="30%">{{shopInfo.shop_name}}</td>
				            <td width="30%">店铺类型</td>
		               </tr>
	                </tbody>
		       </table>
		    </div>
		</div>
	  </div>
 </tab>
 </tabs>
    

	
</template>
<script>
import tabs from './common/Tabset.vue'
import tab from './common/Tab.vue'
import * as ajaxUtil from '../util/Ajax.js'
	export default{
		data(){
			return{
				type:-1,
				tags:[],
				shops:[],
				activeTab:0,
				shopName:null,
				appName:null,
				
				shopCheck:false,
				tagCheck:false,
			}
		},
		props:{
		    tmplId:{
			    type:Number,
			    default:-2
		    },
			shopList:{
				type:Array,
				default:[],
			},
			tagList:{
				type:Array,
				default:[],
			}
		},
		components: {
		    tabs,
		    tab
        },
		ready () {
            
			this.getTags()
        },
        methods:{
	        getTags(){
		        var url = Url.GET_TAGS;
				let params={};
				ajaxUtil.doGet(url,params).then((xhr,response) => {
		          if(response.status != 200)
		          {
		              return ajaxUtil.doError(response, this);
		          }
		          let content = ajaxUtil.decodeContent(response.content);
		          this.tags = JSON.parse(content);
		          
                });
	        },
	        searchShop(){
		        var url =  Url.GET_SHOPS;
		        let params={};
		        if(this.shopName != null){
			        params.shop_name = this.shopName;
		        }
		        if(this.appName !=null){
			        params.app_name = this.appName;
		        }
		        ajaxUtil.doGet(url,params).then((xhr,response) => {
		          if(response.status != 200)
		          {
		              return ajaxUtil.doError(response, this);
		          }
		          let content = ajaxUtil.decodeContent(response.content);
		          console.log(content)
		          this.shops = JSON.parse(content);
		          
                });
	        },
	        selectAllShops(){
		       

		        if(this.shopCheck){
			        for(let i=0;i<this.shops.length;i++){
				        this.shopList.push(this.shops[i].shop_id);
			        }
			       
	            }else{
		           this.shopList=[];
	            }
				this.shopCheck = !this.shopCheck;
	        },
	        selectAllTags(){

		        if(this.tagCheck){
			        for(let i =0;i<this.tags.length;i++){
				        this.tagList.push(this.tags[i].id)
			        }
		        }else{
			        this.tagList=[];
		        }
				this.tagCheck = !this.tagCheck;
	        },
	        clearAll(){
		        this.shopCheck = false;
		        this.tagCheck = false;
		        this.tagList = [];
		        this.shopList=[];
		        this.shopName=null;
		        this.appName=null;
	        }
        },
        watch:{
	        tmplId(){
		       
		        this.clearAll();
	        }
        }
	}
</script>