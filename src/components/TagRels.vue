<template>
    
           <div class="widget">
               <div class="widget-body">
                   <div class="row" >
                          <div class="col-xs-12 col-md-12">
                            <div class="form-group">
                                <label for="keyWord">按关键字搜索</label>
                                <span class="input-icon icon-right">
                                    <input type="text" class="form-control" id="keyWord" placeholder="请输入关键字" v-model="keyWord"/>
                                
                                </span>
                            </div>
                        
                            <div class="form-group">
                                    <button type="submit" class="btn btn-blue" @click="getRelsData(keyWord)">查询</button>
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
                                    <input type="radio"   v-model="tagId">
	                                    <span class="text"></span>
                                </label>
                            </th>
				           <th width="30%">标题</th>
				           <th width="30%">秘籍类型</th>
				       </tr>
			       </thead>
			       <tbody>
	                   <tr v-if="tagRels.length == 0"><td colspan = "3" >暂无数据</td></tr>
	                   <tr v-else v-for="tagRel in tagRels">
		                    <td width="10%">
			                     <label>
                                        <input type="radio"  :value="tagRel.id" v-model="tagId">
                                      <span class="text"></span>
                                    </label>
		                    </td>
				            <td width="30%">{{tagRel.topicTitle}}</td>
				            <td width="30%">{{tagRel.tagName}}</td>
				           
		               </tr>
	                </tbody>
		       </table>
                <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>

            </div>
		</div>
	  </div>
            
        </div>
      </div>
      
</template>
<script>
import pagination from './common/Pagination.vue'
import * as ajaxUtil from '../util/Ajax.js'
   export default {
       props:{
           tagId:{
			    type:Number,
			    default:-1
		    }
       },
       components:{
           pagination
       },
       data(){
            return{
               keyWord:null,
                tagRels:[],
                curPage:1,
                rows:3,
                totalPage:0,
                totalRows:0,
            }
        },
        ready(){
             this.getRelsData();
        },
        methods:{
             getRelsData(keyWord){
              let params={};
                 params.page = this.curPage;
                 params.rows = this.rows;
              if(keyWord != null){
                  params.key_word = keyWord;
              }      
              let url = Url.TAG_RELS;
              ajaxUtil.doGet(url,params).then((xhr,response) => {
                    if(response.status == 200){
	                   let content = ajaxUtil.decodeContent(response.content);

                       this.tagRels = JSON.parse(content);
         
                        this.totalRows = response.totalCount;
                        if(response.totalCount%this.rows == 0){
                                this.totalPage = Math.floor(response.totalCount/this.rows) ;
                        }else{
                                this.totalPage = Math.floor(response.totalCount/this.rows) +1;
                        }
                    }
                });
          }
        },
        watch:{
             curPage () {
                this.getRelsData()
          },
        }
   }
</script>
