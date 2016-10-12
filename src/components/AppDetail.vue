<template>

         <div class="page-header position-relative">
                             <div class="header-title">
                                 <h1>
                                     {{appInfo.nick_name}}
                                     <small>
                                         <i class="fa fa-angle-right"></i>
                                         {{appInfo.cell_phone}}
                                     </small>
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
                                    <div class="col-md-3">
                                        <input type="text" name="to" placeholder="选择时间" v-date-range-picker="timeObj" :options="{format:'YYYY-MM-DD',language:'zh'}" class="form-control"/>
                                        <div class="horizontal-space"></div>
                                    </div>
                                    <div class="col-md-3">
                                        <tooltip
                                                effect="scale"
                                                placement="bottom">
                                            <img slot="tooltip-inner" src="{{appInfo.qr_file_url}}" width="300" height="300" slot="modal-body"></img>

                                            <button class="btn btn-default ">二维码</button>
                                        </tooltip>


                                    </div>
                                    <div class="col-md-3">
                                     <a  @click="exportData()" class="btn btn-primary"><i class="glyphicon glyphicon-export"></i>导出excel</a>
                                    </div>
                                </div>

                                <div class="horizontal-space"></div>

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
					<th style="width:20%">时间</th>
					<th style="width:10%">店铺公众号累计关注</th>
					
					<th style="width:10%">累计关联顾客</th>
					<th style="width:10%">累计未关联顾客</th>
					<th style="width:10%">累计无号码顾客</th>
					<th style="width:10%">新增关注</th>
					<th style="width:10%">取消关注</th>
					<th style="width:10%">净增关注</th>
	             </tr>
            </thead>
            <tbody>
	            <tr v-if="items.length == 0"><td colspan = "8" >暂无数据</td></tr>
				<tr v-for="item in items">
					<td style="width:20%">{{item.time}}</td>
					<td style="width:10%">{{item.attention_total}}</td>
					
					<td style="width:10%">{{item.customer}}</td>
					<td style="width:10%">{{item.no_customer}}</td>
					<td style="width:10%">{{item.no_phone}}</td>
					<td style="width:10%">{{item.attention_add}}</td>
					<td style="width:10%">{{item.attention_del}}</td>
					<td style="width:10%">{{item.attention_net}}</td>
				</tr>
	
            </tbody>	
            	     
	    </table>
	     
	    <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>
     </div>
   </div>
   </div>
   </div>
</template>
<script>

import tooltip from './common/Tooltip.vue'
import pagination from './common/Pagination.vue'
import modal from './common/Modal.vue'
import * as ajaxUtil from '../util/Ajax.js'
export default {
  data () {
    return {
      items: [],
      appInfo:{nickName:'公众号名称'},
      timeObj:{},
      curPage:1,
      rows:10,
      totalPage:0,
      user_id:null,
     totalRows:0,
     showModal:false
    }
  },
  
  route: {
    data ({to,next}) {
   
        this.user_id = to.query.user_id;;
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
      params.user_id=this.user_id;
      if(this.timeObj.start_time != null && this.timeObj.end_time != null){
	      params.start_time = moment(this.timeObj.start_time).format('YYYY-MM-DD');
	      params.end_time = moment(this.timeObj.end_time).format('YYYY-MM-DD');
      }
      var url = Url.APP_DETAIL;  
      ajaxUtil.doGet(url,params).then((xhr,response) =>{
	    if(response.status != 200){
		    return ajaxUtil.doError(response,this);
	    }
	    let content = ajaxUtil.decodeContent(response.content);

        let obj = JSON.parse(content);
        this.appInfo = obj.app_info;
        this.items = obj.data_list;
        this.totalRows = response.totalCount;
        if(response.totalCount%this.rows == 0){
	         this.totalPage = Math.floor(response.totalCount/this.rows) ;
        }else{
              this.totalPage = Math.floor(response.totalCount/this.rows) +1;
        }
    })
    },
    search () {
   
    },
    exportData () {
	    let params = "";
	    let start_time="";
	    let end_time="";
	    if(this.timeObj.start_time != null && this.timeObj.end_time != null){
	      start_time = moment(this.timeObj.start_time).format('YYYY-MM-DD');
	      end_time = moment(this.timeObj.end_time).format('YYYY-MM-DD');
      }
	    params +="?user_id="+this.user_id+"&start_time="+start_time +"&end_time="+end_time;
	    let path =  Url.CONTEXT + "/admin/app/user/export" + params;
	    window.location.href= path;
    }
  
  },
  watch:{
    curPage () {
	  this.updateData()
    },
     timeObj (){
	    let endTime = this.timeObj.end_time;
	    let startTime = this.timeObj.start_time;
	    console.log(endTime)
	    if( endTime != null && endTime.getTime() - startTime.getTime() > 150*24*3600*1000){
		    alert("所选时间超过150天，请重新选择");
            this.timeObj={}
	    }
	    if( endTime != null &&  endTime.getTime() - startTime.getTime() <0){
		    alert("起始时间不能超过结束时间");
            this.timeObj={}
	    }else{
	       this.updateData();
        }
    }
  }
}
</script>