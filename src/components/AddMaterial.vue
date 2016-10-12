<template>
	 <div class="page-header position-relative">
                        <div class="header-title">
                            <h1>
                                素材编辑  
                            </h1>
                        </div>
    </div>
    <div class="page-body">
		<div class="row">
		    <div class="col-xs-12 col-md-12">

		        <div class="widget">
                    <div class="widget-header bordered-bottom bordered-pink">
                        <span class="widget-caption">编辑内容</span>
                    </div>
                    <div class="widget-body">
                    
                        <div class="row">
                           
                           
                            <div class="col-xs-12 col-md-6">
                                 <a v-link="{ path: '/unexport/material'}" class="btn btn-blue">草稿箱</a>
                              </div>
	                           <div class="col-xs-12 col-md-6">
                                 <button type="button" class="btn btn-blue" @click="showTagRel=true" v-if="id == null">从美丽秘籍导入</button>
                              </div>
                        </div>
                        <div class="row">
                        <div class="col-xs-12 col-md-12">
	                     <validator name="validation">
                        <form role="form"   novalidate >

	                         <div class="form-group"  :class="{'has-error':$validation.type.required}">
                                <label for="type">素材类型</label>
                                <label>
	                                <input type="radio" class="form-control"   value="0" v-model="type"  v-validate:type="{required: true}">
		                            <span class="text">A类</span>
	                            </label>  
	                            <label>
	                                <input type="radio" class="form-control"  value="1" v-model="type"  v-validate:type="{required: true}">
		                            <span class="text">B类</span>
	                            </label> 
	                            <label>
	                                <input type="radio" class="form-control"  value="2" v-model="type"  v-validate:type="{required: true}">
		                            <span class="text">C类</span>
	                            </label> 
	                            <label>
	                                <input type="radio" class="form-control"  value="3" v-model="type"  v-validate:type="{required: true}">
		                            <span class="text">D类</span>
	                            </label>
                                 <p  v-if="$validation.type.required" class="bg-warning" >请选择素材类型</p>

                             </div>
                            <div class="form-group " :class="{'has-error':$validation.title.required}">
                              
                                <input type="text" class="form-control" id="title"   maxlength="64" placeholder="请输入标题(必填，不超过64字)" v-model="title" v-validate:title="{required: true, maxlength: 64}">
                                <p  v-if="$validation.title.required" class="bg-warning"  >标题未填写</p>
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" id="author" placeholder="请输入作者（可不填）" v-model="author">
                            </div>
                            <div class="form-group" :class="{'has-error':$validation.hrefurl.url}">
                                <label for="hrefurl">原文链接</label>
                                <input type="text" class="form-control" id="hrefurl" placeholder="原文链接（可不填）" v-model="contentSourceUrl" v-validate:hrefurl="['url']">
                                 <p data-bv-validator="stringLength" v-if="$validation.hrefurl.url" class="bg-danger" style="display: block;">链接地址有误</p>

                            </div>
                             <div class="form-group">
                                   <a class="btn btn-blue" @click="showImage=true">选择图片</a>
                                  <label for="imageShow" class="btn btn-blue">上传封面</label>
                                 <form enctype="multipart/form-data">
                                       <input id="imageShow" type="file"  class="inputfile" v-on:change="uploadItem()" v-el:file accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">
                                  </form>
                                 <img :src="imageFile" width="100" height="100" v-if="imageFile !=null">
                               
                                    <label>
                                        <input type="checkbox"  v-model="showCoverPic">
                                        <span class="text">封面是否显示在正文中</span>
                                    </label>
                            <p  v-if="imageError == false" class="bg-warning" style="display: block;" >图片必须上传</p>

                        </div>
                             <div class="form-group" :class="{'has-error':$validation.description.maxlength}">
                                <textarea class="form-control" id="description" maxlength="54" rows="5" placeholder="从这里开始摘要...（可不填，低于54）" v-model="description"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="editor">正文</label>
                                <editor :content.sync="content" :initcontent="initcontent" :text.sync="text"></editor>
                                <small  v-if="contentError" class="help-block" style="display: block;">请填写正文内容</small>

                            </div>
                            <button type="submit" class="btn btn-blue" @click="saveMaterial" v-if="$validation.valid">保存</button> &nbsp;&nbsp;
                            <button type="submit" class="btn btn-blue" @click="saveExport" v-if="$validation.valid">保存并发布</button>&nbsp;&nbsp;
                            <button type="submit" class="btn btn-blue" @click="cancel">清除</button>
                        </form>
                    </validator>
                    </div>
                    </div>
	                </div>
                </div>
            </div>
        </div>
     </div>

      <modal :show.sync="showExport" title="请选择发布对象" width="1000px"> 										  
           <exportchoose slot="modal-body" :tag-list.sync="tagList" :shop-list.sync="shopList" :tmpl-id.sync="id"></exportchoose>
        
        <div slot="modal-footer" class="modal-footer">
            <a class="btn btn-sky" :class="{'disabled':tagList.length ==0 && shopList.length ==0}" @click="exportMaterial()">发布</a>
        </div>
	</modal>


     <modal :show.sync="showTagRel" title="导入美丽秘籍" width="1000px"> 										  
           <div slot="modal-body" >
                  <tag-rels :tag-id.sync="tagId"></tag-rels>
           </div>
        
        <div slot="modal-footer" class="modal-footer">
            <a class="btn btn-sky" @click="importMaterial()">导入</a>
        </div>
	</modal>
    
    <modal :show.sync="showImage" title="图片库" width="650px">
        <imagechoose slot="modal-body" :select-item.sync="imageItem"></imagechoose>
        <div slot="modal-footer" class="modal-footer">
          <a class="btn btn-sky" @click="selectImage()">选择</a>
         </div>
    </modal>
