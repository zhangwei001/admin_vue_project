var store = require('store')
export function configRouter (router) {
  // normal routes
    router.map({
	     "/login":{
		    name:"login",
		    component:require('./components/Login.vue'),
	    },
	    "/":{
		       component: require('./components/Main.vue'),
		       subRoutes: {
					    '/': {
	                        component: require('./components/Index.vue')
	                    },
						 "/static/total/data":{
								   name:'dataList',
								   component: require('./components/DataList.vue'),
							    },
					    "/static/app/data":{
						   name:'appList',
						   component: require('./components/AppList.vue'),
					    },
					    "/static/app/detail":{
						   name:'appDetail',
						   component: require('./components/AppDetail.vue'),
					    },
					     "/static/custom/list":{
						   name:'customList',
						   component: require('./components/CustomList.vue'),
					    },
					     "/menu/config":{
						   name:'menuConfig',
						   component: require('./components/menuConfig.vue'),
					    },
					    "/comment/list":{
					    	name:'commentList',
							component: require('./components/Comment.vue'),
					    },
				   		"/server/idea/feedback":{
							name:"serverComment",
							component:require("./components/serverComment.vue"),
						},
				   		"/shops/qrcode":{
							name:"qrcode",
							component: require("./components/shopsQrcode.vue"),
						},
				   		"/download/shopsQRcode":{
							name:"downloadQrcode",
							component: require("./components/downloadShopsQrcode.vue"),
						},
					    "/unexport/material":{
					    	name:'unexportMaterial',
							 component: require('./components/UnExportMaterial.vue'),
					    },
					    "/export/material":{
					    	name:'exportMaterial',
							 component: require('./components/ExportMaterial.vue'),
					    },
					    "/material/add":{
					    	 name:'addMaterial',
							 component: require('./components/AddMaterial.vue'),
					    },
						 "/image/list":{
					    	 name:'imageMaterial',
							 component: require('./components/ImageMaterial.vue'),
					    },
					    "/index":{
						      component: require('./components/Index.vue')
					    }
					 
		        }
		        
	    },   
	   '*': {
	          component: require('./components/Index.vue')
	     }

    
  })

	router.beforeEach(function (transition) {
           
		     if(store.get('user') == null){
			     router.go({"path":"/login",append: false});
			       transition.next();
		     }else{
		        transition.next();
	     }
	      
	  
	       
	  
	})
}
