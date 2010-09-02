/**
   Model objects are regular JS objects, except it's possible to
   define event handlers that should be run when a model field changes
   value. 

   Before using a model field, you must decalre it using the
   declare method. You will usually simple write something like
   this.declare('name') in the Model constructor to do so.

   To register an event handler, simply call the register method,
   which takes two arguments, the name of the field and the function
   to run.
 */

flow.model = {};

flow.model.Model= function(){
    this.listeners={};
};

/*
  Methods for Model
*/

flow.model.Model.prototype.declare = function(name)
{
   var internalName = name + "Internal";
   this.__defineSetter__(
       name,
       function(v) {
	   var that=this;
	   var old = this[internalName];
	   if(v instanceof Array){
	       function ModelList(initial)
	       {
		   this.values = initial.slice(0);
		   this.push = function(value)
		       {
			   var old = this.values.slice(0);
			   var res = this.values.push(value);
			   that.emit(name, old);
			   return res;			   
		       }
		   this.pop = function()
		       {
			   var old = this.values.slice(0);
			   var res = this.values.pop();
			   that.emit(name, old);
			   return res;			   
		       }
		   this.get = function(idx)
		       {
			   return this.values[idx];
		       }		   
		   this.set = function(idx, value)
		       {
			   var old = this.values.slice(0);
			   var res = this.values[idx] = (value);
			   that.emit(name, old);
			   return res;			   
		       }
		   this.update = function(values)
		       {
			   var old = this.values.slice(0);
			   var res = this.values = values;
			   that.emit(name, old);
			   return res;
		       }
		   this.removeItem = function(value)
		       {
			   var old = this.values.slice(0);
			   var newVal=[];
			   $.each(this.values, function(idx, val){
				   if(val != value){
				       newVal.push(val);
				   }
			       });
			   this.values = newVal;
			   that.emit(name, old);
			   return newVal;
		       }
		   this.register = function(fun)
		       {
			   that.register(name, fun);
		       }
		   this.__defineGetter__(
		       'length',
		       function()
		       {
			   return this.values.length;
		       }
		       );
	       }
	       v = new ModelList(v);
	       
	   }
	   this[internalName]=v;
	   this.emit(name, old);	 
       });

   this.__defineGetter__(name, function(){
	 return this[internalName];
      });
};

flow.model.Model.prototype.register = function(name, handler)
{
//   flow.log("Register listener on field " + name + " in model");
//   flow.log(this);
   if(!(name in this.listeners)){
      this.listeners[name]=[];
   }
   this.listeners[name].push(handler);
};

flow.model.Model.prototype.unregister = function(name, handler)
{
//   flow.log("Register listener on field " + name + " in model");
//   flow.log(this);
   if(!(name in this.listeners)){
      this.listeners[name]=[];
   }
   while(true){
      var idx = this.listeners[name].indexOf(handler);
      if(idx == -1)
	 break;
      this.listeners[name].splice(idx, 1);
   }
};

flow.model.Model.prototype.emit = function(name, old)
{
//   flow.log("Field " + name + " changed in model");
//   flow.log(this);
   var that=this;
   if(name in this.listeners) {
//      flow.log("Emit: " +name + " changed from " + old+ " to " + this[name]+ " sent to " +this.listeners[name].length + " listeners" );
      $.each(this.listeners[name],function(idx, val){
	    val(name, old, that[name]);
	 });
   }
   else {
      //    flow.log("Emit: " +name + " changed from " + old+ " to " + this[name]+ ", but who cares?" );
      
   }
};
/*
  Methods for Project model
*/

flow.model.Project =function(jsonData){
    flow.model.Model.call(this);
    var that = this;
    this.declare('contact');
    
    $.each(['name','id','value','closeChance'],function(idx, name){
	    that.declare(name);
	    that[name] = jsonData[name];
	});
    
    this.contact = jsonData.contactId!==null?flow.getPerson(jsonData.contactId):null;
    this.process = {};
    $.each(jsonData.processId, function(key, idx){
	    var p = flow.getProcess(idx);
	    that.process[p.processTypeId] = p;
	})
    this.customer = flow.getCustomer(jsonData.customerId);
};

