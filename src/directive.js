export function directive (Vue) {


Vue.directive('date-range-picker', {
  twoWay: true,
  params: ['options'],
    
  bind: function () {
    moment.locale('zh-cn');
     var self = this;

      console.log("self.params.options.format:",self.params.options.format);
     $(this.el).daterangepicker({
           opens:'centre',
           format:self.params.options.format,
           "drops": "down",
           locale: {
               applyLabel: '确定',
               cancelLabel: '取消',
               fromLabel: '从',
               toLabel: '到',
               weekLabel: 'W',
               customRangeLabel: 'Custom Range',
               daysOfWeek:moment.weekdaysMin(),
               monthNames: moment.monthsShort(),
               firstDay: 0
            }
	     
     },function(start, end, label) {
         console.log(start.date())
         var timeObj={};
         timeObj.start_time=start.toDate();
         timeObj.end_time=end.toDate();
         self.set(timeObj)
     }).bind('datepicker-apply',function(event,obj)
	{
		var timeObj={};
		timeObj.start_time=obj.date1;
		timeObj.end_time=obj.date2;
		 self.set(timeObj)
	});
  },
  update: function (value) {
  },
  unbind: function () {
   
  }
});


Vue.directive('select', {
  twoWay: true,
  priority: 1000,

 
    
  bind: function () {
    var self = this

    $(this.el)
      .selected({
	    btnSize: 'sm',

	      })
      .on('change', function () {
        self.set(this.value)
      })
  },
  update: function (value) {
	console.log( $(this.el).val(value))
    $(this.el).val(value).trigger('change')
  },
  unbind: function () {
    $(this.el).off().selected('destroy')
  }
});


}

