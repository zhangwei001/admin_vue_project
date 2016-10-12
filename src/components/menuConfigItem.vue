<template>
    <li  v-for="model in model.childs" class="dd-item dd2-item" >
      <div class="dd2-content" @click="toggle(model)" @dblclick="changeType" :class="{'bg-blueberry':model.id==detail.id,'no-hover':model.id==detail.id}">
          {{model.name}}
          <span class="glyphicon glyphicon-trash" @click="delete(model)"></span>
      </div>



          <ol class="dd-list" style="" v-if="isFolder">

               <li v-for="model in model.childs" class="dd-item dd2-item">
                  <div class="dd2-content" :class="{'bg-azure':model.id==detail.id,'no-hover':model.id==detail.id}"  @click="toggle(model)" @dblclick="changeType">
                      {{model.name}}
                    <span class="glyphicon glyphicon-trash" @click="delete(model)">
	                    
                    </span>
                  </div>
              </li>
               <li  v-show="model.childs.length<5"  @click="addChild(model.id,model.name,model.childs.length)" class='am-btn am-badge am-badge-secondary'>

                <span class="label label-success">
                +添加子菜单</span>
               </li>
          </ol>
       </li>
       <li v-show="model.childs.length<3" @click="addMain" class='am-btn am-badge am-badge-secondary'>
          <span class="label label-success"> +添加菜单</span>
       </li>
</template>

<script>

export default {
        props:['model','detail'],
        data(){
            return {
                open: false
            }
        },
     
        ready () {
        },
        computed:{
            isFolder: function () {
                return this.model.childs &&
                        this.model.childs.length
            }
        },
        methods: {
            toggle: function (model) {
                this.detail=model;
                this.detail.form_type='1';//1表示修改2表示新增
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
            changeType: function () {
                if (!this.isFolder) {
                    Vue.set(this.model, 'childs', [])
                    this.addChild()
                    this.open = true
                }
            },
            addMain:function(){
                if(this.model.childs.length<3){
                    this.detail={};
                    this.detail.name='未命名菜单';
                    this.detail.form_type='2';//1表示修改2表示新增
                    this.detail.type='';
                    this.detail.parentId=0;
                }
            },
            addChild: function (parentId,name,length) {
                 if(this.model.childs.length<5){
                     this.detail={};
                     this.detail.form_type='2';//1表示修改2表示新增
                     this.detail.type='';
                     this.detail.parentId=parentId;
                     this.detail.name=name+'-未命名';
                 }

            },
            delete:function(model){
                 var that=this;
                 if(model.childs.length>0){
                     alert('删除失败，请先删除子菜单');
                     return;
                 }
                 this.$dispatch('deleteId', model.id)
             }
        }
}
</script>