flow.inherit(flow.model.Project, flow.model.Model);

/*
  Methods for Person model
*/

flow.model.Person = function(jsonData){
    flow.model.Model.call(this);
    var that = this;
    this.declare('lastName');
    $.each(['firstName','lastName','email','mobile','id','telephone'],function(idx, name){
	    that.declare(name);
	    that[name] = jsonData[name] || "";
	});
    
    that.declare('name');
    function recalcName(name, old){
//	 flow.log('Hours expected has changed from '+ old + ' to ' + that.hoursExpected);
	that.name = that.firstName + " " + that.lastName;
    }
    recalcName();
    this.register('firstName', recalcName);
    this.register('lastName', recalcName);
};

flow.inherit(flow.model.Person, flow.model.Model);

/*
  Methods for Process model
*/

flow.model.Process =function(jsonData){
    flow.model.Model.call(this);
    var that = this;
    this.declare('hoursDone');
    
    $.each(['id', 'url','hoursExpected','done','hoursActual', 'disabled','closed','processTypeId'],function(idx, name){
	    that.declare(name);
	    that[name] = jsonData[name];
	});
    $.each(['startExpected','stopExpected','startActual','stopActual'],function(idx, name){
	    that.declare(name);
	    that[name] = jsonData[name];
	});
    
    that.declare('hoursDone');
    function recalcHours(name, old){
//	 flow.log('Hours expected has changed from '+ old + ' to ' + that.hoursExpected);
	that.hoursDone = Math.floor(Math.min(100,(that.hoursExpected > 0)?(100*that.hoursActual/that.hoursExpected):0));
    }
    recalcHours();
    this.register('hoursExpected', recalcHours);
    
    this.processType = flow.getProcessType(jsonData.processTypetId);
    
};

flow.inherit(flow.model.Process, flow.model.Model);

/*
  Methods for ProcessType model
*/

flow.model.ProcessType = function(jsonData){
    flow.model.Model.call(this);
    var that = this;
    $.each(['id','name'],function(idx, name){
	    that[name] = jsonData[name];
	});
};

flow.inherit(flow.model.ProcessType, flow.model.Model);

/*
  Methods for Customer model
*/

flow.model.Customer = function(jsonData){
    flow.model.Model.call(this);
    var that = this;
    $.each(['id','name','telephone','fax','email','web'],function(idx, name){
	    that.declare(name);
	    that[name] = jsonData[name];
	});
    that.declare('contact');
    that.contact = [];
    
    $.each(jsonData.contactId, function(key, idx){
	    var p = flow.getPerson(idx);
	    that.contact.push(p);
	});
    
    that.declare('visitingAddress');
    var a = flow.getAddress(jsonData.visitingAddressId);
    that.visitingAddress = a;
    
    that.declare('postalAddress');
    var a = flow.getAddress(jsonData.postalAddressId);
    that.postalAddress = a;
    
};

flow.inherit(flow.model.Customer, flow.model.Model);

/*
  Methods for Address model
*/

flow.model.Address = function(jsonData){
    flow.model.Model.call(this);
    var that = this;
    $.each(['id','address1','address2','postalCode','region','country'],function(idx, name){
	    that.declare(name);
	    that[name] = jsonData[name];
	});
    
    that.declare('dom');
    function recalcDom(name, old){
//	 flow.log('Hours expected has changed from '+ old + ' to ' + that.hoursExpected);
	var dom = document.createElement('div');
	$(dom).addClass("address");
	flow.dom.addTextBlock(dom, that.address1);
	if(that.address2)
	    flow.dom.addTextBlock(dom, that.address2);
	flow.dom.addTextBlock(dom, that.postalCode + " " + that.region);
	if(that.country)
	    flow.dom.addTextBlock(dom, that.country);
	
	that.dom = dom;
    }
    recalcDom();
    this.register('address1', recalcDom);
    this.register('address2', recalcDom);
    this.register('postalCode', recalcDom);
    this.register('region', recalcDom);
    this.register('country', recalcDom);
};
    
flow.inherit(flow.model.Address, flow.model.Model);

