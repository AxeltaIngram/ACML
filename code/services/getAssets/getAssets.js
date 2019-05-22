function getAssets(req, resp) {
  var testParams = {
    asset_id:"",  //optional
    zone_id:"",  //optional
    location_id:"",  //optional
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
      response.payload = data;
    }
    sendResponse();
  };

   var options = {
        'uri':"https://ingrammicro.clearblade.com:443/api/v/1/user/info",
        "headers":{"ClearBlade-UserToken" : req.userToken,
                    "ClearBlade-SystemKey": req.systemKey,
                    "ClearBlade-SystemSecret" : req.systemSecret},
    }
    callSwaggerAPI(options)
    .then(function (res) {
         if(typeof res.status !="undefined" && res.status == "success"){
                response.message = "success";
                var apiResult = stringToJSONConveter(res);
               var finalQuery;
                if(apiResult &&  apiResult.assets){
                    var AssetsList = stringToJSONConveter(apiResult.assets);
                    if(AssetsList.length > 0){
                     
                        AssetsList.forEach(function(asset_id) {
                           var query=ClearBlade.Query({collectionName: "Assets"});
                            if(finalQuery !=undefined)
                            {
                              log(asset_id);
                               finalQuery=finalQuery.or(query.equalTo("item_id", asset_id));
                            }else{
                                finalQuery=query.equalTo("item_id", asset_id);
                            }
                        });
                    }
                }
                else{
                    finalQuery=ClearBlade.Query({collectionName: "Assets"});
                    if (typeof req.params.asset_id !="undefined" && req.params.asset_id!="" ){
                         finalQuery.equalTo("item_id", req.params.asset_id);
                        }
                    if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
                        finalQuery.equalTo("customer_id", req.params.customer_id);
                        }
                    if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
                        finalQuery.equalTo("location_id", req.params.location_id);
                        }
                    if (typeof req.params.zone_id !="undefined" && req.params.zone_id!="" ){
                          finalQuery.equalTo("zone_id", req.params.zone_id);
                        }                  
                    }
                // query.setPage(req.params.pageSize, req.params.pageNum);
                // col.fetch(query, callback);
                finalQuery.setPage(req.params.pageSize, req.params.pageNum);
                finalQuery.fetch(callback);
            }
            else{
                response.err =true;
                response.message = JSON.stringify(res);
                resp.error(response)
            }
    },function(reason){
              response.err =true;
                response.message = JSON.stringify(reason);
                resp.error(response)
    });


  // var col = ClearBlade.Collection({collectionName:"Assets"});
  // var query = ClearBlade.Query();
  // if (typeof req.params.asset_id !="undefined" && req.params.asset_id!="" ){
  //   query.equalTo("item_id", req.params.asset_id);
  // }
  // if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
  //   query.equalTo("customer_id", req.params.customer_id);
  // }
  // if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
  //   query.equalTo("location_id", req.params.location_id);
  // }
  //  if (typeof req.params.zone_id !="undefined" && req.params.zone_id!="" ){
  //   query.equalTo("zone_id", req.params.zone_id);
  // }

  // log(query)
  // query.setPage(req.params.pageSize, req.params.pageNum);
  // col.fetch(query, callback);
}
