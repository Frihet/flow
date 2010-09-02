
flow.personMap = {
    0: new flow.model.Person({firstName:'Ove',lastName:'Johansson',id:0,email:'root@nasa.gov',mobile:'621 22 243', telephone: '12 23 34 45'}),
    1: new flow.model.Person({firstName:'Torgny',lastName:'Green',id:1,email:'root@torgny.gov',mobile:'92 13 12 23', telephone: '12 23 34 45'}),
    2: new flow.model.Person({firstName:'Efraim',lastName:'Blæcksparre',id:2,email:'root@efraim.no',mobile:'32 32 43 43', telephone: '12 23 34 45'}),
    3: new flow.model.Person({firstName:'Orvar',lastName:'Svensson',id:3,email:'orvar@nasa.gov',mobile:'799 25 349', telephone: '12 23 34 45'}),
    4: new flow.model.Person({firstName:'Tord',lastName:'Sayed',id:4,email:'root@tord.se',mobile:'141 23 421', telephone: '12 23 34 45'}),
    5: new flow.model.Person({firstName:'Konny',lastName:'Beck',id:5,email:'root@konny.se',mobile:'12 43 23 21', telephone: '12 23 34 45'}),
};

flow.addressMap = {
    0: new flow.model.Address({id:0,address1:"Industrigata 49", address2:"", postalCode:"0357", region:"Oslo", country:"Norway"}),
    1: new flow.model.Address({id:1,address1:"Bogstadveien 50", address2:"", postalCode:"0311", region:"Oslo", country:"Norway"}),
    2: new flow.model.Address({id:2,address1:"Slemdalsveien 7", address2:"", postalCode:"0337", region:"Oslo", country:"Norway"}),
    3: new flow.model.Address({id:3,address1:"Slemdalsveien 7", address2:"", postalCode:"0337", region:"Oslo", country:"Norway"}),
};

