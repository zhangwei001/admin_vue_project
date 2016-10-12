<template>
         <div class="page-header position-relative">
                             <div class="header-title">
                                 <h1>
                                     今日绑定累计统计
                                 </h1>
                             </div>
         </div>
    <div class="page-body">
<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12">
               <h5 class="row-title before-themesecondary">今日绑定累计统计</h5>
               <div class="row well bg-themeprimary no-margin">
                   <div class="">
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">公众平台累计绑定店铺</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.total_app}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">店铺公众号累计关注</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.total_user_attentioin}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">店铺公众号累计关联顾客</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.total_customer}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">店铺公众号累计潜在顾客</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.total_potention_customer}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
    </div>

<div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12">
               <h5 class="row-title before-themesecondary">今日绑定店铺统计</h5>
               <div class="row well bg-themeprimary no-margin">
                   <div class="">
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">公众平台新增绑定店铺</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.add_bind_app}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">店铺公众号新增关注</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.add_user_attention}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">店铺公众号取消关注</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.cancel_user_attention}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                       <div class="col-lg-3 col-sm-4 col-xs-12">
                           <div class="plan-circular">
                               <span class="plan-title">店铺公众号新增关联顾客</span>
                               <hr class="title-devider" />
                               <div class="plan-body">
                                   <div class="plan-currency"></div>
                                   <div class="plan-price">{{item.add_bind_customer}}</div>
                                   <div class="plan-month"></div>
                               </div>
                               <div class="plan-tag bg-themesecondary">
                                   <i class="tag-icon fa fa-times"></i>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
    </div>
</div>

</div>
</template>

<script>
import * as ajaxUtil from '../util/Ajax.js'
export default {
  data () {
	  var item = {
		  total_app:0,
        total_user_attentioin:0,
        total_customer:0,
        total_potention_customer:0,
        add_bind_app:0,
        add_user_attention:0,
        cancel_user_attention:0,
        add_bind_customer:0};
    return {
        item:item
    }
  },
   ready () {
    this.updateData();
  },
  methods: {
    
    updateData () {
      let params = {};
     
      var url = Url.INDEX_STATIC;
     
      ajaxUtil.doGet(url,params).then((xhr,response) =>{
		    if(response.status != 200){
			    return ajaxUtil.doError(response,this);
		    }
		    let content = ajaxUtil.decodeContent(response.content);
            console.log(content)
	        this.item = JSON.parse(content);
           
       })

  }
    }
}
</script>
