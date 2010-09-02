flow.DynamicTable = function(controllerList, modelList, parent, dialogParent, param){
    var that = this;
    that.refocsing = false;
    that.param = $.extend({
	    id:"dynamic_table_" + (flow.DynamicTable.anonymousTableId++),
	    groupParent:null,
	    groupName:null,
	    dialog:null,
	    dialogField:null,
	    className:null,
	    stealKeyboard: false,
	    dnd:false
	}, param);
    this.keypressHandler = function(event)
    {
	/*
       flow.log('Keypress handler in ' + that.domNode.id);
       flow.log(event);
	*/
       switch(event.keyCode){
	  case flow.event.keyCode.UP:
	  {
	     that.setSelected(that.getSelectedRow()-1, that.getSelectedColumn());
	     event.stopPropagation();
	     break;
	  }
	  case flow.event.keyCode.DOWN:
	  {
	     that.setSelected(that.getSelectedRow()+1, that.getSelectedColumn());
	     event.stopPropagation();
	     break;
	  }
	  case flow.event.keyCode.LEFT:
	  {
	     that.setSelected(that.getSelectedRow(), that.getSelectedColumn()-1);
	     event.stopPropagation();
	     break;
	  }
	  case flow.event.keyCode.RIGHT:
	  {
	     event.stopPropagation();
//	     flow.log("Move right from " + that.getSelectedRow() + ", " + that.getSelectedColumn());
	     that.setSelected(that.getSelectedRow(), that.getSelectedColumn()+1);
//	     flow.log("New position is " + that.getSelectedRow() + ", " + that.getSelectedColumn());
	     break;
	  }
	  case flow.event.keyCode.ENTER:
	  {
	     window.tralala=true;
	     var controls = $("input, textarea, select",that.dialogArea);
	     if(controls.length){
		event.stopPropagation();
		controls[0].focus();
	     }
	     event.stopPropagation();
	     break;
	  }
       }
    }
    this.controllerList = controllerList;
    this.modelList = modelList;
    this.page = 0;
    this.domNodeCreate(parent);
    this.dialogArea=dialogParent;
    this.selected = null;

    if(param.dnd)
    {	
	function checkOrder(){
	    var tml=[];
	    $.each(that.domNode.rows, function(idx, row){
		    if(row.model)
			tml.push(row.model);
		});
	    if(tml.length != that.modelList.length)
		return false;
	    var ok = true;
	    $.each(tml, function(idx, model){
		    if(model.id != that.modelList.get(idx).id)
		    {
			ok = false;
		    }
		});
	    return ok;
	}

	var onDropFun =function(table, row){
	    newModelList = [];
	    var rows = table.rows;
	    $.each(rows, function(idx, row){
		    if(row.model)
			newModelList.push(row.model);
		    
		});
	    that.modelList.update(newModelList);
//		   flow.log('Woo wee woo');
//		   flow.log(that.modelList);
	}
	
	modelList.register(function(name, old){
		if(!checkOrder()){
		    flow.dom.clean(parent);
		    that.domNodeCreate(parent);
		    $(that.domNode).tableDnD({
			  onDrop:onDropFun
				});
		    
		}
	    });
	
	$(that.domNode).tableDnD({
	      onDrop:onDropFun
		    });
	
    }
    
    //this.setSelected(flow.state.get(param.id + '.selected',[0,0]));
    
};

flow.DynamicTable.anonymousTableId=0;
/*
  Methods for DynamicTable
*/
flow.DynamicTable.prototype.initHidable = function(element, controller, header)
{
   var that = this;
   var it = controller;
   
   while(it.param.groupParent){
      var name = it.param.groupParent.param.groupName;
      $(element).addClass("child_" + name).addClass(name);
      if(flow.state.get("hide." + name)){
	  $(element).addClass(name + "_hidden");
      }
      it = it.param.groupParent;
      
   }

   if(header && controller.param.groupName){
       $(element).addClass("expandable");
       
      var name = controller.param.groupName;
      var expander = document.createElement('button');
      $(expander).addClass('expander_button');
      var hide = !flow.state.get("hide." + name);
      $(element).addClass("parent_" + name).addClass(name);
      $(expander).text(hide?'-':'+');
      element.insertBefore(expander, element.childNodes[0]);
      var group_selector = ".child_" +  name;
      $(expander).bind('click',function(){
	    var hide = !flow.state.get("hide." + name);
	    flow.state.set("hide." + name, hide);
	    
	    if(hide){
		$(group_selector).addClass(name + "_hidden");
	       $(expander).text('+');
	    }
	    else {
		$(group_selector).removeClass(name + "_hidden");
		$(expander).text('-');
	    }
	    that.reflowCells();
	    
	 });
   }
};

