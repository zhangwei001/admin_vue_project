<template>
     <div id="online" class="panel focus">
         <div id="imageList" v-on:scroll="scrollImage($event)">
              <ul class="list">
                    <li v-for="item in items" :class="{'selected':imageId == item.id}" @click="selectImage(item)">
                       <img  :src="item.image_url" v-on:load="resizeImg(item,$event)" >
                       <span class="icon"></span>
                    </li>
                    </ul>
         </div>
     </div>
     <div>

     </div>
</template>
<script>
 import * as ajaxUtil from '../util/Ajax.js'
	import pagination from './common/Pagination.vue'
    export default{
        data(){
			return{
				items:[],
                curPage:1,
                rows:20,
                totalPage:0,
                imageId:-1,
                selectItem:null,
			}
		},
        components:{
            pagination
        },
		props:{
		    selectItem:{
                type:Object,
                default:null
            }
		
        },
        ready(){
                console.log('load image')
                this.updateData();
        },
         methods: {
    
            updateData () {  
               console.log('get image')
                let params = {};
                params.page = this.curPage;
                params.rows = this.rows;
                
                var url = Url.MATERIAL_LIST;  
                var self = this;
                ajaxUtil.doGet(url,params).then((xhr,response) =>{
                    if(response.status != 200){
                        return ajaxUtil.doError(response,this);
                    }
                    let content = ajaxUtil.decodeContent(response.content);
                    let items = JSON.parse(content);
                    for(var i =0 ;i<items.length;i++){
                       this.items.push(items[i]);
                    }
                    this.curPage = this.curPage + 1;
                })
            },
            scrollImage(event){
                var panel = event.target;
             
                 if (panel.scrollHeight - (panel.offsetHeight + panel.scrollTop) < 10) {
                     this.updateData();
                 }
            },
            resizeImg(item,event){
                 var objImg = event.target;
                this.scale(objImg,  113,113)
                console.log(item.file_id)
            },
            
            scale(img, w, h){
               var ow = img.width,
                oh = img.height;

                if (ow >= oh) {
                    
                     img.width = w * ow / oh;
                     img.height = h;
                     img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                    
                  
                } else {
                     img.width = w;
                     img.height = h * oh / ow;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                    
                    
                }
            
            },
             selectImage(item){
                console.log('select')
                this.imageId = item.id;
                this.selectItem = item;
            }
      },
      watch:{
            curPage () {
             //   this.updateData()
            }
      }
    }
</script>
<style>
   /* 图片管理样式 */
#online {
    width: 100%;
    height: 336px;
    padding: 10px 0 0 0;
}
#online #imageList{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
}
#online ul {
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
}
#online li {
    float: left;
    display: block;
    list-style: none;
    padding: 0;
    width: 113px;
    height: 113px;
    margin: 0 0 9px 9px;
    *margin: 0 0 6px 6px;
    background-color: #eee;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}
#online li.clearFloat {
    float: none;
    clear: both;
    display: block;
    width:0;
    height:0;
    margin: 0;
    padding: 0;
}
#online li img {
    cursor: pointer;
}
#online li .icon {
    cursor: pointer;
    width: 113px;
    height: 113px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    border: 0;
    background-repeat: no-repeat;
}
#online li .icon:hover {
    width: 113px;
    height: 113px;
    border: 3px solid #1094fa;
}
#online li.selected .icon {
    background-image: url(../../resources/img/success.png);
    background-image: url(../../resources/img/success.gif)\9;
    background-position: 75px 75px;
}
#online li.selected .icon:hover {
    width: 113px;
    height:113px;
    border: 3px solid #1094fa;
    background-position: 72px 72px;
}

</style>