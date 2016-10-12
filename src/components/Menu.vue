<template>
    <ul class="nav sidebar-menu">

      <li v-if="func.isLeaf==0" :class="{active:itemindex == func.id}">
          <a  v-link="{ path: func.path }"   @click="toggleItem(func.id)">
              <span class="menu-text">{{func.label}}</span>
          </a>
      </li>

      <li v-else :class="{active:itemindex == func.id,open:itemindex ==func.id}" >
          <a class="menu-dropdown"  :class="{'am-collapsed': menuindex == func.id}"  @click="toggle" :class="{active:itemindex == item.id}" >
              <span class="menu-text">{{func.label}} </span>
              <i class="menu-expand"></i>
          </a>
          <ul class="submenu" :style="{display:display}">
              <li v-for="item in func.functions">
                  <a v-link="{ path: item.path}" @click="toggleItem(item.id)">
                      <span class="menu-text">{{item.label}}</span>
                  </a>
              </li>
          </ul>

      </li>

  </ul>

</template>
<script>
export default {
  data () {
    return {
      itemActive: false,
      height:'0px',
    }
  },
  props:{
    func: {
       type: Object
    },
    menuindex: {
      type: Number
    },
    itemindex: {
      type: Number
    }
  },
  methods: {
    toggle () {
      if(this.menuindex == this.func.id){
        this.menuindex = -1;
      }else{
          this.menuindex = this.func.id;
      }
    },
    toggleItem(id){
         this.itemindex = id;

    }
  },
  computed: {
    display(){
      var display = this.menuindex == this.func.id?'block':'none';

      return display;
      
    }
  }
}
</script>
