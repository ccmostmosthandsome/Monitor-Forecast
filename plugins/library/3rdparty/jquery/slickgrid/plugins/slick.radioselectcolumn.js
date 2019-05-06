// eUrban code yindl
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "RadioSelectColumn": RadioSelectColumn
    }
  });


  function RadioSelectColumn(options) {
    var _grid;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _selectedRowsLookup = {};
    var _defaults = {
      columnId: "_radio_selector",
      cssClass: null,
      toolTip: "",
      width: 30
    };
    
    var _fromRadio = false;

    var _options = $.extend(true, {}, _defaults, options);

    function init(grid) {
      _grid = grid;
      _handler
      	.subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged)
      	.subscribe(_grid.onClick, handleClick);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleSelectedRowsChanged(e, args) {
    	if(_fromRadio){
    		_fromRadio = false;
    		return;
    	}else{
    		// TO DO 阻止多项选择
    		
    		//同时选中行
    		$(_grid.getContainerNode()).find("span[class^='slick-images-radio-']").each(function(i){
    			if(i === _grid.getActiveCell().row){
    				$(this).removeClass("slick-images-radio-0").addClass("slick-images-radio-1");
    			}else{
    				$(this).removeClass("slick-images-radio-1").addClass("slick-images-radio-0");
    			}
    		});
    	}
    }

    function handleClick(e, args) {
      if (_grid.getColumns()[args.cell].id === _options.columnId && $(e.target).is("span[class^='slick-images-radio-']")) {
    	  $(_grid.getContainerNode()).find(".slick-images-radio-1").removeClass("slick-images-radio-1").addClass("slick-images-radio-0");
    	  $(e.target).removeClass("slick-images-radio-0").addClass("slick-images-radio-1");
    	  _fromRadio = true;
    	  // 这里向上冒泡选中行
    	  //e.stopPropagation();
          //e.stopImmediatePropagation();
      }
    }

    function getColumnDefinition() {
      return {
        id: _options.columnId,
        name: "",
        toolTip: _options.toolTip,
        field: _options.field || "radio",
        width: _options.width,
        resizable: false,
        sortable: false,
        cssClass: _options.cssClass,
        formatter: radioSelectionFormatter
      };
    }

    function radioSelectionFormatter(row, cell, value, columnDef, dataContext) {
      if (dataContext) {
        return value
            ? "<span class='slick-images-radio-1'></span>"
            : "<span class='slick-images-radio-0'></span>";
      }
      return null;
    }

    $.extend(this, {
      "init": init,
      "destroy": destroy,
      "getColumnDefinition": getColumnDefinition
    });
  }
})(jQuery);