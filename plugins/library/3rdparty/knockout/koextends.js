/***
 * knockout扩展函数集合
 */
define(['knockout','koValidate','jquery','validate'],function(ko,koValidate,$,validate) {
	
	var inputingSpace = false;
	
	$( document ).on( "keydown.koextend",'input', function(e) {
		var val = $( this ).val();
		if ( val ) {		
			inputingSpace = (e.keyCode == 32);			 
		}
	});
	
	/***
	 * 将控件输入的值进行首位空格删除操作
	 */
	ko.extenders.trim = function(target, option) {
	    target.subscribe(function(newValue) {
	    	   if ( newValue && inputingSpace ) { 
		    	   inputingSpace = false;
		    	   target(newValue.replace(/(^\s*)|(\s*$)/g, "")); 
		       }
	    });
	    return target;
	};
	
	/***
	 * 拓展自定义校验 执行传入的函数 用于业务逻辑校验
	 */
	ko.validation.rules['call'] = {
		    validator: function (val, fn) {
		        return fn && fn();
		    },
		    message: '当前值输入有误'
		};
	
	ko.validation.rules['isPhoneNumber'] = {
		    validator: function (val) {

		        return validate.isPhoneNumber(val).success;
		    },
		    message: '固定电话格式不正确'
		};
	
	ko.validation.rules['isWorkPhone'] = {
		    validator: function (val) {

		        return validate.isWorkPhone(val).success;
		    },
		    message: '办公电话格式不正确'
		};
	
	ko.validation.rules['isSimplePhone'] = {
		    validator: function (val) {

		        return validate.isSimplePhone(val).success;
		    },
		    message: '电话号码格式不正确'
		};
	
	ko.validation.rules['isTelephone'] = {
		    validator: function (val) {

		        return validate.isTelephone(val).success;
		    },
		    message: '手机号码格式不正确'
		};
	
	ko.validation.rules['isTelephones'] = {
		    validator: function (val) {
		    	var isTelephones = RegExp(/1[3578]\d{9}$(,1[3578]\d{9}$)*/);
				if(val == null || val == undefined || isTelephones.test(val)|| val==''){
					return true;
				} else {
					return false;
				}
		    },
		    message: '手机号码格式不正确'
		};

	ko.validation.rules['idCard'] = {
		    validator: function (val) {

		        return validate.idCard(val).success;
		    },
		    message: '身份证号码格式不正确'
		};
	
	ko.validation.registerExtenders();
	
	/***
	 * 加入rule的错误信息的前缀信息
	 */
	ko.extenders.msgPrefix = function(target, option) {
		 target.msgPrefix = option;
		 return target;
	};
	
	
	
	/****
	 * 错误显示目前支持的3中方式：
	 * 1. ko.validation 源码提供的方式，即在被校验input的后面插入一个span，适用场景：检验input后面还有空间显示错误信息，如“公用表字段配置”
	 *    kov.init({ 
	 *		       errorShow: 'insertSpan'
	 *	         },true);
	 *	         
	 * 2. 所有错误信息集中信息，适用没有足够空间显示错误信息
	 *    kov.init({ 
	 *		       errorShow: 'spanInDiv',
	 *	           errorShowContext: function(){ return $('#misbuilder-errorarea');//返回集中显示的container元素 }
	 *	       },true); 
	 * 
	 * 3. 气泡显示，在input的上方显示，适用所有情况
	 *    kov.init({ 
	 *		       errorShow: 'inBubble'
	 *	         },true);
	 */
	
	/***
	 * 拓展检验错误信息展示方法
	 * 将所有的错误信息集中在一个div中显示
	 */
	ko.validation.errorShows['spanInDiv'] = {
    	createElement: function(element,fn) {
    		var span = document.createElement('SPAN');
            span.className = koValidate.utils.getConfigOptions(element).errorMessageClass;
            fn().append(span);
            return span;
    	}
	}
	
	/***
	 * 将错误信息放到一个气泡中显示
	 * 气泡会显示在input的上方
	 */
	ko.validation.errorShows['inBubble'] = (function(){
		 
		 var guid = 0;
		  
		 return {
	    	createElement: function(element,context,obs) {
	    		var div = $('<div class="kov-bubble-tag"><span class="bubble"></span><div class="content"></div></div>');
	    		div.addClass(koValidate.utils.getConfigOptions(element).errorMessageClass);
	    		$(element).after(div);
	    	    /**
	    	     * 由于ko.validation是一个单实例对象，所有如果每个页面使用不同的检验错误显示方式，更新的时候会相互影响，所以将显示方式保存在dom节点中，每次更新的时候进行查找
	    	     */
	    	    $(div).data('errorShow','inBubble');
	    	    $(div).data('guid',guid++);
	    	    $(div).data('obs',obs);
	    	    
	    	    $(element).blur(function(){
	    	    	div.hide();
	    	    });
	    	    div.click(function(){
	    	    	div.hide();
	    	    });
	    	    div.css('width',$(element).css('width'));
	            return div[0];
	    	},
	    	
	    	updateError: function(element,errorMsgAccessor,visiblityAccessor) {
	    		var validateEle = $(element).prev();
	    		/***
	    		 * 如果被校验的元素不可见，则无法进行定位，给document添加一个事件，当元素可见之后重新定位，并删除事件
	    		 */
	    		if ( $(validateEle).position().top == 0 ) {
	    			var clickname = 'click.kovalidation' + $(element).data('guid');
	    			$(document).off(clickname).on(clickname,function(){
	    				if ( $(validateEle).position().top > 0 ) {
	    					$(element).css({top: $(validateEle).position().top - 38 + 'px', left: $(validateEle).position().left + 'px' });
	    					$(document).off(clickname);
	    				}
	    			});
	    		}
	    		$(element).css({
					top : $(validateEle).position().top - 38 + 'px',
					left : $(validateEle).position().left + 'px',
					width : $(validateEle).css('width')
				});
	            ko.bindingHandlers.text.update($(element).find('.content')[0], errorMsgAccessor);
	            ko.bindingHandlers.visible.update(element, visiblityAccessor);
	            if ( errorMsgAccessor() ) {
	            	$(element).find('.content').attr('title',errorMsgAccessor()());
	            } 
	    	}
		}
	})();
	
	koValidate.submit = function(container) {
		koValidate.init({ 
		       isSubmit: true
	         },true);
		var errorElems = container.find('.validationMessage'),
		    obs;
		for ( var i = 0; i < errorElems.length; i++ ) {
			obs = $(errorElems[i]).data('obs');
			if ( obs.valueAccessor ) {
				obs(obs.valueAccessor());
			}
			obs.isModified(true);
			koValidate.validateObservable(obs);
			ko.bindingHandlers['validationMessage'].update(errorElems[i],function(){return obs});
		}
		var first = container.find('.validationMessage').find('.content:not(:empty):first');
		if ( first.length > 0 ) {
			container.animate({scrollTop: first.parent().position().top },500);
		}
		koValidate.init({ 
		       isSubmit: false
	         },true);
		return container.find('.validationMessage').find('.content:not(:empty)').length == 0;
	}
	
	/***
	 * 注册非ko绑定的元素检验
	 * _$element: 需要检验的控件（必须是可见的，如果不可见，那么定位到js生成控件的控件）
	 * valueAccessor: 检验值函数
	 * rules: 规则
	 */
	koValidate.registerUnKo = function(_$element,valueAccessor,rules) {
		_$element = $(_$element);
		var obs = ko.observable();
		if (isFunction(valueAccessor)){
			obs.valueAccessor = valueAccessor;
		} else {
			obs.valueAccessor = ko.observable(valueAccessor);
		}
		
		$.each(rules,function(index,obj){
			obs.extend(obj);
		});
		_$element.on('input',function(){
			obs(_$element.val());
		});
		var div = ko.validation.errorShows['inBubble'].createElement(_$element[0],null,obs);
		$(div).addClass("validationMessageUnko").hide();
		ko.applyBindingsToNode(div, { validationMessage: obs});
	}

	function isFunction(fn) {
	    return (!!fn&&!fn.nodename&&fn.constructor!=String&&fn.constructor!=RegExp&&fn.constructor!=Array&&/function/i.test(fn+""));
	}
	/***
	 * 清除所有的错误显示
	 */
	koValidate.clearError = function(container) {
		if(!container) container = $("body");
		container.find('.validationMessage').hide();
	}

	//清除非ko的提示
	koValidate.clearUnKo = function(container){
		if(!container) container = $("body");
		container.find(".validationMessageUnko").remove();
	}
	
	/***
	 * 是否进行校验
	 */
	koValidate.doValidate = function(flag) {
		koValidate.init({ 
		       showError: flag
	         },true);
	}
	
	/***
	 * 该函数是否是用户触发
	 */
	koValidate.isCalledByUser = function() {
		
		if ( ko.triggerByUser == true ) {
			ko.triggerByUser = false;
			return true;
		}
		return false;
		
	}
	
	/***
	 *  ko适配一些第三方ui插件
	 */
	ko.adapters = {
		selectize: (function() {
	    	var selectPattern = /value:\s*(\w+)\s*,\s*options:\s*(\w+)\s*,\s*optionsText:\s*(\w+)\s*,\s*optionsValue:\s*(\w+)\s*/,
    	        selectNoFieldPattern = /value:\s*(\w+)\s*,\s*options:\s*(\w+)\s*/;
    	
	    	function parseDataBind($select, model) {
	    		var $ele = $($select),
				    data_bind = $ele.attr('data-bind'),
				    parseArray,
				    self = model;
				data_bind = data_bind.replace(/'/gm,'');
	    		if ( selectPattern.test(data_bind) ) {
	    			parseArray = selectPattern.exec(data_bind);
	    			return {
	    				value: self[parseArray[1]],
	    				options: self[parseArray[2]],
	    				optionsText: parseArray[3],
	    				optionsValue: parseArray[4],
	    				values: function() { return self[parseArray[2]]();} 
	    			}
	    		} else if ( selectNoFieldPattern.test(data_bind) ) {
	    			parseArray = selectNoFieldPattern.exec(data_bind);
	    			return {
	    				value: self[parseArray[1]],
	    				options: self[parseArray[2]],
	    			    optionsText: 'text',
					    optionsValue: 'value',
					    values: function() { 
					    	var vals = [];
					    	$.each(self[parseArray[2]](), function(index,obj){
					    		vals.push({value: obj, text: obj});
					    	})
					    	return vals;
	                    }
	    			}
	    		}
	    		return null;
	    	}
	    	
	    	function bindSelectAndKo($select, model) {
	    		var $ele = $($select), 
	    		    _select,
	    		    bindInfo = parseDataBind($select, model);
	    		if ( bindInfo ) {
					_select = $ele.selectize({
	            		mode: "single",
	    			    valueField: bindInfo.optionsValue,
	    			    labelField: bindInfo.optionsText,
	    			    options: bindInfo.values()
	    			})[0].selectize;
	    			 
	    			bindInfo.value.subscribe(function(value){
	    				_select.setValue(value,false);
	    			});
	    			 
					bindInfo.options.subscribe(function(){ 
						var values = bindInfo.values();
						_select.clearOptions();
						_select.addOption(values);
						_select.refreshOptions(false);
	    			});	
	    		} 
	    	}
				
			return bindSelectAndKo;
		})()
	}
	
});