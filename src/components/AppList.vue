<template>
    <div class="page-header position-relative">
                        <div class="header-title">
                            <h1>
                                公众平台店铺列表
                            </h1>
                        </div>
    </div>
<div class="page-body">
		<div class="row">
		    <div class="col-xs-12 col-md-12">

		        <div class="widget">
                    <div class="widget-header bordered-bottom bordered-pink">
                        <span class="widget-caption">搜索条件</span>
                    </div>
                    <div class="widget-body">
                        <div id="horizontal-form">
                            <form class="form-inline" role="form">
                                <div class="form-group">
                                       <input type="text" class="form-control" v-model="user_key" placeholder=" 输入店主姓名/手机号">
                                </div>
                                 <div class="form-group">
	                                   <input type="text" class="form-control" v-model="shop_key" placeholder="输入店铺ID/店铺名称">
                                </div>
                                  <div class="form-group">
	                                   <input type="text" class="form-control" v-model="nick_name" placeholder="公众号名称">
                                </div>
                                <button type="button" class="btn btn-default"  @click="search()">搜索</button>
                            <a @click="exportData()" class="btn btn-primary"><i class="glyphicon glyphicon-export"></i>导出excel</a>
                            </form>
                        </div>
                    </div>
                </div>
		    </div>



		</div>

	<div class="row">
          <div class="col-xs-12 col-md-12">
            <div class="well with-header  with-footer">
	    <table class="table table-hover" >
	        <thead>
	             <tr>
					<th style="width:10%">店主姓名</th>
					<th style="width:10%">店铺公众号累计关注</th>
					
					<th style="width:10%">累计关联顾客</th>
					<th style="width:10%">累计未关联顾客</th>
					<th style="width:10%">
						 <select v-model="bind_status">
	                         <option value="">绑定状态</option>
	                         <option value=0>已绑定</option>
	                         <option value=1>未绑定</option>
	                     </select>
					</th>
					<th style="width:10%">
                         <select v-model="service_type_info">
	                         <option value="">公众号类型</option>
	                         <option value=0>订阅号</option>
	                          <option value=1>订阅老帐号</option>
	                         <option value=2>服务号</option>
	                     </select>
					</th>
					<th style="width:10%">
						 <select v-model="verify_type_info">
	                         <option value="">认证状态</option>
	                         <option value=-1>未认证</option>
	                         <option value=0>已认证</option>
	                     </select>
					 </th>
					<th style="width:20%">绑定/解绑时间</th>
					<th style="width:10%">详情</th>
	             </tr>
            </thead>
            <tbody>
	            <tr v-if="items.length == 0"><td colspan = "8" >暂无数据</td></tr>
				<tr v-for="item in items" >
					<td style="width:10%">
						<a v-link="{ path: '/static/app/detail',query:{user_id:item.user_id}}" v-if="item.status == 0">{{item.user_name}}</a>
						<span v-else>{{item.user_name}}</span>
					</td>
					<td style="width:10%">{{item.attention_num}}</td>
					<td style="width:10%">{{item.bind_coustomer_num}}</td>
					<td style="width:10%">{{item.un_bind_coustomer_num}}</td>
					<td style="width:10%">
						<span v-if="item.status == 0">已绑定</span>
                        <span v-if="item.status == 1">未绑定</span>
					</td> 
					<td style="width:10%">
                           <span v-if="item.service_type_info ==0">订阅号</span>
                           <span v-if="item.service_type_info ==1">订阅老帐号</span>
                            <span v-if="item.service_type_info == 2">服务号</span>
					</td>  
					  
					<td   style="width:10%">
						<span v-if="item.verify_type_info == -1">未认证</span>
						<span v-if="item.verify_type_info == 0">已认证</span>
					</td>  
					<td style="width:20%">{{item.bind_time}}</td>
					<td style="width:10%">

                        <modal :show.sync="item.show_modal" title="店铺详情">

                        <div slot="modal-body" class="modal-body">
                            <div class="well attached" v-for="shopInfo in item.shop_list">
                               {{shopInfo.shopOtherName}}
                            </div>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-primary" @click="item.show_modal=false">Close</button>
                        </div>
                    </modal>

                    <a class="btn btn-default btn-xs purple" @click="item.show_modal=true"> <i class="fa fa-info"></i>详情</a>

                    <a class="btn btn-default btn-xs purple" @click="unbind(item)" v-if="item.status == 0"> <i class="fa fa-info"></i>解绑</a>
            </td>
				</tr>
	
            </tbody>	
            	     
	    </table>
	     
	    <pagination   :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>
     </div>
   </div>
   </div>
   </div>


</template>
<script>

import pagination from './common/Pagination.vue'
import modal from './common/Modal.vue'
import * as ajaxUtil from '../util/Ajax.js'
export default {
  data () {
    return {
      items: [],
      start_time:null,
      end_time:null,
      curPage:1,
      rows:14,
      totalPage:0,
      totalRows:0,
      bind_status:"",
      service_type_info:"",
      verify_type_info:""
    }
  },
  
  route: {
    data ({to,next}) {
   
    
    }
  },
  components: {
    pagination,
    modal
  },
  ready () {
	this.path = Url.APP_DETAIL;
    this.updateData();
  },
  methods: {
    
    updateData () {
      let params = {};
      params.page = this.curPage;
      params.rows = this.rows;
      params.status = this.bind_status;
      params.service_type_info = this.service_type_info;
      params.verify_type_info = this.verify_type_info;
      params.user_key = this.user_key;
      params.shop_key = this.shop_key;
      params.nick_name = this.nick_name;
      var url = Url.APP_LIST;
     
      ajaxUtil.doGet(url,params).then((xhr,response) =>{
	    if(response.status != 200){
		    return ajaxUtil.doError(response,this);
	    }
	    let content = ajaxUtil.decodeContent(response.content);

        var items = JSON.parse(content);
         for(var item of items) {
             item.show_modal=false;
         }
          this.items = items;
        this.totalRows = response.totalCount;
        if(response.total_count%this.rows == 0){
	         this.totalPage = Math.floor(response.totalCount/this.rows) ;
        }else{
              this.totalPage = Math.floor(response.totalCount/this.rows) +1;
        }
    })

      
    },
    search () {
	     this.curPage = 1;
        this.updateData();
    },

exportData () {
    let params = "";


    let path =  Url.CONTEXT + "/admin/app/export" + params;

    window.location.href= path;
},
      unbind(item){
          var url = Url.UNBIND_APP+item.id;
          var params = {};
          ajaxUtil.doGet(url,params).then((xhr,response) => {
              if(response.status != 200){
                  return ajaxUtil.doError(response, this);
              }
          alert("解绑成功");
          this.updateData();
          });
      }
  
  },
  watch:{
    curPage () {
	    this.updateData()
    },
    bind_status () {
	    this.curPage = 1;
	    this.updateData();
    },
    service_type_info (){
	    this.curPage = 1;
	    this.updateData();
    },
    verify_type_info (){
	    this.curPage = 1;
	    this.updateData();
    }
  }
}
</script>