flow.DynamicTable.prototype.reflowCells = function()
{
   var that = this;
//   flow.log('Reflow cells of table ' + this.param.id);
//   var r = $("#flow_row_header");
   this.cellMapping=[];
   this.cellReverseMapping=[];
   for(var i=0;; i++){
      var id = that.domNode.id+'_cell_0_' + i;
      var cell = $('#'+id, that.domNode);
      if(cell.length != 1){
	 break;
      }
      if(!flow.dom.isVisible(cell[0]))
      {
	 continue;
      }
      this.cellMapping.push(i);
   }
   $.each(this.cellMapping, function(key, value){
	 that.cellReverseMapping[value] = key;
      });
};

flow.DynamicTable.prototype.getColumnCount = function()
{
   return this.cellMapping.length;
};

flow.DynamicTable.prototype.getCell = function(rowIdx, colIdx)
{
   var r = $("#"+this.domNode.id+"_cell_"+rowIdx+ "_" + this.cellMapping[colIdx]);
   return (r.length == 1)? r[0]:null;
};

flow.DynamicTable.prototype.setSelected = function(rowIdx, colIdx, param)
{
    /*
   flow.log('set selected to ');
   flow.log(rowIdx);
   flow.log(colIdx);
   flow.log(param);
    */
   param = $.extend({skipFocus:false},param);
   var that=this;
   var newSelected = null;
   if(typeof rowIdx == 'number'){
      newSelected = this.getCell(rowIdx, colIdx);
   }
   else if(rowIdx instanceof Array){
      newSelected = this.getCell(rowIdx[0], rowIdx[1]);
   }
   else {
      var cell = rowIdx;
      while(cell){
	 var prefix = that.domNode.id + "_cell_";
	 if(cell.id){
	     var data = cell.id.substring(prefix.length).split('_');
	     if(cell.id && cell.id.substring(0,prefix.length) == prefix && 
		data.length == 2 &&
		!isNaN(parseInt(data[0])))
	     {
		newSelected = cell;
		
		break;
	     }
	 }
	 cell = cell.parentNode;
      }
      
   }

   if(newSelected)
   {
       var prefix = that.domNode.id;
       var data = newSelected.id.substring(prefix.length).split('_');
       var row = parseInt(data[2]);
       var col = that.cellReverseMapping[parseInt(data[3])];

      if(!param.skipFocus){
	 var inputList = $(newSelected).find('input, textarea, a');
	 if(inputList.length){
	    var i = inputList[0];
	    /*	    flow.log('Give focus to');
		    flow.log(i);*/
	    i.focus();
	 }
      }

      if('id' in that.param)
	 flow.state.set(that.param.id + '.selected', [row, col]);

       if(this.selected){
	   $(this.selected).removeClass('selected');
	   if(this.selected.dialog)
	      that.dialogArea.removeChild(this.selected.dialog.domNode);
       }

      this.selected = newSelected;
      $(this.selected).addClass('selected');
       
       if(this.selected.dialog)
       {
	   that.dialogArea.appendChild(this.selected.dialog.domNode);
       }
       else
       {
	   var dia = null;
	   var it = newSelected.controller;
	   var diaModel = newSelected.model;
	   var selectedParent = null;
	   
	   while(it)
	   {
	       if(it.param.dialog){
		   dia = it.param.dialog;
		   
		   if (it.param.dialogField) {
		       diaModel = diaModel[it.param.dialogField];
		   }
		   selectedParent = this.selected.parentCell;
		   
		   break;
	       }
	       it = it.param.groupParent;
	   }
	   if(dia)
	   {
	       
	       this.selected.dialog = new dia(diaModel, newSelected.controller, that.dialogArea);
	       
	       var controls = $("input, textarea, select",that.dialogArea);

	       controls.bind('keypress', function(event){
		     switch(event.keyCode){
			case flow.event.keyCode.UP:
			   case flow.event.keyCode.DOWN:
			   case flow.event.keyCode.LEFT:
			   case flow.event.keyCode.RIGHT:
			   case flow.event.keyCode.ENTER:
			       event.stopPropagation();
			       break;
			      
			   case flow.event.keyCode.ESCAPE:
			       event.target.blur();
			       break;
			      
		      }
		  });

	   }
	   else
	   {
//	 flow.log("No dialog for new cell");
	   }
       }
       
   
   
/*
  var controls = $("input, textarea, select",that.dialogArea);
  if(controls.length){
  controls[0].focus();
  controls.bind('keypress', that.keypressHandler);

  }
  else
  {
	    
  }
*/
      
       }
};
   
