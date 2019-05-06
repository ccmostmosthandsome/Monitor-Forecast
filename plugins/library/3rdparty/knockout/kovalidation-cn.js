define(['knockout','koValidate'],function(ko) {
	ko.validation.localize({
	    required: '必填', 
	    min: '输入的值不能小于{0}.',
	    max: '输入的值不能大于{0}.',
	    minLength: '长度不能少于{0}.',
	    maxLength: '长度不能超过 {0}',
	    pattern: '格式错误.',
	    step: '值必须增加{0}',
	    email: '邮件格式错误',
	    date: '日期格式错误',
	    dateISO: '日期格式错误',
	    number: '请输入整数',
	    digit: '请输入数字',
	    phoneUS: '电话号码格式错误',
	    equal: '值必须相等',
	    notEqual: '请选择另外一个值.',
	    unique: '请确认该值唯一.'
	});
});
