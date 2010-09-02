/**
   This code is for setting up something that is essentially a
   modeless dialog on the top half of the screen. These dialogs are
   created in response to focus changes in the grid on the lower half
   of the screen.
 */

flow.dialog = 
{
}
    ;


/*
  Methods for Dialog
*/

flow.dialog.Dialog = function(model, controller){
    this.model=model;
    this.controller = controller;
};

flow.dialog.Dialog.prototype.columnCreate = function()
{
   var res = document.createElement("table");
   $(res).addClass("dialog_column");
   res.addRow = function(name, node, labelId){
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      if(!labelId)
      {
	 labelId = node.id;
      }

      if(labelId) 
      {
	 var label = document.createElement("label");
	 label.htmlFor = labelId;
	 $(label).text(name);
	 th.appendChild(label);
      }
      else{
	 $(th).text(name);
      }
      tr.appendChild(th);
      tr.appendChild(node);
      this.appendChild(tr);
   };

   return res;
};



/*
  Methods for Process dialog
*/

flow.dialog.Process = function(model, controller, parent){
    flow.dialog.Dialog.call(this, model, controller);
    this.domNodeCreate(parent);
};


flow.inherit(flow.dialog.Process, flow.dialog.Dialog);

flow.dialog.Process.prototype.contactColumnCreate = function()
{
   var col = this.columnCreate();
/*   col.addRow(_("Telephone"), flow.electric.electricInput(this.model.customer, "telephone", "text"));
   col.addRow(_("Fax"), flow.electric.electricInput(this.model.customer, "fax", "text"));
   col.addRow(_("email"), flow.electric.electricInput(this.model.customer, "email", "text"));
*/
   col.addRow(_("Url"), flow.electric.electricInput(this.getProcess(), "url", "text"));
   this.domNode.appendChild(col);
};

flow.dialog.Process.prototype.getProcess = function(parent)
{
   return this.model.process[this.controller.processType.id];
};



flow.dialog.Process.prototype.domNodeCreate = function(parent)
{
   var that = this;
   var process = this.getProcess();
   that.domNode = document.createElement('span');

   var col1 = this.columnCreate();
   
   var head = document.createElement('tr');
   $.each(['', _('Expected'),_('Actual'),_('Done (%)')], function(idx, text){
	 var it = document.createElement('th');
	 it.appendChild(flow.textNode(text));
	 head.appendChild(it);
      });
   col1.appendChild(head);
   $.each([{field:'hours',description:_('Hours'), type:null},
	   {field:'start',description:_('Start'), type:'date'},
	   {field:'stop',description:_('Stop'), type:'date'}], function(idx, data){
	     var row = document.createElement('tr');
	     
	     var it = document.createElement('th');
	     it.appendChild(flow.textNode(data.description));
	     row.appendChild(it);
	     
	     it = document.createElement('td');
	     var fieldName = data.field + "Expected";
	     it.appendChild(flow.electric.electricInput(process, fieldName, data.type));
	     row.appendChild(it);
	     that.domNode.appendChild(row);
	     
	     it = document.createElement('td');
	     var fieldName = data.field + "Actual";
	     it.appendChild(flow.textNode(process[fieldName]));
	     row.appendChild(it);
	     that.domNode.appendChild(row);
	     
	     it = document.createElement('td');
	     var fieldName = data.field + "Done";
	     if( fieldName in process) {
		it.appendChild(flow.electric.electricLabel(process,fieldName));
	     }
	     row.appendChild(it);
	     col1.appendChild(row);
	     
	  });

   that.domNode.appendChild(col1);
   that.contactColumnCreate();
/*
  var it = document.createElement('th');
  it.appendChild(flow.textNode(_('URL')));
*/

   
   parent.appendChild(that.domNode);

}

/*
  Methods for Customer dialog
*/

flow.dialog.Customer= function(model, controller, parent){
    flow.dialog.Dialog.call(this, model, controller);
    this.domNodeCreate(parent);
};


flow.inherit(flow.dialog.Customer, flow.dialog.Dialog);

flow.dialog.Customer.prototype.addressColumnCreate = function(name, field)
{
   var col = this.columnCreate();
   col.addRow(name, flow.electric.electricInput(this.model.customer[field], "address1", "address_input"));
   col.addRow("", flow.electric.electricInput(this.model.customer[field], "address2", "address_input"));
   var region = document.createElement("div");
   $(region).addClass('address_input');
   region.appendChild(flow.electric.electricInput(this.model.customer[field], "postalCode", "address_input postal_code"));
   region.appendChild(flow.electric.electricInput(this.model.customer[field], "region", "address_input region"));
   col.addRow("", region);

   col.addRow("", flow.electric.electricInput(this.model.customer[field], "country", "address_input"));
   this.domNode.appendChild(col);
};

flow.dialog.Customer.prototype.contactColumnCreate = function(name, field)
{
   var col = this.columnCreate();
   col.addRow(_("Telephone"), flow.electric.electricInput(this.model.customer, "telephone", "text"));
   col.addRow(_("Fax"), flow.electric.electricInput(this.model.customer, "fax", "text"));
   col.addRow(_("Email"), flow.electric.electricInput(this.model.customer, "email", "text"));
   col.addRow(_("Web"), flow.electric.electricInput(this.model.customer, "web", "text"));
   this.domNode.appendChild(col);
};

