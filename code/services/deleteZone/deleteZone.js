function deleteZone(req, resp) {
 var testParams = {
    zone_id:"d311654a-e5fe-4c46-8ac1-6e18e0acdd72"
  };
  // req.params = testParams;
  ClearBlade.init({request:req});
  
  var response = {
    err:false,
    message:"",
    payload:{}
  }

  var sendResponse = function() {
    resp.success(response)
  }

  var query = ClearBlade.Query();
  query.equalTo('item_id', req.params.zone_id);
  
  var callback = function (err, data) {
      if (err) {
        	response.err= true;
          response.message = data;
        } else {
        	response.payload=data;
        }
        sendResponse();
  };

  var col = ClearBlade.Collection({collectionName:"Zones"});
  col.remove(query, callback);
}
