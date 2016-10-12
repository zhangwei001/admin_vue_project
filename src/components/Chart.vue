<template>
	
	<div v-el:chart style="height:400px"></div>
</template>
<script>
// 引入 ECharts 主模块
	var echarts = require('echarts/lib/echarts');
	// 引入柱状图
	require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
	// 引入提示框和标题组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
    require('echarts/lib/component/toolbox');
export default {
		data () {
		      return {
		      }
        },
		props:['legend','xAxis','series'],
		ready() {
			
		},
		methods:{
			refreshChart(){
				 var myChart = echarts.init(this.$els.chart);
             var option={
	            tooltip : {
                    trigger: 'axis'
                 },
                legend: {
                   data:[]
                 },
                 toolbox: {
                    show : true,
				    feature : {
				        mark : {show: true},
				        dataView : {show: true, readOnly: false},
				        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
				        restore : {show: true},
				        saveAsImage : {show: true}
				    }
                }, 
                calculable : true,
                xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : []
				        }
                 ],
                 yAxis : [
				        {
				            type : 'value'
				        }
                 ],
                 series : []
             };
            
             
	            option.legend.data=this.legend
	            option.xAxis[0].data=this.xAxis
	            option.series=this.series
                // 为echarts对象加载数据
                myChart.setOption(option);
			}
		},
		watch:{
			legend:function(){
				
                this.refreshChart();
			}
		}
	}
</script>