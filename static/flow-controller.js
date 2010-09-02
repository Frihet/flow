/**
   Controller objects. These controllers work more like e.g. Java
   Swing controllers do, they not only control flow of events, they
   also take on responsibility for creating DOM elements, something
   that the view would do in a web framework.

 */

flow.controller = {};

flow.controller.Controller= function(label, param){
	 this.label = label;
	 this.param = param || {};
	 this.isVirtual = ('virtual' in this.param) && this.param.virtual;
};



/*
  Methods for Controller base class
*/

flow.controller.Controller.prototype.domNodeCreate = function(cell, model)
{
   var el = document.createElement('span');
   cell.appendChild(el);
   return el;
};

/*
  Methods for Field controller
*/

flow.controller.Field = function(label, field, param){
    flow.controller.Controller.call(this, label, param);
    this.field = field;
};

flow.inherit(flow.controller.Field, flow.controller.Controller);

flow.controller.Field.prototype.get = function(model)
{
   var item = model;
   $.each(this.field.split('.'), function(idx, el){
	 if(!(item == undefined))
	    item = item[el];});
   return item;
};
   
flow.controller.Field.prototype.register = function(model, handler)
{
   var item = model;
   var path = this.field.split('.');
   var name = path.pop();
   $.each(path, function(idx, el){
	 if(!(item == undefined))
	    item = item[el];});
   if(item){
      item.register(name, handler);
   }
   return item;
};

/*
 Methods for Label controller
*/

flow.controller.Label = function(label, field, param){
    flow.controller.Field.call(this, label, field, param);
};

flow.inherit(flow.controller.Label, flow.controller.Field);

flow.controller.Label.prototype.domNodeCreate = function(cell, model)
{
   var that=this;
   if('className' in that.param)
   {
      $(cell).addClass(that.param.className);
   }
   if('type' in that.param)
   {
      if(that.param.type == 'numeric'){
	 $(cell).addClass('numeric');
      }
      else if(that.param.type == 'text'){
      }
      else{
	 flow.log("Unknown column type " + that.type.param + " on label column " + that.field);
      }
   }
   else{
       that.param.type = 'text';
   }
   
   var s = document.createElement('span');
   cell.appendChild(s);

   var update = function(name, old){
//      flow.log("Label got change notification on field " + name);
      var value = that.get(model);
      if(typeof value == "object"){
	 flow.dom.clean(s);
	 s.appendChild(value.cloneNode(true));
      }
      else {
	 
	 if(that.param.type == 'numeric')
	 {
	     value = flow.format.numeric(value);
	 }
	 
	 if('url' in that.param){
	     flow.dom.clean(s);
	     s.appendChild(flow.dom.link(value, value));
	 }
	 else {
	     flow.dom.clean(s);
	     flow.dom.addTextNode(s,value);
	 }
      }
      
   };
   this.register(model, update);
   update();

   return cell;
};
   
/*
  Methods for Process controller
*/
   
flow.controller.Process = function(processType, param){
    flow.controller.Controller.call(this, processType.name, param);
    this.processType = processType;
};

flow.inherit(flow.controller.Process, flow.controller.Controller);

flow.controller.Process.prototype.domNodeCreate = function(cell, model)
{
   var that=this;

   var process = model.process[that.processType.id];

   var el = document.createElement('span');
   $(el).addClass('process_cell');

   var url = document.createElement('div');
   $(url).addClass('url');
   el.appendChild(url);
   

   var hours = document.createElement('span');
   $(hours).addClass('hours_done');
   el.appendChild(hours);

   function updateHours(name, old){
      $(hours).text(process.hoursDone+ " %");
   }   
   model.process[that.processType.id].register('hoursDone',updateHours);   
   updateHours();

   function updateUrl(name, old){
      flow.dom.clean(url);
      if(process.url)
	 url.appendChild(
	    flow.dom.link(
	       process.url,
	       flow.dom.image('static/link.png','icon')));
   }   
   model.process[that.processType.id].register('url',updateUrl);   
   updateUrl();
   
   $(cell).addClass('numeric');
   cell.appendChild(el);
   return el;
};


