/*
  A few extra utility functions for dom manipulation
 */
flow.dom = {
     isVisible: function(obj)
     {
	if (obj == document) 
	   return true;
	
	if (!obj || !obj.parentNode) 
	   return false;

	if (obj.style) {
	   if (obj.style.display == 'none' || obj.style.visibility == 'hidden') 
	      return false;
	}
	
	//Try the computed style in a standard way
	if (window.getComputedStyle) {
	   var style = window.getComputedStyle(obj, "");
	   if (style.display == 'none' || style.visibility == 'hidden')
	      return false;
	}
	
	//Or get the computed style using IE's silly proprietary way
	var style = obj.currentStyle;
	if (style) {
	   if (style['display'] == 'none' || style['visibility'] == 'hidden') 
	      return false;
	}
	return flow.dom.isVisible(obj.parentNode);
     },

     isAttached: function(node){
	 while(node.parentNode)
	    node = node.parentNode;
	 return node == document;
      },

     addTextNode: function(parent, text)
     {
	var n = document.createTextNode(text);
	parent.appendChild(n);
	return parent;
     },

     addTextBlock: function(parent, text)
     {
	parent.appendChild(
	   flow.dom.addTextNode(
	      document.createElement('div'), 
	      text));
	return parent;
     },

     clean: function(el){
	 while(el.childNodes.length > 0)
	    el.removeChild(el.childNodes[0]);
      },

     link: function(url, text){
	 var a = document.createElement('a');
	 a.href = url;
	 a.target="_blank";
	 if(typeof text == "object")
	    a.appendChild(text);
	 else
	    flow.dom.addTextNode(a, text);
	 return a;
      },

     image: function(url, className){
	 var a = document.createElement('img');
	 a.src = url;
	 if(className)
	    $(a).addClass(className);
	 return a;
      },

};


