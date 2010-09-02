flow.electric = {
    anonymousId:0,
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
      el.id = "flow_electric_" + flow.electric.anonymousId++;
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

  electricList: function(model, name, param)
  {
      var that=this;
      var el = document.createElement('table');
      $(el).addClass('electric');
      el.name = name;
      el.model = model;
      el.param = param;
      
      el.repaint = function ()
      {
	  flow.dom.clean(el);
      }
      
      function onChange(name, old){
	  el.repaint();
      }
      model.register(name,onChange);
      el.repaint();	

      return el;
  }
  
}
  
