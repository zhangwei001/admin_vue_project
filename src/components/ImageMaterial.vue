<template>
    <div class="page-header position-relative">
                    <div class="header-title">
                        <h1>
                            图片库

                        </h1>
                    </div>
     </div>
     <div class="page-body">
        <div class="row">
		    <div class="col-xs-12 col-md-12">

		        <div class="widget">
			        <a class="btn btn-primary" @click="showUpload=true">上传图片</a>
			    </div>
			</div>
		</div>
		<div class="row">
        <!--class :v-on:load="resizeImg(item,$event)"-->
		    <!--<div class="col-xs-12 col-md-12">
              
                        <div v-for="item in items" class="col-xs-2">
                           <a>
                           
                                <img  :src="item.image_url"  class="thumbnail " width="250" height="250">
                                <span class="icon"></span>
                            </a>
                           
                        </div>
                        
                   
                </div>-->
                
                <div class="group img_pick ">
                        <ul class="group">

                            <li class="img_item js_imgitem" v-for="item in items">
                                <div class="img_item_bd">
                                    <img class="pic wxmImg Zoomin" :src="item.image_url">
                                    
                                </div>
                                <div class="msg_card_ft">
                                    
                                    <ul class="grid_line msg_card_opr_list">
                                        <form role="form">
                                     <!--   <li class="grid_item size1of3 msg_card_opr_item form-group">
                                             <label ><input type="checkbox"  class="form-control"><span class="lbl_content"></span></label>
                                        </li>-->
                                        <li class="grid_item size1of3 msg_card_opr_item">
                                            <a class="js_edit js_tooltip js_popover" >
                                                               
                                                    <i class="glyphicon glyphicon-edit "></i>
                                               
                                                <span class="vm_box"></span>
                                            </a>
                                        </li>

                                        <li class="grid_item size1of3 no_extra msg_card_opr_item">
                                            <a class="js_del js_tooltip js_popover"  data-tooltip="删除" @click="alertDel(item.id)">
                                                <i class="glyphicon glyphicon-trash"></i>
                                                <span class="vm_box"></span>
                                            </a>
                                        </li>
                                        </form>
                                    </ul>
                                </div>
                            </li>
                            
                            
                        </ul>
                   </div>
          </div>
        <div class="row">
                            <pagination v-if="totalPage>1" :page-per-rows="rows" :total-page="totalPage" :cur-page.sync="curPage" :total-row="totalRows"></pagination>
                        </div>
     </div>
     <modal :show.sync="showUpload" title="上传图片">
            <div class="modal-body" slot="modal-body">
                    <vue-file-upload :url = "uploadUrl"  v-bind:files.sync = 'files' v-bind:filters = "filters" v-bind:events = 'cbEvents' :multiple="true" v-bind:request-options = "reqopts"></vue-file-upload>
                                    
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th> 文件名</th>
                            <th> 大小</th>
                            <th> 进度</th>
                            <th> 状态</th>
                    </tr>
                    <thead>
                    <tbody>
                        <tr v-for="file in files">
                            <td v-text="file.name"></td>
                            <td v-text="file.size"></td>
                            <td v-text="file.progress"></td>
                            <td v-text="onStatus(file)"></td>
                        </tr>
                    </tbody>
                </table>
                </div>      
                <div class="modal-footer" slot="modal-footer">
                    <a class="btn btn-default"  @click="showUpload=false">取消</a>
                        <a class="btn btn-default"  @click="uploadAll()">开始上传</a>
                         <a class="btn btn-default"  @click="closeUpload()">关闭</a>
                </div>
     </modal>
     
      <modal :show.sync="showDel" title="撤回选择">
                            <div class="modal-body" slot="modal-body">
                                确定要删除图片吗？
                            </div>
                            <div class="modal-footer" slot="modal-footer">
                                <a class="btn btn-default"  @click="showDel=false">取消</a>
                                 <a class="btn btn-default"  @click="delImage()">确定</a>
                            </div>
     </modal>
