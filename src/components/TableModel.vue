<template>

    <p style=" max-width:500px;white-space:nowrap;word-break:keep-all;overflow:hidden;text-overflow:ellipsis;">
		 <a @click="showModal=true" target="{{item.msgText}}">详情</a>
    </p>
	<modal :show.sync="showModal">
        <h3 slot="header">消息内容</h3>
        <p slot="body">{{item.msgText}}</p>
   </modal> 
</template>
<script>
import modal from './common/Modal.vue'
export default {
    props :['item'],
    data () {
       return{
        showModal:false
       }
    },
    components:{
        modal
    }
    
}
</script>