</template>
<script>
    import * as ajaxUtil from '../util/Ajax.js'
	import editor from './common/Editor.vue'
    import qwest from 'qwest'
    import exportchoose from './ExportChoose.vue'
    import modal from './common/Modal.vue'
    import tagRels from './TagRels.vue'
    import imagechoose from './ImageChoose.vue'
	export default {
		components: {
		    editor,
		    modal,
            exportchoose,
            tagRels,
            imagechoose
        },
        validators: { 
            // `numeric` and `url` custom validator is local registratior
            url: function (val) {
                    console.log(val)
                    if(val == ''){
                       return true;
                    }
                       else{
                           console.log(/^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val))
                            return /^(http\:\/\/|https\:\/\/)(.{4,})$/.test(val)
                       }
                
                 }
        },
        data(){
            return{
                imageFile:null,
                type:-1,
                initcontent:null,
                content:null,
                title:"",
                author:"",
                contentSourceUrl:"",
                showCoverPic:0,
                description:"",
                coverFileId:null,
                materialId:null,
                showExport:false,
                tagList:[],
                shopList:[],
                showTagRel:false,
                tagId:-1,
                showImage:false,
                imageItem:null,
                contentError:null,
                text:null,
            }
        },
        route: {
		    data ({to,next}) {
			   
		    
		    }
         },
        ready () {
			this.materialId = this.$route.query.id;
			if(this.materialId != null){
				this.getMaterialData(this.materialId);
			}
        },
        methods:{
            cancel(){
                this.title = null;
                this.content= null;

                this.description=  null;
                this.coverFileId =  null;
                this.imageFile =  null;
                this.initcontent =  null;
                this.type = -1;
                this.showCoverPic=0;
                this.contentSourceUrl=null;
                this.author=null;
            },
            uploadItem(){
                var url = UPLOAD_URL;
                console.log(this.url)
                var oData =  new FormData(this.$els.file);
                oData.append("files[]",this.$els.file.files[0]);
                oData.append("sysid","26");
                oData.append("gen_thumb","true");
                oData.append("water_mark","true");
                oData.append("thumb_width","400");
                oData.append("thumb_height","400");
                oData.append("width","1024")
               
                qwest.post(url,oData,{cache:true}).then((xhr,response) => {
                  
                    var obj = JSON.parse(response)
                     this.coverFileId = obj.data.id
                     this.imageFile = imgDownLoadUrl +"/"+ obj.data.id;
                     let url = Url.ADD_IMAGE;
                    let params = {}
                    params.file_id =  this.coverFileId 
                    ajaxUtil.doPost(url,params).then((xhr,response) =>{
                        if(response.status != 200){
                            return ajaxUtil.doError(response,this);
                        }

                    })
                });
            },
            saveMaterial(e){

	             var self = this;
                if(this.coverFileId == null){

                    this.imageError="请上传图片";
                   return;
                }
                if(this.content == null){
                    this.contentError = "请填写正文";
                    return;
                }

	            if(this.showCoverPic == true){
		            this.showCoverPic=1;
	            }else{
		            this.showCoverPic=0;
	            }
                if(this.description == null || this.description.length < 1){
                    this.description = this.text.substr(0,54);
                }
	            let params={};
	            params.type = this.type;
	            params.title= this.title;
	            params.content = this.content;
	            params.author = this.author;
	            params.description = this.description;
	            params.content_source_url = this.contentSourceUrl;
	            params.show_cover_pic =this.showCoverPic;
	            params.cover_file_id = this.coverFileId;
	            var url  = null;
	            if(this.materialId == null){
	               url = Url.ADD_MATERIAL;
                }else{
	                url = Url.UPDATE_MATERIAL +"/"+this.materialId;
                }
	            console.log(url);
	            ajaxUtil.doPost(url,params).then((xhr,response) => {
                    if(response.status == 200){
	                     self.$router.go({"path":"/unexport/material",query: { id: response.content,type:this.type },append: true});
	                     this.id = Number(response.content)
                    }
                });
            },
            getMaterialData(id){
	             var url = Url.MATERIAL_INFO+"/"+id;
	             let params={};
	            ajaxUtil.doGet(url,params).then((xhr,response) => {
                    if(response.status != 200)
			          {
			              return ajaxUtil.doError(response, this);
			          }
                    let content = ajaxUtil.decodeContent(response.content);
                    let item = JSON.parse(content);
                    this.type=item.type;
                    this.title = item.title;
                    this.content=item.content;
                    this.author = item.author;
                    this.description= item.description;
                    this.contentSourceUrl= item.content_source_url;
                    this.showCoverPic=item.show_cover_pic;
                    this.coverFileId = item.cover_file_id;
                    this.author = item.author;
                    this.imageFile = item.cover_url;
                    this.initcontent = item.content;

                    
                });
            },
            saveExport(){
                if(this.coverFileId == null){

                    this.imageError="请上传图片";
                    return;
                }
                if(this.content == null){
                    this.contentError = "请填写正文";
                    return;
                }

	            var self = this;
	            if(this.showCoverPic == true){
		            this.showCoverPic=1;
	            }else{
		            this.showCoverPic=0;
	            }
	            let params={};
	            params.type = this.type;
	            params.title= this.title;
	            params.content = this.content;
	            params.author = this.author;
	            params.description = this.description;
	            params.content_source_url = this.contentSourceUrl;
	            params.show_cover_pic =this.showCoverPic;
	            params.cover_file_id = this.coverFileId;
	            params.author = this.author;
	            var url  = null;
                console.log("this.id="+this.id)

                if(this.materialId == null){
	               url = Url.ADD_MATERIAL;
                }else{
	                url = Url.UPDATE_MATERIAL +"/"+this.materialId;
                }
	            console.log(url);
	            ajaxUtil.doPost(url,params).then((xhr,response) => {
                    if(response.status == 200){
                        if( this.materialId == null) {
                            this.materialId = Number(response.content)
                        }
	                      this.showExport = true;
                    }
                });
	           
            },
            exportMaterial(){
		        var self = this;
				let params={};
				//params.tag_list = this.tagList;
				params.shop_list = this.shopList;
				params.tag_list = this.tagList;
			   var url = Url.EXPORT_MATERIAL+"/"+this.materialId;
			  ajaxUtil.doPost(url,params).then((xhr,response) => {
	          if(response.status != 200)
	          {
	              return ajaxUtil.doError(response, this);
	          }else{
		          alert("发布成功");
		          self.$router.go({"path":"/export/material",query: { id: this.materialId,type:this.type },append: true});
	          }
			   
			         
             });   
	      },
          importMaterial(){
               var url = Url.TAG_INFO+"/"+this.tagId;
	             let params={};
	            ajaxUtil.doGet(url,params).then((xhr,response) => {
                    if(response.status != 200)
			          {
			              return ajaxUtil.doError(response, this);
			          }
                    let content = ajaxUtil.decodeContent(response.content);
                    let item = JSON.parse(content);
                   
                    this.title = item.title;
                    this.content=item.content;
                   
                    this.description= item.description;
                    this.coverFileId = item.cover_file_id;
                    this.imageFile = item.cover_url;
                    this.initcontent = item.content;
                    this.showTagRel = false;
                    
                });
          },
          selectImage(){
              this.imageFile = this.imageItem.image_url;
              this.coverFileId = this.imageItem.file_id;
              this.showImage = false;
          }
         
        },
        computed:{
            imageError(){
                return this.imageFile != null
            }
        }

	}
</script>
<style>
    .inputfile {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }


</style>