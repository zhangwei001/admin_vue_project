<template>
<div class="navbar">
    <div class="navbar-inner">
        <div class="navbar-container">
            <!-- Navbar Barnd -->
            <div class="navbar-header pull-left">
                <a href="#" class="navbar-brand">
                    <small>
                        <img src="../../resources/img/logo.png"></img>
                    </small>
                </a>
            </div>
            <!-- /Navbar Barnd -->

            <!-- Sidebar Collapse -->
            <div class="sidebar-collapse" id="sidebar-collapse" :class="{active:menucompact==true}">
                <i class="collapse-icon fa fa-bars" @click="toggle()"></i>
            </div>
            <!-- /Sidebar Collapse -->
            <!-- Account Area and Settings -->
            <div class="navbar-header pull-right">
                <div class="navbar-account">
                    <div class="setting">
                        <a id="logOut" title="logOut"  @click="logout">
                            <i class="icon glyphicon glyphicon-log-out"></i>
                        </a>
                    </div>
                    <div class="setting-container">
                    <label>
                        <input type="checkbox" id="checkbox_fixednavbar">
                        <span class="text">Fixed Navbar</span>
                    </label>
                    <label>
                        <input type="checkbox" id="checkbox_fixedsidebar">
                        <span class="text">Fixed SideBar</span>
                    </label>
                    <label>
                        <input type="checkbox" id="checkbox_fixedbreadcrumbs">
                        <span class="text">Fixed BreadCrumbs</span>
                    </label>
                    <label>
                        <input type="checkbox" id="checkbox_fixedheader">
                        <span class="text">Fixed Header</span>
                    </label>
                </div>
                    <!-- Settings -->
                </div>
            </div>
            <!-- /Account Area and Settings -->
        </div>
    </div>
</div>
<div class="main-container container-fluid">
    <!-- Page Container -->
    <div class="page-container">
        <!-- Page Sidebar -->
        <div class="page-sidebar" id="sidebar" :class="{'menu-compact hiden-menu':menucompact==true,'hide':hide==true}">
            <!-- Page Sidebar Header-->
            <!-- Sidebar Menu -->

		   <Menu v-for="function in functions" :func="function" :menuindex.sync="activeIndex" :itemindex.sync="itemIndex" :user="user">
                </Menu>

        </div>
        <!-- Page Sidebar -->

        <div class="page-content">

                 <router-view></router-view>
        </div>
    </div>


    
 </div>   
</template>

<script>
import Menu from './Menu.vue'
import * as ajaxUtil from '../util/Ajax.js'
var store = require('store')
export default {
  data () {
    return {
      functions: [],
      activeIndex: -1,
      itemIndex:-1,
        menucompact:false
    }
  },
   props:{
    user: {
       type: String
    }
  },
  components: {
    'Menu': Menu
  },
  ready () {
    var user = store.get("user");
    if(user != null){
       var params = {user_id:user.user_id};
    }
    console.log(params);
    var url = Url.MENU;
     ajaxUtil.doGet(url,params).then((xhr,response) =>{
	     
	   if(response.status != 200){
		    return ajaxUtil.doError(response,this);
	   }
	    let content = ajaxUtil.decodeContent(response.content);

        this.functions = JSON.parse(content);
        var head = {"id":-1,"path":"/index","label":"首页","isLeaf":0};
        this.functions.unshift(head);
        
    })
	
   	
   	
  },
  methods :{
	  logout(){
		store.remove("user");
		this.$router.go({"path":"/login"});
	  },
      toggle(){
          this.menucompact = !this.menucompact;

      }
  },
  computed:{
      hide(){
          if(screen.width<600 && this.menucompact){
              return true;
          }
          return false;
      }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
    .hiden-menu{display: none}
</style>
