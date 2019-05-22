function getCustomers(req, resp) {
  var testParams = {
    customer_id:"",  //optional
    pageNum:0,          //optional
    pageSize:0       //optional
  };
  // req.params = testParams;
  log(req);
  if (typeof req.params.pageNum =="undefined" ){
    req.params.pageNum=0;
  }
  if (typeof req.params.pageSize =="undefined" ){
    req.params.pageSize=0;
  }
  ClearBlade.init({request:req});
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {	
      response.err= true;
      response.message = data;
    } else {
     // response.payload = data;
       var finalResObj=data.DATA;
      if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
                 var custAry=req.params.customer_id;
        finalResObj=finalResObj.filter(function(curCustomer){ return custAry.indexOf(curCustomer.item_id)>-1});
          }
      response.payload = {"DATA":finalResObj};
    }
    sendResponse();
  };
  var col = ClearBlade.Collection({collectionName:"Customers"});
  var query = ClearBlade.Query();
  // if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
  //   query.equalTo("item_id", req.params.customer_id);
  // }
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);

  
  
}
