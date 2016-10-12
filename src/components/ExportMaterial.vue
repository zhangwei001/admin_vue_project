<template>
	<div class="page-header position-relative">
        <div class="header-title">
            <h1>
                发布历史 
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
                            <form class="form-horizontal" role="form">
                                <div class="row">
                                    <div class="col-md-4">
                                        <label for="time">发布日期：</label>
                                        <input type="text" id="time" placeholder="选择时间" v-date-range-picker="timeObj" :options="{format:'YYYY-MM-DD',language:'zh'}" class="form-control"/>
                                        <div class="horizontal-space"></div>
                                    </div>
                                    <div class="col-md-4">           
                                           <label for="title">标题 ：</label>
                                        <input type="text" id="title" v-model="title" class="form-control"/>
                                        <div class="horizontal-space"></div>
                                    </div>
                                    <div class="col-md-4">
                                          <label for="author">作者 ：</label>
                                        <input type="text" id="author" v-model="author" class="form-control"/>
                                        <div class="horizontal-space"></div>
                                    </div>
                                </div>

                              <div class="row">
                                    <div class="col-md-4">
                                       <a class="btn btn-primary" @click="search()">查询</a>
                                    </div>
                                   
                                </div>



                            </form>
                        </div>
                    </div>
                </div>
                                  
			    <div class="well with-header  with-footer">
				    <tabs :active-index.sync="activeTab" >
					     <tab v-for="name in headers" :header="name" > 
							    <table class="table table-hover" >
		                        <thead>
		                             <tr>
		                                <th style="width:25%">发布时间</th>
		                                <th style="width:15%">标题</th>

		                                <th style="width:15%">作者</th>
		                                <th style="width:15%">发布对象</th>
		                                <th style="width:15%">操作</th>
		                                <th style="width:15%">选择商家数</th>
		                             </tr>
		                        </thead>
		                        <tbody>
		                            <tr v-if="items.length == 0"><td colspan = "6" >暂无数据</td></tr>
		                            <tr v-for="item in items" :class="{success:highShowId == item.id}">
		                                <td style="width:25%">{{item.export_time | date 'YYYY-MM-DD HH:MM'}}</td>
		                                <td style="width:15%">{{item.title}}</td>
		                                <td style="width:15%">{{item.author}}</td>
		                                 <td style="width:15%">{{item.tag_str}}</td>
		                                <td style="width:15%">
			                               
			                                <a  class="btn btn-danger btn-xs delete" @click="alertUnExport(item.id)"><i class="fa fa-trash-o"></i> 撤回</a>
		                                </td>
		                                 <td style="width:15%">{{item.choose_count}}</td>
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

	 <modal :show.sync="showUnexport" title="撤回选择">
                            <div class="modal-body" slot="modal-body">
                                确定要撤回素材吗？
                            </div>
                            <div class="modal-footer" slot="modal-footer">
                                <a class="btn btn-default"  @click="showUnexport=false">取消</a>
                                 <a class="btn btn-default"  @click="unExportMaterial()">确定</a>
                            </div>
     </modal>
</template>
<script>
	
import tabs from './common/Tabset.vue'
import tab from './common/Tab.vue'
import modal from './common/Modal.vue'
import * as ajaxUtil from '../util/Ajax.js'
import pagination from './common/Pagination.vue'

export default {
	data () {
    return {
      items: [],
      headers:['A类','B类','C类','D类'],
      curPage:1,
      rows:7,
      totalPage:0,
      totalRows:0,
      type:0,
      title:null,
      author:null,
      timeObj:null,
      activeTab:0,
      tagList:[],
      shopList:[],
      materialId:-1,
      showUnexport:false,
      highShowId:-1
    }
  },
  components: {
	modal,
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
	    }
	    if(id !=null){
		    this.highShowId = id;
	    }
    this.changeType();

  },
  methods: {
	changeType(){
        var type = this.activeTab;
        let params = {};
	    params.page = this.curPage;
	    params.rows = this.rows;
	    params.type = type;
      
        if(this.timeObj!= null){
		    
	      params.start_time = this.timeObj.start_time.getTime();
          params.end_time = this.timeObj.end_time.getTime();
         }
         if(this.author != null){  
	      params.author = this.author;
         }
          if(this.title != null){  
	      params.title = this.title;
         }
	    var url = Url.HISTORY_MATERIAL;  
	    console.log("url:"+url)
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
	alertUnExport(id){
		this.showUnexport = true;
		this.materialId = id;
	},
	unExportMaterial(){
		var url =  Url.REVERSE_MATERIAL+"/"+this.materialId;
		let params={};
		ajaxUtil.doPost(url,params).then((xhr,response) => {
          if(response.status != 200)
          {
              return ajaxUtil.doError(response, this);
          }else{
	          
	          this.showUnexport=false;
	         this.$router.go({"path":"/unexport/material",query: { id: this.materialId,type:this.activeTab },append: true});

          }
          
      });   
	},
    search(){
        this.curPage = 1;
        this.changeType();
    }
  },
  watch:{
	activeTab(){
        this.curPage = 1;
		this.changeType();
		
	},
      curPage () {
          this.changeType()
      }
  }
  
}

</script>