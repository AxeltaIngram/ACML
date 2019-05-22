// same as getAlerts except does not filter on is_active
function getAlertHistory(req, resp) {
  var testParams = {
    alert_id:"",  //optional
    type_id:"",  //optional
    configuration_id:"",  //optional
    customer_id:"", 
    pageNum:0,          //optional
    pageSize:0       //optional
  };
  //req.params = testParams;
  
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
      response.payload = data;
    }
    sendResponse();
  };
  var col = ClearBlade.Collection({collectionName:"Alerts"});
  var query = ClearBlade.Query();
  if (typeof req.params.alert_id !="undefined" && req.params.alert_id!="" ){
    query.equalTo("item_id", req.params.alert_id);
  }
  if (typeof req.params.type_id !="undefined" && req.params.type_id!="" ){
    query.equalTo("type_id", req.params.type_id);
  }
  log("config id " +req.params.configuration_id );
  if (typeof req.params.configuration_id !="undefined" && req.params.configuration_id!="" ){
    log(2);
    query.equalTo("configuration_id", req.params.configuration_id);
  }
  if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
    query.equalTo("customer_id", req.params.customer_id);
  }
  if ((typeof req.params.fromTS !="undefined" && req.params.fromTS !="" ) || (typeof req.params.toTS !="undefined" && req.params.toTS !="" )){
    if ((typeof req.params.fromTS !="undefined" && req.params.fromTS !="" ) && (typeof req.params.toTS !="undefined" && req.params.toTS !="" )){
      query.greaterThan("sent_date",req.params.fromTS);
			query.lessThan("sent_date",req.params.toTS);
    }
  }
 // query.setPage(req.params.pageSize, req.params.pageNum);
 //col.fetch(query, callback);
 query.matches("target_users",req.userEmail);
query.setPage(req.params.pageSize, req.params.pageNum);
  
  var fetchedData;
  var count;

  col.fetch(query, function (err, data) {
    fetchedData = data
    log(data)
    if (err) {
      response.error = true;
      response.message = data;
      resp.success(response);
    } else {
      // TOTAL from fetch is just DATA.length, replace it with total that match query
      if(fetchedData && count !== undefined) {
        log("col.fetch is returned..")
        fetchedData.TOTAL = count
        response.payload(data)
        resp.success(response)
      }
    }
  });

  col.count(query, function (err, data) {
    count = data.count
    if (err) {
      response.error = true;
      response.message = data;
      resp.success(response);
    } else {
      if(fetchedData && count !== undefined) {
        fetchedData.TOTAL = count
        log("col.count is returned from here");
        response.payload = fetchedData;
        resp.success(response);
      }
    }
  })
  
}