</template>
<script>
import * as ajaxUtil from '../util/Ajax.js'
import modal from './common/Modal.vue'
import VueFileUpload from 'vue-file-upload'
import pagination from './common/Pagination.vue'

    export default{
        data(){
            return{
                uploadUrl:UPLOAD_URL,
                imageId:-1,
                showDel:false,
                items:[],
                curPage:1,
                rows:20,
                totalPage:0,
                totalRows:0,
                showUpload:false,
                
                files:[],
                //文件过滤器，只能上传图片
                filters:[
                    {
                    name:"imageFilter",
                    fn(file){
                        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                    }
                ],
            //回调函数绑定
            cbEvents:{
                onCompleteUpload:(file,response,status,header)=>{
                    console.log(response.data.id);
                    let url = Url.ADD_IMAGE;
                    let params = {}
                    params.file_id = response.data.id
                    ajaxUtil.doPost(url,params).then((xhr,response) =>{
                        if(response.status != 200){
                            return ajaxUtil.doError(response,this);
                        }
                    })
                    console.log("finish upload;")
                }
            },
        //xhr请求附带参数
        reqopts:{
            formData:{
            sysid:'26'
            },
            responseType:'json',
            withCredentials:false
        }
    }
            
        },
        components: {
	       modal,
           VueFileUpload,
           pagination
       },
        compiled(){
            this.updateData();
            
           
        },
         methods: {
    
            updateData () {  
               
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
                    for(var i =0;i<items.length;i++){
                         var item = items[i];
                         item.width=250;
                         item.height=300;
                         item.marginLeft = '0px';
                         item.marginTop = '0px';
                    }
                    this.items = items;
                    this.totalRows = response.totalCount;
                    if(response.totalCount%this.rows == 0){
                        this.totalPage = Math.floor(response.totalCount/this.rows) ;
                    }else{
                        this.totalPage = Math.floor(response.totalCount/this.rows) +1;
                    }
                })
            },
            resizeImg(item,event){
                 var objImg = event.target;
                this.scale(objImg,  250, 250,item)
                console.log(item.file_id)
            },
            
            scale(img, w, h,item){
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
            
            onStatus(file){
                if(file.isSuccess){
                    return "上传成功";
                }else if(file.isError){
                    return "上传失败";
                }else if(file.isUploading){
                    return "正在上传";
                }else{
                    return "待上传";
                }
              },
            uploadAll(){
            //上传所有文件
            this.$broadcast('DO_POST_FILE');
            
            },
            closeUpload(){
                this.showUpload=false;
                this.updateData();
            },
            alertDel(id){
                this.showDel = true;
                this.imageId = id;
            },
            delImage(){
                var url = Url.DEL_IMAGE+"/"+this.imageId;  
                let params={};
                ajaxUtil.doPost(url,params).then((xhr,response) =>{
                        if(response.status != 200){
                            return ajaxUtil.doError(response,this);
                        }
                        this.showDel = false;
                           this.updateData();
                    })
            }
         },
         watch:{
            curPage () {
            this.updateData()
            }
         }
    }
</script>
<style>
 .img_pick {
    margin-right: -45px;
}
.img_pick {
    padding: 20px;
}
.group {
}

div {
    display: block;
}
ul{
   
    padding-left: 0;
    list-style-type: none;
    display: block;
    list-style-type: disc;
    -webkit-margin-before: 1em;
    -webkit-margin-after: 1em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 40px;
     
}

.img_pick .img_item {
    margin-bottom: 20px;
    margin-right: 15px;
    border: 1px solid #e7e7eb;
}
.img_pick .img_item {
    float: left;
    text-align: center;
}
li {
    display: list-item;
    text-align: -webkit-match-parent;
     list-style-type: none;
}


.img_pick_panel .img_pick .img_item .pic {
    width: 169px;
    height: 169px;
}

.img_pick .img_item .pic {
    display: block;
    border-bottom: 1px solid #e7e7eb;
}

.msg_card_opr_list {
  
}

.msg_card_opr_item a {
    display: block;
}

 .img_pick .img_item .pic {
    width: 169px;
    height: 169px;
}
.img_pick .img_item .pic {
    display: block;
    border-bottom: 1px solid #e7e7eb;
}

#upload .filelist li p.imgWrap {
    position: relative;
    z-index: 2;
    line-height: 113px;
    vertical-align: middle;
    overflow: hidden;
    width: 113px;
    height: 113px;

    -webkit-transform-origin: 50% 50%;
    -moz-transform-origin: 50% 50%;
    -o-transform-origin: 50% 50%;
    -ms-transform-origin: 50% 50%;
    transform-origin: 50% 50%;

    -webit-transition: 200ms ease-out;
    -moz-transition: 200ms ease-out;
    -o-transition: 200ms ease-out;
    -ms-transition: 200ms ease-out;
    transition: 200ms ease-out;
}

.msg_card_ft {
    background-color: #f4f5f9;
    border-top: 1px solid #e7e7eb;
}


.msg_card_opr_item {
    text-align: center;
}

.size1of3 {
    width: 33.33%;
}
.grid_item {
    float: left;
}

