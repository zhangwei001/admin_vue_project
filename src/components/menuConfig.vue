<template>
    <div class="page-header position-relative">
                        <div class="header-title">
                            <h1>
                                公众号底部菜单配置
                            </h1>
                        </div>
    </div>
<div class="page-body">
        <div class="row">
             <div class="col-md-12">
                  <button type="button" class="btn btn-primary shiny"  v-on:click="exportAll">一键发布菜单</button>
              </div>
        </div>
        <div class="row">
           <div class="col-xs-12">
           </div>
        </div>
		<div class="row">
		    <div class="col-xs-12 col-md-4">



                         <div class="widget">
                               <div class="widget-header">

                                   <span class="widget-caption">
                                      主菜单最多添加3项，子菜单最多添加5项
                                   </span>
                               </div>

                           <div class="widget-body">
                                <div class="dd dd-draghandle darker">
                                     <ol class="dd-list">

                                    <item class="item" :model.sync="treeData" :detail.sync="detailModel" > </item>
                                     </ol>
                                </div>
                           </div>
                       </div>

		    </div>
		    <div class="col-xs-12 col-md-8">

                <div class="widget">
                    <div class="widget-header bordered-bottom bordered-blue">
                        <span class="widget-caption">菜单修改</span>
                    </div>
                    <div class="widget-body">
                        <div class="collapse in">
                            <form role="form">
                                <div class="form-group">
                                    <label for="name"> 菜单名称</label>
                                    <input type="text" class="form-control" v-model="detailModel.name" name="name" id="name" maxlength="8"/>
                                    <span>字数不超过8个汉字</span>
                                </div>
                                <div class="form-group">
                                    <label for="type">菜单类型</label>
                                    <select class="form-control" v-model="detailModel.type" id="type" name="type">
                                        <option value=''>无</option>
                                        <option value="click">点击推事件</option>
                                        <option value="view">跳转URL</option>
                                        <!-- <option value="scancode_push">扫码推事件</option>
                                         <option value="scancode_waitmsg">扫码推事件且弹出“消息接收中”提示框</option>
                                         <option value="pic_sysphoto">弹出系统拍照发图</option>
                                         <option value="pic_photo_or_album">弹出拍照或者相册发图</option>
                                         <option value="pic_weixin">弹出微信相册发图器</option>
                                         <option value="location_select">弹出地理位置选择器</option>
                                         <option value="media">媒体</option>-->
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="url">  菜单URL</label>
                                    <input type="text" class="form-control" v-model="detailModel.url" name="url" id="url"/>                                </div>
                                </div>
                                <div class="form-group" v-if="detailModel.type=='view'">
                                    <label for="isAuth">  是否授权</label>
                                    <select  class="form-control" v-model="detailModel.isAuth" name="isAuth" id="isAuth">
                                        <option value="0">否</option>
                                        <option value="1">是</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="key">  事件KEY</label>
                                    <input type="text" class="form-control" v-model="detailModel.key" name="key" id="key"/>
                                 </div>
                                <div class="form-group">
                                    <label for="sortNum">  菜单顺序</label>
                                    <input type="number" class="form-control" v-model="detailModel.sortNum" name="sortNum" id="sortNum"/>
                                    <span>数字越小，菜单排序越靠前</span>
                                </div>
                        <button type="button" class="btn btn-blue" v-on:click="save">保存</button>
                        <button type="button" class="btn btn-blue" v-on:click="cancel">取消</button>

                            </form>
                        </div>
                    </div>
                </div>

		    </div>
		</div>
</div>

</template>
<script>
import item from './menuConfigItem.vue'
import * as ajaxUtil from '../util/Ajax.js'
export default {
    components:{
            item
    },
    data(){
        return{
                treeData: Object,
                detailModel:Object
        }
    },
    ready () {
      this.loadData();
    },
    events: {
        'deleteId': function (id) {
          this.delete(id);
        }
    },
    methods:{
        verification:function(){
             if(!this.detailModel.name || this.detailModel.name==''){
                return '名称不能为空';
             }
             return null;
        },
        loadData:function(){
            var that=this;
             ajaxUtil.doGet(Url.MENU_ALL,null).then((xhr,response) =>{
                if(response.status != 200){
                    return ajaxUtil.doError(response,this);
                }
                let content = ajaxUtil.decodeContent(response.content);
                if(content){
                     content=JSON.parse(content);
                }
                that.treeData={ childs: content};
                that.detailModel=null;
            })
        },
        save:function(){
            var ver=this.verification()
            if(ver!=null){
                alert(ver);
                return;
            }
            var that=this,
                param=[],
                d=new Date();
            this.detailModel.modifyTime= d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+':'+d.getSeconds();
            for(var i in this.detailModel){
                var v=this.detailModel[i];
                if(i!='childs' && v!=null && v!=''){
                    if(i=='createTime'){
                        var d=new Date(v);
                        v=d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+':'+d.getSeconds();
                    }
                    param.push(i+'='+v);
                }
            }
            var p=param.join('&');
            var url=Url.MENU_SAVE+'?'+p.substr(0,p.length);
            ajaxUtil.doPost(url).then((xhr,response) =>{
                if(response.status != 200){
                    return ajaxUtil.doError(response);
                }
                that.loadData();
                alert('保存成功');
            })
        },
        delete:function(id){
            var that=this;
            if(id){
                 ajaxUtil.doGet(Url.MENU_DEL+id).then((xhr,response) =>{
                    if(response.status != 200){
                        return ajaxUtil.doError(response);
                    }
                   that.loadData();
                })
            }else{
             this.detailModel=null;
            }
        },
        cancel:function(){
         this.detailModel=null;
        },
        exportAll:function(){
              ajaxUtil.doGet(Url.MENU_EXPORTAll).then((xhr,response) =>{
                 if(response.status != 200){
                     return ajaxUtil.doError(response);
                 }
                 alert('发布成功');
             });
        }
    }
}
</script>
