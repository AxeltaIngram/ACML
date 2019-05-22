function updateZone(req, resp) {
  var testParams = {
    zone_id:"427bc245-2dee-4020-85b0-fb56d7e148da",
    zone:{
      "name": "Bobs Refrigerator9",
      "location_id": "99999"
    },
  };
  log("prams >> "+JSON.stringify(req.params) );
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
  col.update(query, req.params.zone, callback);
}