flow.dialog.Customer.prototype.domNodeCreate = function(parent)
{
   var that = this;
   that.domNode = document.createElement('span');

   var col1 = this.columnCreate();
   col1.addRow(_("Name"), flow.electric.electricInput(this.model.customer, "name", "text"));
   that.domNode.appendChild(col1);
   
   this.addressColumnCreate(_("Visiting address"),"visitingAddress");
   this.addressColumnCreate(_("Postal address"),"postalAddress");

   this.contactColumnCreate();
   
   var contactControllerList = [
      new flow.controller.Label(_("Contacts"), 'name',{dialog:flow.dialog.Person}),
       ];
   
   this.contactArea = document.createElement('span');
   that.domNode.appendChild(this.contactArea);
   
   var addContact = document.createElement('span');
   that.domNode.appendChild(addContact);
   var acb = document.createElement('button');
   flow.dom.addTextNode(acb,'+');
   acb.type='button';
   $(acb).click(function(ev){
	   that.model.customer.contact.push(new flow.model.Person({}));
       });
   addContact.appendChild(acb);

   var rcb = document.createElement('button');
   flow.dom.addTextNode(rcb,'-');
   rcb.type='button';
   addContact.appendChild(rcb);

   this.contactDialogArea = document.createElement('span');
   that.domNode.appendChild(this.contactDialogArea);
    
   parent.appendChild(that.domNode);
   this.contactList = new flow.DynamicTable(
       contactControllerList,
       this.model.customer.contact,
       this.contactArea,
       this.contactDialogArea,
{className:'dialog_column',dnd:true});

   $(rcb).click(function(ev){
	   that.model.customer.contact.removeItem(that.contactList.getSelectedModel());
       });
   
//   that.domNode.appendChild(this.contactList.domNode);

};

/*
  Methods for Project dialog
*/

flow.dialog.Project = function(model, controller, parent){
    flow.dialog.Dialog.call(this, model, controller);
    this.domNodeCreate(parent);
};

flow.inherit(flow.dialog.Project, flow.dialog.Dialog);


flow.dialog.Project.prototype.overviewColumnCreate = function(name, field)
{
   var col = this.columnCreate();
   col.addRow(_("Name"), flow.electric.electricInput(this.model, "name", "text"));
/*   col.addRow(_("Fax"), flow.electric.electricInput(this.model.customer, "fax", "text"));
   col.addRow(_("Email"), flow.electric.electricInput(this.model.customer, "email", "text"));
   col.addRow(_("Web"), flow.electric.electricInput(this.model.customer, "web", "text"));
*/
   this.domNode.appendChild(col);
};

flow.dialog.Project.prototype.salesColumnCreate = function(name, field)
{
   var col = this.columnCreate();
   col.addRow(_("Value"), flow.electric.electricInput(this.model, "value", "text"));
   col.addRow(_("Close chance"), flow.electric.electricInput(this.model, "closeChance", "text"));
/*   col.addRow(_("Fax"), flow.electric.electricInput(this.model.customer, "fax", "text"));
   col.addRow(_("Email"), flow.electric.electricInput(this.model.customer, "email", "text"));
   col.addRow(_("Web"), flow.electric.electricInput(this.model.customer, "web", "text"));
*/
   this.domNode.appendChild(col);
};

flow.dialog.Project.prototype.domNodeCreate = function(parent)
{
   var that = this;
   that.domNode = document.createElement('span');

   this.overviewColumnCreate();
   this.salesColumnCreate();

   parent.appendChild(that.domNode);
};

/*
  Methods for Person dialog
*/

flow.dialog.Person = function(model, controller, parent){
    flow.dialog.Dialog.call(this, model, controller);
    this.domNodeCreate(parent);
};

flow.inherit(flow.dialog.Person, flow.dialog.Dialog);

flow.dialog.Person.prototype.overviewColumnCreate = function()
{
   var col = this.columnCreate();
   
   var region = document.createElement("div");
   $(region).addClass('name_input');
   region.appendChild(flow.electric.electricInput(this.model, "firstName", "name_input first_name"));
   region.appendChild(flow.electric.electricInput(this.model, "lastName", "name_input last_name"));
   col.addRow(_("Name"), region);
   col.addRow(_("Telephone"), flow.electric.electricInput(this.model, "telephone", "text"));
   col.addRow(_("Mobile"), flow.electric.electricInput(this.model, "mobile", "text"));
   col.addRow(_("Email"), flow.electric.electricInput(this.model, "email", "text"));
   
/*
   col.addRow(_("Email"), flow.electric.electricInput(this.model.customer, "email", "text"));
   col.addRow(_("Web"), flow.electric.electricInput(this.model.customer, "web", "text"));
*/
   this.domNode.appendChild(col);
};

flow.dialog.Person.prototype.domNodeCreate = function(parent)
{
   var that = this;
   that.domNode = document.createElement('span');
   
   this.overviewColumnCreate();
   
   parent.appendChild(that.domNode);
};

