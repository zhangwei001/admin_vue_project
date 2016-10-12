<template>
    <div class="page-header position-relative">
                        <div class="header-title">
                            <h1>
                                意见反馈
                            </h1>
                        </div>
    </div>
<div class="page-body">
		

	<div class="row">
          <div class="col-xs-12 col-md-12">
            <div class="well with-header  with-footer">
	             <div class="comment" v-for="item in items">
                     <img  v-bind:src="item.head_image" alt="" class="comment-avatar">
                     <div class="comment-body">
                         <div class="comment-text">
                            <div class="comment-header">
                                 <a title="">{{item.nick_name}}({{item.cell_phone}})</a><span>{{item.create_time | date 'YYYY-MM-DD HH:mm'}}</span>
                                 
                            </div>
                            {{item.comment}}
                            <div class="databox-left no-padding">
	                             <tooltip
                                        effect="scale"
                                        placement="bottom"  v-for="imgUrl in item.image_list">
                                          
                                       
	                                         <img slot="tooltip-inner" v-bind:src="imgUrl"  width="300"  slot="modal-body"></img>

                                                <img v-bind:src="imgUrl" style="width:65px; height:65px;"  class="img-rounded"></img>
                                        
                                       
                                        
	                            </tooltip>
                            </div>
                        </div>
                    <div class="comment-footer">
                        <a href="#"><i class="fa fa-thumbs-o-up"></i></a>
                        <a href="#"><i class="fa fa-thumbs-o-down"></i></a>
                       <a href="#">Reply</a>
                    </div>
                </div>

             </div>
             	    <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>
          </div>
   </div>
 </div>
</template>

<script>

import pagination from './common/Pagination.vue'
import modal from './common/Modal.vue'
import * as ajaxUtil from '../util/Ajax.js'
import tooltip from './common/Tooltip.vue'
export default {
  data () {
    return {
      items: [],
      curPage:1,
      rows:5,
      totalPage:0,
      totalRows:0,
     
    }
  },
  
  route: {
    data ({to,next}) {
   
    
    }
  },
  components: {
    pagination,
    modal,
    tooltip
  },
  ready () {
    this.updateData();
  },
  methods: {
    
    updateData () {
      let params = {};
      params.page = this.curPage;
      params.rows = this.rows;
     
      var url = Url.COMMENT;
     
      ajaxUtil.doGet(url,params).then((xhr,response) =>{
	    if(response.status != 200){
		    return ajaxUtil.doError(response,this);
	    }
	    let content = ajaxUtil.decodeContent(response.content);

        var items = JSON.parse(content);
        this.items = items;
        console.log("this.items:",this.items);
        this.totalRows = response.totalCount;
        if(response.totalCount%this.rows == 0){
	         this.totalPage = Math.floor(response.totalCount/this.rows) ;
        }else{
              this.totalPage = Math.floor(response.totalCount/this.rows) +1;
        }
    })

      
    }
   
  
  },
  watch:{
    curPage () {
	    this.updateData()
    },
  
  }
}
</script>