flow.DynamicTable.prototype.getSelectedRow = function()
{
   var that=this;
   var sel = this.selected;
   if(!sel)
      return null;

   var prefix = that.domNode.id;
   var data = sel.id.substring(prefix.length).split('_');
   return parseInt(data[2]);
};

flow.DynamicTable.prototype.getSelectedModel = function()
{
   var sel = this.selected;
   if(!sel)
      return null;

   return sel.model;
};

flow.DynamicTable.prototype.getSelectedColumn = function()
{
   var that=this;
   var sel = this.selected;
   if(!sel)
      return null;
   var prefix = that.domNode.id;
   var data = sel.id.substring(prefix.length).split('_');
   return this.cellReverseMapping[parseInt(data[3])];
};

flow.DynamicTable.prototype.domNodeCreate = function(parent)
{
   var that = this;
   that.domNode = document.createElement('table');
   that.domNode.id = that.param.id;
   $(that.domNode).addClass('dynamic_table');

   if(that.param.className)
   {
      $(that.domNode).addClass(that.param.className);
   }

   var pager = that.pagerCreate();
   var cl = that.controllerList;
   
   var headerRow = document.createElement('tr');
   headerRow.id= that.domNode.id + '_row_header';
   $(headerRow).addClass('nodrag').addClass('nodrop');
   
   var colIdx = 0;
   that.domNode.appendChild(headerRow);
   $.each(cl, function(idx, controller){
	 var cell = document.createElement('th');
	 cell.id = that.domNode.id + "_cell_header_" + colIdx;
	 var headerText = document.createElement('span');
	 if(controller.isVirtual)
	 {
	    $(headerText).addClass("vertical_text");
	    $(cell).addClass("vertical_cell");
	    //alert($(that.modelList).length);
	    cell.rowSpan = Object.size(that.modelList)+1;
	 }
	 $(headerText).text(controller.label);
	 cell.appendChild(headerText);
	 that.initHidable(cell, controller, true);
	 headerRow.appendChild(cell);
	 colIdx++;
      });


   $(that.domNode).bind('click',function(event){
	 if(!$(event.target).hasClass('flow_focus_anchor')){
	    that.setSelected(event.target);
	 }
       });

   var idx = 0;
   $.each(
       that.modelList.values, function(idx, model){
	   var row = document.createElement('tr');
	   row.id = that.domNode.id + "_row_" + idx;
	   var colIdx = 0;
	   var cellLoopup=
	       {
	       }
	   ;
	   row.model = model;
	   $.each(cl, function(tmp, controller){
		   if(controller.isVirtual)
		   {
		       return;
		   }
	       var cell = document.createElement('td');
	       if(controller.param.groupParent)
	       {
		   //parentCell = cellLookup[controller.param.groupParent.param.groupName];
		   cell.__defineSetter__(
		       'parentCell',
		       function(v)
		       {
			   return parentCell;
		       }
		       );
	       }
	       
	       cell.id = that.domNode.id + "_cell_" + idx+"_" + colIdx;
	       controller.domNodeCreate(cell,model);

	       var focusable = $('input, textarea, a', cell);
	       if(focusable.length == 0)
	       {
		  var sub = document.createElement('a');
		  sub.className = "flow_focus_anchor";
//		  sub.href="javascript:alert('her');";
		  sub.href="javascript:$('input')[0].focus();return false;";
		  sub.href="#";
		  sub.style.width='0px';
		  sub.style.height='0px';
		  sub.style.color='white';
		  sub.style.border='0px solid white';
		  sub.style.position='absolute';
		  
		  cell.appendChild(sub);
	       }
	       
	       $('input, textarea, a', cell).bind('focus', function(){that.setSelected(this, null, {skipFocus:true});});
	       
	       cell.controller = controller;
	       cell.model = model;
	       that.initHidable(cell, controller, false);
	       row.appendChild(cell);
	       colIdx++;
	    });
	 that.domNode.appendChild(row);
	 idx++;
       });
   
   var footerRow = document.createElement('tr');
   footerRow.style.display="none";
   $(footerRow).addClass('nodrag').addClass('nodrop');
   
   that.domNode.appendChild(footerRow);
   parent.appendChild(that.domNode);
   
   if(that.param.stealKeyboard){
       $(document).bind('keypress', that.keypressHandler);
   }
   $('input, a, textarea, select', that.domNode).bind('keypress', that.keypressHandler);
   
   that.reflowCells();
};
	    
flow.DynamicTable.prototype.pagerCreate = function()
{
   var pager = document.createElement('tr');
   
};