a {
    color: #459ae9;
    text-decoration: none;
}

 .img_pick .msg_card_opr_item_inner {
    border: 0;
    margin: 5px 0;
}
.msg_card_opr_item:first-child .msg_card_opr_item_inner {
    border-left-width: 0;
}
.msg_card_opr_item_inner {
    display: inline-block;
    vertical-align: top;
    width: 98.5%;
    margin: 13px 0;
    line-height: 18px;
    height: 18px;
    cursor: pointer;
    border-left: 1px solid #e7e7eb;
}

.icon18_common {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    display: inline-block;
    line-height: 100px;
    overflow: hidden;
}
#upload .filelist li img {
    width: 100%;
}

#upload .filelist li p.error {
    background: #f43838;
    color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 28px;
    line-height: 28px;
    width: 100%;
    z-index: 100;
    display:none;
}

#upload .filelist li .success {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 40px;
    width: 100%;
    z-index: 200;
   
}

#upload .filelist li.filePickerBlock {
    width: 113px;
    height: 113px;
    border: 1px solid #eeeeee;
    border-radius: 0;
}
#upload .filelist li.filePickerBlock div.webuploader-pick  {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;
    background: none;
    font-size: 0;
}

#upload .filelist div.file-panel {
    position: absolute;
    height: 0;
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#80000000', endColorstr='#80000000') \0;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 300;
}

#upload .filelist div.file-panel span {
    width: 24px;
    height: 24px;
    display: inline;
    float: right;
    text-indent: -9999px;
    overflow: hidden;
 
    margin: 5px 1px 1px;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#upload .filelist div.file-panel span.rotateLeft {
    display:none;
    background-position: 0 -24px;
}

#upload .filelist div.file-panel span.rotateLeft:hover {
    background-position: 0 0;
}

#upload .filelist div.file-panel span.rotateRight {
    display:none;
    background-position: -24px -24px;
}

#upload .filelist div.file-panel span.rotateRight:hover {
    background-position: -24px 0;
}

#upload .filelist div.file-panel span.cancel {
    background-position: -48px -24px;
}

#upload .filelist div.file-panel span.cancel:hover {
    background-position: -48px 0;
}

#upload .statusBar {
    height: 45px;
    border-bottom: 1px solid #dadada;
    margin: 0 10px;
    padding: 0;
    line-height: 45px;
    vertical-align: middle;
    position: relative;
}

#upload .statusBar .progress {
    border: 1px solid #1483d8;
    width: 198px;
    background: #fff;
    height: 18px;
    position: absolute;
    top: 12px;
    display: none;
    text-align: center;
    line-height: 18px;
    color: #6dbfff;
    margin: 0 10px 0 0;
}
#upload .statusBar .progress span.percentage {
    width: 0;
    height: 100%;
    left: 0;
    top: 0;
    background: #1483d8;
    position: absolute;
}
#upload .statusBar .progress span.text {
    position: relative;
    z-index: 10;
}

#upload .statusBar .info {
    display: inline-block;
    font-size: 14px;
    color: #666666;
}

#upload .statusBar .btns {
    position: absolute;
    top: 7px;
    right: 0;
    line-height: 30px;
}

#filePickerBtn {
    display: inline-block;
    float: left;
}
#upload .statusBar .btns .webuploader-pick,
#upload .statusBar .btns .uploadBtn,
#upload .statusBar .btns .uploadBtn.state-uploading,
#upload .statusBar .btns .uploadBtn.state-paused {
    background: #ffffff;
    border: 1px solid #cfcfcf;
    color: #565656;
    padding: 0 18px;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
    float: left;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
#upload .statusBar .btns .webuploader-pick-hover,
#upload .statusBar .btns .uploadBtn:hover,
#upload .statusBar .btns .uploadBtn.state-uploading:hover,
#upload .statusBar .btns .uploadBtn.state-paused:hover {
    background: #f0f0f0;
}

#upload .statusBar .btns .uploadBtn,
#upload .statusBar .btns .uploadBtn.state-paused{
    background: #00b7ee;
    color: #fff;
    border-color: transparent;
}
#upload .statusBar .btns .uploadBtn:hover,
#upload .statusBar .btns .uploadBtn.state-paused:hover{
    background: #00a2d4;
}

#upload .statusBar .btns .uploadBtn.disabled {
    pointer-events: none;
    filter:alpha(opacity=60);
    -moz-opacity:0.6;
    -khtml-opacity: 0.6;
    opacity: 0.6;
}
</style>