flow.processMap = {
    0: new flow.model.Process({id:0, url:'http://www.dn.se',hoursDone:10,hoursActual:5, hoursExpected: 6, disabled:false, closed:false, processTypeId: 0, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    1: new flow.model.Process({id:1, url:'http://www.svd.se',hoursDone:null,hoursActual:3, hoursExpected: 1, disabled:false, closed:true, processTypeId: 0, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    2: new flow.model.Process({id:2, url:'http://www.vg.no',hoursDone:null,hoursActual:20, hoursExpected: 40, disabled:false, closed:false, processTypeId: 0, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),

    3: new flow.model.Process({id:3, url:'http://www.svd.se',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:false, processTypeId: 1, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    4: new flow.model.Process({id:4, url:'http://www.dn.se',hoursDone:60,hoursActual:40, hoursExpected: 50, disabled:false, closed:true, processTypeId: 1, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    5: new flow.model.Process({id:5, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 40, disabled:false, closed:false, processTypeId: 1, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),

    6: new flow.model.Process({id:6, url:'http://www.svd.se',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:false, processTypeId: 2, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    7: new flow.model.Process({id:7, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:true, processTypeId: 2, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    8: new flow.model.Process({id:8, url:'',hoursDone:null,hoursActual:40, hoursExpected: 40, disabled:false, closed:false, processTypeId: 2, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),

    9: new flow.model.Process({id:9, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:false, processTypeId: 3, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    10: new flow.model.Process({id:10, url:'http://www.svd.se',hoursDone:30,hoursActual:40, hoursExpected: 50, disabled:false, closed:true, processTypeId: 3, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    11: new flow.model.Process({id:11, url:'',hoursDone:null,hoursActual:40, hoursExpected: 40, disabled:false, closed:false, processTypeId: 3, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),

    12: new flow.model.Process({id:12, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 450, disabled:false, closed:false, processTypeId: 4, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    13: new flow.model.Process({id:13, url:'http://www.dn.se',hoursDone:null,hoursActual:80, hoursExpected: 300, disabled:false, closed:true, processTypeId: 4, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    14: new flow.model.Process({id:14, url:'http://www.svd.se',hoursDone:null,hoursActual:10, hoursExpected: 400, disabled:false, closed:false, processTypeId: 4, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),

    15: new flow.model.Process({id:15, url:'',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:false, processTypeId: 5, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    16: new flow.model.Process({id:16, url:'http://www.dn.se',hoursDone:40,hoursActual:40, hoursExpected: 50, disabled:false, closed:true, processTypeId: 5, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    17: new flow.model.Process({id:17, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 40, disabled:false, closed:false, processTypeId: 5, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),


    18: new flow.model.Process({id:18, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:false, processTypeId: 6, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    19: new flow.model.Process({id:19, url:'',hoursDone:40,hoursActual:40, hoursExpected: 50, disabled:false, closed:true, processTypeId: 6, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    20: new flow.model.Process({id:20, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 40, disabled:false, closed:false, processTypeId: 6, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),


    21: new flow.model.Process({id:21, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 50, disabled:false, closed:false, processTypeId: 7, startExpected:'2009-12-14', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),
    22: new flow.model.Process({id:22, url:'http://www.dn.se',hoursDone:40,hoursActual:40, hoursExpected: 50, disabled:false, closed:true, processTypeId: 7, startExpected:'2009-12-10', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:'2010-03-12'}),
    23: new flow.model.Process({id:23, url:'http://www.dn.se',hoursDone:null,hoursActual:40, hoursExpected: 40, disabled:false, closed:false, processTypeId: 7, startExpected:'2010-06-01', stopExpected:'2010-12-10', startActual:'2009-12-15', stopActual:null}),

};
  
flow.processTypeMap = {
    0: new flow.model.ProcessType({id: 0, name:'Pie eating'}),
    1: new flow.model.ProcessType({id: 1, name:'Contract negotiation'}),
    2: new flow.model.ProcessType({id: 2, name:'Signing'}),
    3: new flow.model.ProcessType({id: 3, name:'Resource allocation'}),
    4: new flow.model.ProcessType({id: 4, name:'Work'}),
    5: new flow.model.ProcessType({id: 5, name:'Meetings'}),
    6: new flow.model.ProcessType({id: 6, name:'QA'}),
    7: new flow.model.ProcessType({id: 6, name:'Customer followup'}),
};

flow.customerMap = {
    0: new flow.model.Customer({id:0,name:'FreeCode',contactId:[0,1,3], visitingAddressId: 0, postalAddressId:1, telephone:"24 65 54 13", fax: "", email:"sales@freecode.no", web:"http://www.freecode.no"}),
    1: new flow.model.Customer({id:1,name:'Zambo',contactId:[2,4,5], visitingAddressId: 2, postalAddressId:3, telephone:"14 25 14 12", fax: "12 25 14 13", email:"sales@zambo.com", web:"http://www.zambo.com"}),
};

flow.projectMap = {
    0: new flow.model.Project({name:'FreeTIL',customerId:0,id:0,contactId:0,processId:[0,3,6,9,12,15,18,21], value: 0,closeChance:0 }),
    1: new flow.model.Project({name:'FreeFlow',customerId:0,id:1,contactId:1,processId:[1,4,7,10,13,16,19,22],value:0,closeChance:0 }),
    2: new flow.model.Project({name:'Zamboni',customerId:1,id:2,contactId:2,processId:[2,5,8,11,14,17,20,23],value:400000,closeChance:100}),
};


flow.projectTypeMap = {
    0: {id:0,name:'Div4a'},
    1: {id:1,name:'Div4a'},
    2: {id:2,name:'Div4a'},
    3: {id:3,name:'Div4a'},
    4: {id:4,name:'Div4a'},
    5: {id:5,name:'Div4a'},
    6: {id:6,name:'Div4a'},
};

flow.customerTypeMap = {
    0: {id:0,name:'1: Prospect'},
    1: {id:1,name:'2: Active'},
    2: {id:2,name:'3: Reference'},
    3: {id:3,name:'4: Inactive'},
    4: {id:4,name:'5: Bancrupcy'},
    5: {id:5,name:'6: No contact'},
};

