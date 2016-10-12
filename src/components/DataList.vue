<template>

<div class="page-header position-relative">
                    <div class="header-title">
                        <h1>
                            公众平台绑定店铺统计

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
                                    <div class="col-md-9">
                                     <a @click="exportData()" class="btn btn-primary"><i class="glyphicon glyphicon-export"></i>导出excel</a>
                                    </div>
                                </div>

                                <div class="horizontal-space"></div>

                            </form>
                        </div>
                    </div>
                </div>
		    </div>



		</div>


<tabs :active-index.sync="activeTab">
  <tab header="统计数据" >
	<div class="row">
      <div class="col-xs-12 col-md-12">
        <div class="well with-header  with-footer">
                  <table class="table table-hover" >
                        <thead>
                             <tr>
                                <th style="width:25%">时间</th>
                                <th style="width:15%">公众平台累计绑定店铺</th>

                                <th style="width:15%">店铺公众号累计关注</th>
                                <th style="width:15%">店铺公众号累计关联顾客</th>
                                <th style="width:15%">公众号累计未关联顾客</th>
                                <th style="width:15%">公众号累计无号码顾客</th>
                             </tr>
                        </thead>
                        <tbody>
                            <tr v-if="items.length == 0"><td colspan = "5" >暂无数据</td></tr>
                            <tr v-for="item in items">
                                <td style="width:25%">{{item.time}}</td>
                                <td style="width:15%">{{item.bind_shops}}</td>
                                <td style="width:15%">{{item.attention}}</td>
                                <td style="width:15%">{{item.customer}}</td>
                                <td style="width:15%">{{item.no_customer}}</td>
                                <td style="width:15%">{{item.no_phone}}</td>
                            </tr>

                        </tbody>

                    </table>
        	   <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>

        </div>


     </div>
   </div>
   </tab>

    <tab header="公众平台累计绑定店铺" >
        <div class="row">
            <chart :legend="legend" :x-axis="xAxis" :series="series"></chart>
         </div>
     </tab>
     <tab header="店铺公众号累计关注">
        <div class="row">
        <chart :legend="legend" :x-axis="xAxis" :series="series"></chart>
                </div>
        </tab>
        <tab header="店铺公众号累计关联顾客">
        <div class="row">
            <chart :legend="legend" :x-axis="xAxis" :series="series"></chart>
        </div>
                </tab>
        <tab header="公众号累计未关联顾客">
            <div class="row">
                <chart :legend="legend" :x-axis="xAxis" :series="series"></chart>
            </div>
        </tab>
        <tab header="公众号累计无号码顾客">
            <div class="row">
                <chart :legend="legend" :x-axis="xAxis" :series="series"></chart>
            </div>
        </tab>
    </tabs>
</template>
<script>

import pagination from './common/Pagination.vue'
import chart from './Chart.vue'
import modal from './common/Modal.vue'
import tabs from './common/Tabset.vue'
import tab from './common/Tab.vue'
import * as ajaxUtil from '../util/Ajax.js'
export default {
  data () {
	  var path = Url.CONTEXT + "/admin/platform/export";
    return {
      items: [],
      timeObj:{},
      end_time:"",
      curPage:1,
      rows:10,
      totalPage:0,
      totalRows:0,
      charItems:[],
      legend:[],
      xAxis:[],
      series:[],
      activeTab:0
    }
  },
  
  route: {
    data ({to,next}) {
   
    
    }
  },
  components: {
    pagination,
    modal,
    chart,
    tabs,
    tab
  },
  ready () {
    this.updateData();

  },
  methods: {
    
    updateData () {
      let params = {};
      params.page = this.curPage;
      params.rows = this.rows;
     
      if(this.timeObj.start_time != null && this.timeObj.end_time != null){
	      console.log("timeObj1="+JSON.stringify(params))
	      params.start_time = moment(this.timeObj.start_time).format('YYYY-MM-DD');
	      params.end_time = moment(this.timeObj.end_time).format('YYYY-MM-DD');
      }
     
      var url = Url.DATA_LIST;  
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

          params.page=1;
          params.rows=150;
          var url = Url.DATA_LIST;
          ajaxUtil.doGet(url,params).then((xhr,response) =>{

                if(response.status != 200){
                    return ajaxUtil.doError(response,this);
                }
                let content = ajaxUtil.decodeContent(response.content);

                this.charItems = JSON.parse(content);


             });
    },

changeChart(){
    var index = this.$children[0].activeIndex-1;
    var lengends = ['公众平台累计绑定店铺','店铺公众号累计关注','店铺公众号累计关联顾客','公众号累计未关联顾客','公众号累计无号码顾客'];
    this.xAxis=[];
    this.series=[];
    this.legend = lengends[index];
    let bindShops={name:'公众平台累计绑定店铺',type:'line',stack: '总量',data:[]};
    let attention={name:'店铺公众号累计关注',type:'line',stack: '总量',data:[]};
    let customer={name:'店铺公众号累计关联顾客',type:'line',stack: '总量',data:[]};
    let noCustomer={name:'公众号累计未关联顾客',type:'line',stack: '总量',data:[]};
    let noPhone={name:'公众号累计无号码顾客',type:'line',stack: '总量',data:[]};

    for(var i= this.charItems.length-1 ;i>=0 ;i--){
        this.xAxis.push(this.charItems[i].time);

        bindShops.data.push(this.charItems[i].bind_shops);
        attention.data.push(this.charItems[i].attention);
        customer.data.push(this.charItems[i].customer);
        noCustomer.data.push(this.charItems[i].no_customer);
        noPhone.data.push(this.charItems[i].no_phone);
    }

    if(index ==0) {
        this.series.push(bindShops);
    }
    else if(index == 1) {
        this.series.push(attention);
    }else if(index ==2) {
        this.series.push(customer);
    }else if(index ==3) {
        this.series.push(noCustomer);
    }else if(index == 4) {
        this.series.push(noPhone);
    }

},
    exportData () {
	    let params = "";
	    let start_time="";
	    let end_time="";
	    if(this.timeObj.start_time != null && this.timeObj.end_time != null){
		    
	      start_time = moment(this.timeObj.start_time).format('YYYY-MM-DD');
	      end_time = moment(this.timeObj.end_time).format('YYYY-MM-DD');
      }
      console.log(start_time)
	    params +="?start_time="+start_time +"&end_time="+end_time;
	    let path =  Url.CONTEXT + "/admin/platform/export" + params;
	 
	    window.location.href= path;
    }
  
  },
  watch:{
    curPage () {
	    this.updateData()
    },
    activeTab(){	
		this.changeChart();
	
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
	   
    },
    timeObj (){
	    let endTime = this.timeObj.end_time;
	    let startTime = this.timeObj.start_time;
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