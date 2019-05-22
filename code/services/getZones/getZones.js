function getZones(req, resp) {
 var testParams = {
    zone_id:"",  //optional
    location_id:"",  //optional
    pageNum:0,          //optional
    pageSize:0       //optional
  };
  // req.params = testParams;
  
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
  var col = ClearBlade.Collection({collectionName:"Zones"});
  var query = ClearBlade.Query();
  if (typeof req.params.zone_id !="undefined" && req.params.zone_id!="" ){
    query.equalTo("item_id", req.params.zone_id);
  }
  if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
    query.equalTo("location_id", req.params.location_id);
  }
  log(query)
  query.setPage(req.params.pageSize, req.params.pageNum);
  col.fetch(query, callback);
}
