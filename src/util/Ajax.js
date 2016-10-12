
import qwest from 'qwest'
import libbase64 from 'libbase64'
var store = require('store')
export function decodeContent(content){
	return  libbase64.decode(content).toString("UTF-8");
	
}

export function doGet(url,params){    
	var user = store.get("user");


	var config={cache:true};
	if(params == null){
		params = {};
	}
	 if(user != null ){
	   params.access_token = user.access_token;
		 config={cache:true,headers:{'rmKey':user.rm_key}}
	  
    }
    return qwest.get(url,params,config);
}
export function doPost(url,params){
	var user = store.get("user");
	var config={cache:true};
	if(params == null){
		params = {};
	}
	if(user != null){
	   params.access_token = user.access_token;
	   config={cache:true,headers:{'rmKey':user.rm_key}}
	  
    }
	
	/*qwest.setDefaultOptions({
	    dataType: 'arraybuffer',
	    responseType: 'json',
	});*/
	return qwest.post(url,params,config);
}

export function doError(obj,self){
	if(obj.status == 5){
		store.remove('user');
        self.$router.go({"path":"/login"});
	}
	if(obj.status == 400){
		return "系统异常";
	}
}

