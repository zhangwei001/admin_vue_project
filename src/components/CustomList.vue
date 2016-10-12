<template>
         <div class="page-header position-relative">
                             <div class="header-title">
                                 <h1>
                                     公众号顾客查询
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
                                         <input type="text" class="form-control" placeholder="输入微信昵称 / 手机号" v-model="user_key">                                     </div>

                                    <button type="button" class="btn btn-default"  @click="search()">搜索</button>

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
					<th style="width:10%">顾客昵称</th>
					<th style="width:10%">店铺公众号名称</th>
					
					<th style="width:10%">关联店铺名称</th>
					<th style="width:10%">关联顾客姓名</th>
					<th style="width:10%">手机号</th>
					<th style="width:10%">关联状态 </th>
					<th style="width:30%">关注时间 </th>
					<th style="width:10%">操作</th>
	             </tr>
            </thead>
            <tbody>
	            <tr v-if="user_key == null  || user_key == ''"><td colspan = "8" >请优先输入顾客昵称进行查询</td></tr>
	            <tr v-if="items == null"><td colspan = "8" >未找到符合条件的用户</td></tr>
				<tr v-if="user_key != null" v-for="item in items">
					<td style="width:10%">{{item.nick_name}}</td>
					<td style="width:10%">{{item.app_nick_name}}</td>
					
					<td style="width:10%">{{item.shop_name}}</td>
					<td style="width:10%">{{item.custom_name}}</td>
					<td style="width:10%">{{item.cell_phone}}</td>
					<td style="width:10%">
						<span v-if="item.bind_status ==0">潜在用户</span>
						<span v-if="item.bind_status ==1">未绑定</span>
						<span v-if="item.bind_status ==2">已绑定</span>
					 </td>
					<td style="width:30%">{{item.subscribe_time}} </td>
					<td style="width:10%">
						<a  v-if="item.bind_status==1" @click="showModal=true">恢复成潜在用户</a>
                    <modal :show.sync="showModal"  v-if="item.bind_status==1">
                            <div class="modal-body" slot="modal-body">
                                确定要恢复成潜在用户吗？
                            </div>
                            <div class="modal-footer" slot="modal-footer">
                                <a class="btn btn-default"  @click="showModal=false">取消</a>
                                 <a class="btn btn-default"  @click="unbind(item.map_id)">确定</a>
                            </div>
                   </modal>
                  
						<a  v-if="item.bind_status==2" @click="showModal=true">解绑</a>
                          <modal :show.sync="showModal"  v-if="item.bind_status==2">
                                <div  class="modal-body" slot="modal-body">确定要取消绑定吗？</div>
                                <div class="modal-footer" slot="modal-footer">
                                    <a class="btn btn-default" @click="showModal=false">取消</a>
                                     <a class="btn btn-default" @click="unbind(item.map_id)">确定</a>
                                 </div>
                            </modal>
					</td>
				</tr>
	
            </tbody>	
            	     
	    </table>
	     
	    <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage"></pagination>
     </div>
   </div>
   </div>
      </div>
</template>
<script>

import pagination from './common/Pagination.vue'
import tableModal from './TableModel.vue'
import modal from './common/Modal.vue'
import * as ajaxUtil from '../util/Ajax.js'
export default {
  data () {
    return {
      items: [],
      user_key:null,
      curPage:1,
      rows:10,
      totalPage:0,
      showModal:false
    }
  },
  
  route: {
    data ({to,next}) {
   
    
    }
  },
  components: {
    pagination,
    tableModal,
    modal
  },
  ready () {
    this.updateData();
  },
  methods: {
    
    updateData () {
      let params = {};
      params.page = this.curPage;
      params.rows = this.rows;
      
      params.user_key = this.user_key;
      if(params.user_key != null && params.user_key !=""){
	      var url = Url.CUSTOM_LIST;
	      ajaxUtil.doGet(url,params).then((xhr,response) =>{
		    if(response.status != 200){
			    return ajaxUtil.doError(response);
		    }
		    
		    let content = ajaxUtil.decodeContent(response.content);
		    if(content != null && content !=""){

	            this.items = JSON.parse(content);
	        }else{

	            this.items = null;
	           
        }
	        
	    })
      }
    },
    search () {
        this.updateData();
    },
    unbind (id){
	    console.log(id)
	     var url = Url.USER_UNBIND + id;
        console.log(url)
	      ajaxUtil.doGet(url,null).then((xhr,response) =>{
		    if(response.status != 200){
			    return ajaxUtil.doError(response,this);
		    }else{
			    this.showModal = false;
			    alert("解绑成功");
			    this.updateData();
		    }
	    })
    }
  
  },
  watch:{
    curPage () {
	   this.$router.go({name:'deadmsg',query:{page:this.curPage,searchText:this.searchText,rows:this.rows}})
    },
    end_time () {

	    let endTime = new Date(this.end_time);
	    let startTime = new Date(this.start_time);
	    console.log(endTime)
	    if( endTime != null && endTime.getTime() - startTime.getTime() > 150*24*3600*1000){
		    alert("所选时间超过150天，请重新选择");

	    }
	    if( endTime != null &&  endTime.getTime() - startTime.getTime() <0){
		    alert("起始时间不能超过结束时间");

	    }
	   
    }
  }
}
</script>