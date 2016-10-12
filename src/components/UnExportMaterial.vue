<template>
	<div class="page-header position-relative">
        <div class="header-title">
            <h1>
                待发布素材模板 
            </h1>
        </div>
                    
    </div>
    <div class="page-body">
	    <div class="row">
		    <div class="col-xs-12 col-md-12">

		        <div class="widget">
			        <a v-link="{name: 'addMaterial'}" class="btn btn-primary">新建图文消息</a>
			    </div>
			</div>
		</div>
		<div class="row">
		    <div class="col-xs-12 col-md-12">                       
			    <div class="well with-header  with-footer">
				    <tabs :active-index.sync="activeTab">
					     <tab v-for="name in headers" :header="name" > 
							    <table class="table table-hover" >
		                        <thead>
		                             <tr>
		                                <th style="width:25%">创建时间</th>
		                                <th style="width:15%">标题</th>

		                                <th style="width:15%">作者</th>
		                                <th style="width:15%">操作</th>
		                             </tr>
		                        </thead>
		                        <tbody>
		                            <tr v-if="items.length == 0"><td colspan = "5" >暂无数据</td></tr>
		                            <tr v-for="item in items" :class="{success:highShowId == item.id}">
		                                <td style="width:25%">{{item.create_time | date 'YYYY-MM-DD HH:MM'}}</td>
		                                <td style="width:15%">{{item.title}}</td>
		                                <td style="width:15%">{{item.author}}</td>
		                                <td style="width:15%">
			                                <a v-link="{name: 'addMaterial', query: { id: item.id }}" class="btn btn-info btn-xs edit"><i class="fa fa-edit"></i> 编辑</a>
			                                <a class="btn btn-sky btn-xs edit" @click="alertExport(item.id)"><i class="fa fa-share"></i> 发布</a>
			                                
			                                <a  class="btn btn-danger btn-xs delete" @click="alertDel(item.id)"><i class="fa fa-trash-o" ></i> 删除</a>
									       <a  class="btn btn-blue btn-xs delete" @click="alertPreview(item.id)"><i class="fa fa-trash-o" ></i> 预览</a>

								       </td>
		                                
		                            </tr>

		                        </tbody>
		                    </table>
        	                <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>
        	            </tab>
					</tabs>
				</div>
			</div>
		</div>
	</div>

	 <modal :show.sync="showExport" title="请选择发布对象" width="1000px"> 										  
           <exportchoose slot="modal-body" :tag-list.sync="tagList" :shop-list.sync="shopList" :tmpl-id.sync="materialId"></exportchoose>
        
        <div slot="modal-footer" class="modal-footer">
            <a class="btn btn-sky " :class="{'disabled':tagList.length ==0 && shopList.length ==0}" @click="export()" >发布</a>
        </div>
	</modal>

	 <modal :show.sync="showDel" title="删除选择">
                            <div class="modal-body" slot="modal-body">
                                确定要删除素材吗？
                            </div>
                            <div class="modal-footer" slot="modal-footer">
                                <a class="btn btn-default"  @click="showDel=false">取消</a>
                                 <a class="btn btn-default"  @click="delMaterial()">确定</a>
                            </div>
     </modal>

	<modal :show.sync="showPreview" title="素材预览">
			<div class="modal-body" slot="modal-body">
				<div class="form-group">
					<input type="text" v-model="wechatCode" class="form-control" placeholder="请输入微信号"></input>
				</div>
			</div>
			<div class="modal-footer" slot="modal-footer">
				<a class="btn btn-default"  @click="showPreview=false">取消</a>
				<a class="btn btn-primary"  @click="preview()">确定</a>
			</div>
	</modal>
</template>
<script>
	
import tabs from './common/Tabset.vue'
import tab from './common/Tab.vue'
import modal from './common/Modal.vue'
import exportchoose from './ExportChoose.vue'
import * as ajaxUtil from '../util/Ajax.js'
import pagination from './common/Pagination.vue'

export default {
	data () {
    return {
      items: [],
      headers:['A类','B类','C类','D类'],
      curPage:1,
      rows:10,
      totalPage:0,
      totalRows:0,
      type:0,
      showExport:false,
      activeTab:0,
      tagList:[],
      shopList:[],
      materialId:-1,
      showDel:false,
      highShowId:-1,
		showPreview:false,
		wechatCode:null
    }
  },
  components: {
	modal,
    exportchoose,
    tabs,
    tab,
	pagination
  },
  route: {
    data ({to,next}) {
      
       
    }
  },
  ready () {

	let activeTab =  this.$route.query.type;
       let id = this.$route.query.id
	    if(activeTab != null){
		    this.activeTab = Number(activeTab)
	    }else{
			this.activeTab = 0;
		}
	    if(id !=null){
		    this.highShowId = id;
	    }
    this.changeType();

  },
  methods: {
	changeType(){
        var type = this.$children[0].activeIndex;
        let params = {};
	    params.page = this.curPage;
	    params.rows = this.rows;
	    params.type = type;
	    var url = Url.UNEXPORT_MATERIAL;  
	    ajaxUtil.doGet(url,params).then((xhr,response) => {
          if(response.status != 200)
          {
              return ajaxUtil.doError(response, this);
          }
          let content = ajaxUtil.decodeContent(response.content);

          this.items = JSON.parse(content);
          this.totalRows = response.totalCount;

          if (response.totalCount % this.rows == 0) {
              this.totalPage = Math.floor(response.totalCount / this.rows);
          } else {
              this.totalPage = Math.floor(response.totalCount / this.rows) + 1;
          }
      });
	},
	export(){
	    let self = this;
		let params={};
		//params.tag_list = this.tagList;
		params.shop_list = this.shopList;
		params.tag_list = this.tagList;
		var url = Url.EXPORT_MATERIAL+"/"+this.materialId;
		  ajaxUtil.doPost(url,params).then((xhr,response) => {
          if(response.status != 200)
          {
              return ajaxUtil.doError(response, this);
          }else{
	          alert("发布成功");
	          this.showExport=false;
	          self.$router.go({"path":"/export/material",query: { id: this.materialId,type:this.activeTab },append: true});
          }
          
      });   
	},
	alertExport(id){
		this.showExport = true;
		this.materialId = id;
		//this.exportchoose.$destory();
	},
	alertDel(id){
		this.showDel = true;
		this.materialId = id;
		//this.exportchoose.$destory();
	},
	  alertPreview(id){
		  this.showPreview = true;
		  this.materialId = id;
	  },
	delMaterial(){
		var url =  Url.DEL_MATERIAL+"/"+this.materialId;
		let params={};
		ajaxUtil.doPost(url,params).then((xhr,response) => {
          if(response.status != 200)
          {
              return ajaxUtil.doError(response, this);
          }else{
	          
	          this.showDel=false;
	          this.changeType();
          }
          
      });   
	},
	  preview(){
		  var url =  Url.PREVIEW_MATERIAL+"/"+this.materialId;
		  let params={};
		  params.wechat_code = this.wechatCode;
		  ajaxUtil.doPost(url,params).then((xhr,response) => {
			  if(response.status != 200)
			  {
				  return ajaxUtil.doError(response, this);
			  }else{

				  this.showPreview=false;
				  this.changeType();
			  }

	      });
	  }
  },
  watch:{
	activeTab(){
		this.curPage = 1;
		this.changeType();
		
	} ,
	curPage () {
		  this.changeType()
	  }
  }
  
}

</script>