/**
   This will get replaced with a gettext translation call in the future. 
 */
function _(str)
{
    return str;
}
/*
  Todo: There are a bunch of utility functions in the flow namespace
  that should probably be moved off to some subnamespace...
 */

var flow = {
  saveQueue:[],
  personMap:{},
  projectMap:{},
  customerMap:{},
  processMap:{},
  processTypeMap:{},
  projectTypeMap:{},
  customerTypeMap:{},
  log: function(obj){
      if(window.console && window.console.log){
	 window.console.log(obj);
      }
   },

  format: {

     pad: function(v, length, filler)
     {
	var r = "" + v;
	if(r.length < length)
	{
	   return flow.format.pad(r + filler, length, filler);
	}
	return r;
     },
     numeric: function(v){
/*	 if(v < 0)
	 {
	    return '-' + flow.format.numeric(-v);
	 }
	 if(v == 0)
	 {
	    return '-':
	    }*/
	 if(v < 1000){
	     return "" + v;
	 }
	 else
	 {
	     return flow.format.numeric(Math.floor(v/1000)) + " " + flow.format.pad(v % 1000, 3, '0');
	 }
      },
  },

  init: function()
  {

     if(window.localStorage != undefined){
	flow.storage = window.localStorage;
     }
     else if(window.globalStorage != undefined)
     {
	flow.storage = window.globalStorage[location.hostname];
     }
     else
     {
	flow.log("Warning: No local storage found. Session settings will not be saved!");
	flow.storage = {}
     }
     
     Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
	  if (obj.hasOwnProperty(key)) size++;
	}
	return size;
     };

  },

  state:{
     get: function(name, def){
	 var txt=flow.storage["no.freecode.flow."+name];
	 if(txt)
	    return JSON.parse(flow.storage["no.freecode.flow."+name]);
	 return def;
      },
     set: function(name, value){
	 flow.storage["no.freecode.flow."+name] = JSON.stringify(value);
      },
  },
  
  event: {
     keyCode:{
	UP:38, LEFT:37, RIGHT: 39, DOWN:40, ESCAPE:27, ENTER: 13
     }
  },
  
  inherit: function(child, parent){
	child.prototype = new parent;
	child.prototype.constructor = child;
    },

  textNode: function(text){
	var res = document.createElement('span');
	$(res).text(text);
	return res;
    },

  electric: {
     electricInput: function(model, name, type)
     {
	var that=this;
	var el = document.createElement('input');
	$(el).addClass('electric');
	if(type) {
	   $(el).addClass(type);
	}
	el.name = name;
	el.model = model;
	el.value = model[name]
	var isChanging = false;
	
	$(el).change(function(event){
/*	      flow.log("Wee, an electric input on field " + name + " of model");
	      flow.log(model);
	      flow.log("has changed");
*/
	      isChanging = true;
	      model[name] = el.value;
	      isChanging = false;
	   });
	
	
	function onChange(name, old){
/*	   if(!flow.dom.isAttached(el)){
	      model.unregister(onChange);
	      return;
	      }*/
	   if(!isChanging){
	      el.value = model[name];
	   }
	   else{
	   }
	};
	model.register(name, onChange);
     
	return el;
     },

     electricLabel: function(model, name)
     {
	var that=this;
	var el = document.createElement('span');
	$(el).addClass('electric');
	el.name = name;
	el.model = model;

	function set(value)
	{
	   var value = el.model[el.name];
	   if(typeof value == "object"){
	      el.appendChild(value.cloneNode(true));
	   }
	   else {
	      $(el).text(value);
	   }
	}
	
	function onChange(name, old){
/*	   if(!flow.dom.isAttached(el)){
	      model.unregister(onChange);
	      return;
	      }*/
	   set();
	}
	model.register(name,onChange);
	set();
	
	return el;
     },

  },
  
  saveItem: function(key, value){
      var item = {
	 "id": flow.saveQueue.length,
	 "url": url,
	 "operation": 'save',
	 "key": key,
	 "value": value
      };
      flow.saveQueue.push(item);
   },
  
  loadItem: function(key, callback){
      var item = {
	 "id": flow.saveQueue.length,
	 "url": url,
	 "operation": 'load',
	 "key": key,
	 'callback': callback
      };
      flow.saveQueue.push(item);
   },
  
  getPerson: function(id){
      return flow.personMap[id];
   },
  
  getProject: function(id){
      return flow.projectMap[id];
   },
  
  getCustomer: function(id){
      return flow.customerMap[id];
   },
  
  getAddress: function(id){
      return flow.addressMap[id];
   },
  
  getProcess: function(id){
      return flow.processMap[id];
   },
  
  getProcessType: function(id){
      return flow.processTypeMap[id];
    },

  getProcessControllerList: function(){
	/*
	  Random crappy placeholder data. Should really be loaded
	  dynamically from the server.
	 */
	var customer = new flow.controller.Label(_("Customer"), 'customer.name', {groupName:'customer',dialog:flow.dialog.Customer});
	var project = new flow.controller.Label(
	    _("Project"), 
	    'name',
            {groupName:'project', dialog:flow.dialog.Project});
	var div2 = new flow.controller.Controller(
	    _("Div2"),
            {groupName: 'div2',virtual:true});
	var div4 = new flow.controller.Controller(
	    _("Div4"), {groupName: 'div4',virtual:true});
	var div5 = new flow.controller.Controller(
	    _("Div5"), {groupName: 'div5',virtual:true});
	
	var projectContact = new flow.controller.Label(
	    _("Project Contact"), 
	    'contact.name',
	    {
	      groupName:'project_contact',
	      groupParent: project,
	      dialogField:'contact',
	      dialog:flow.dialog.Person});

      return [
	  customer,
	  new flow.controller.Label(_("Visiting address"), 'customer.visitingAddress.dom',{groupParent:customer}),
	  new flow.controller.Label(_("Postal address"), 'customer.postalAddress.dom',{groupParent:customer}),
	  new flow.controller.Label(_("Telephone"), 'customer.telephone',{groupParent:customer}),	
	  new flow.controller.Label(_("Fax"), 'customer.fax',{groupParent:customer}),	
	  new flow.controller.Label(_("Email"), 'customer.email',{groupParent:customer}),	
	  new flow.controller.Label(_("Web"), 'customer.web',{groupParent:customer, url:true}),	
	  project,
	  new flow.controller.Label(_("Value"), 'value',{groupParent:project, type:'numeric'}),	
	  projectContact,
	  new flow.controller.Label(_("Email"), 'contact.email',{groupParent:projectContact}),	
	  new flow.controller.Label(_("Mobile"), 'contact.mobile',{groupParent:projectContact}),
	  div2,
	  new flow.controller.Process(
	      flow.getProcessType(0),{dialog:flow.dialog.Process, groupParent:div2}),
	  new flow.controller.Process(
	      flow.getProcessType(1),{dialog:flow.dialog.Process,groupParent:div2}),
	  new flow.controller.Process(
	      flow.getProcessType(2),{dialog:flow.dialog.Process,groupParent:div2}),
	  div4,
	  new flow.controller.Process(
	      flow.getProcessType(3),{dialog:flow.dialog.Process,groupParent:div4}),
	  new flow.controller.Process(
	      flow.getProcessType(4),{dialog:flow.dialog.Process,groupParent:div4}),
	  new flow.controller.Process(
	      flow.getProcessType(5),{dialog:flow.dialog.Process,groupParent:div4}),
	  div5,
	  new flow.controller.Process(
	      flow.getProcessType(6),{dialog:flow.dialog.Process,groupParent:div5}),
	  new flow.controller.Process(
	      flow.getProcessType(7),{dialog:flow.dialog.Process,groupParent:div5}),
	  ];
    },

  getProjectList: function()
  {
      var res = new flow.model.Model();
      res.declare('project');
      res.project=[];
      
      flow.log(this.projectMap);
      
      $.each(this.projectMap, function(idx, val)
{
    res.project.push(val);
}
	  );
      
      return res.project;
      
  },
  
  
};

flow.init();
