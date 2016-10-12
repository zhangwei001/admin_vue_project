<template>
        <form @keyup.enter="login()">
		<div class="login-container animated fadeInDown">
            <div class="loginbox bg-white">
                <div class="loginbox-title">微信后台管理系统</div>
                <div class="loginbox-social">
                    <div class="social-title ">登录</div>

                </div>
                <div class="loginbox-social" v-if="error != null">
                   {{error}}

                </div>
                <div class="loginbox-or">
                    <div class="or-line" ></div>
                </div>
                <div class="loginbox-textbox">
                    <input type="text" class="form-control"  v-model="login_name" placeholder="用户名" />
                </div>
                <div class="loginbox-textbox">
                    <input type="password" class="form-control" placeholder="密码" v-model="password"/>
                </div>
                <div class="loginbox-forgot">
                    <a href="">忘记密码?</a>
                </div>
                <div class="loginbox-submit">
                    <input type="button" class="btn btn-primary btn-block" value="登录"  @click="login()">
                </div>

            </div>
            <div class="logobox">
            </div>
        </div>
        </form>
</template>

<script>
import * as ajaxUtil from '../util/Ajax.js'
var store = require('store')
export default {
  data () {
    return {
    
      login_name: "",
      password:"",
        error:null,
    }
  },
  ready () {
  },
  methods :{
	  login() {
		  var params = {login_name:this.login_name,"password":this.password};
		    console.log(params);
		    var url = Url.LOGIN;
		     ajaxUtil.doGet(url,params).then((xhr,response) =>{
			   if(response.status != 200){
                    this.error="用户名或密码错误";
				    return ajaxUtil.doError(response);
			   }else{
				   var obj = ajaxUtil.decodeContent(response.content);
				   store.remove('user');
				  store.set('user',JSON.parse(obj));
			      this.$router.go({"path":"/index"});
		       }
		    })
	  }
  }
}
</script>