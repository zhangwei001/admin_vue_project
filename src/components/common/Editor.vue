<template>
	<script id="container"></script>
	<div style="display:none" v-el:temp>
</template>
<script>

	export default {
		props: {
			content: {
              type: String
            },
			text:{
				type:String
			},
            initcontent:{
	            type:String
            }
    },
		beforeCompile(){
			var ue = UE.getEditor('container');
		    
			 if(typeof(ue.container) != 'undefined') {
			 	//UE.delEditor("container");
				  UE.getEditor('container').destroy();
			}
		},
        ready () {
			var ue = UE.getEditor('container');
			
			var ue = UE.getEditor('container');
			var self = this;
			
			ue.ready(function() {

			
				ue.addListener("contentChange", function(editor){
					//self.content = UE.utils.unhtml(ue.getContent());
					self.content = ue.getContent();
					console.log("result content"+self.content);
					self.text = ue.getContentTxt();
					//var txt = um.getContentTxt();
				})

           });
           
        },
		methods:{
			unescape(val){
				return val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
			}
		},
        watch:{
	        initcontent(){

		        var ue = UE.getEditor('container');

		        if(this.initcontent != null && typeof(ue.container) != 'undefined' ){
					var self = this;
					self.$els.temp.innerHTML = self.unescape(self.initcontent);
					self.content = self.$els.temp.outerHTML;
							ue.ready(function() {
						ue.setContent(self.$els.temp.outerHTML);
					})
		        }
	        }
        }
        
	}
</script>