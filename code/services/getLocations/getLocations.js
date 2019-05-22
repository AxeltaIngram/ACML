// function getLocations(req, resp) {
function getLocations(req, resp) {
  var testParams = {
    location_id:"",  //optional
    customer_id:"2843b40d-b3e5-4f4c-9f5f-9ac8d2709ec8", //optional
    pageNum:0,          //optional
    pageSize:0       //optional
  };
  // req.params = testParams;
 //log(req);
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
     //   log(response);
        resp.success(response)
    }
    var callback = function (err, data) {
        if (err) {  
          response.err= true;
          response.message = data;
        } else {
            console.log(data);
          response.payload = data;
        }
        sendResponse();
    };
    var options = {
        'uri':"https://ingrammicro.clearblade.com:443/api/v/1/user/info",
        "headers":{"ClearBlade-UserToken" : req.userToken,
                    "ClearBlade-SystemKey": req.systemKey,
                    "ClearBlade-SystemSecret" : req.systemSecret}
    }
    callSwaggerAPI(options)
    .then(function (res) {
            if(typeof res.status !="undefined" && res.status == "success"){
                response.message = "success";
                //var col = ClearBlade.Collection({collectionName:"Locations"});
                var apiResult = stringToJSONConveter(res);
                //var query = ClearBlade.Query();
                var finalQuery;
                if(apiResult &&  apiResult.locations){
                    var LocationsList = stringToJSONConveter(apiResult.locations);
                    if(LocationsList.length > 0){
                          LocationsList.forEach(function(location_id) {
                            var query=ClearBlade.Query({collectionName: "Locations"});
                            //query.equalTo("item_id", location_id);
                             if(finalQuery !=undefined)
                            {
                               finalQuery=finalQuery.or(query.equalTo("item_id", location_id));
                            }else{
                                finalQuery=query.equalTo("item_id", location_id);
                            }
                          });
                    }
                }
                else{
                     finalQuery=ClearBlade.Query({collectionName: "Locations"});
                    if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
                        finalQuery.equalTo("item_id", req.params.location_id);
                    }
                    if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
                        finalQuery.equalTo("customer_id", req.params.customer_id);
                    }  

                    // if (typeof req.params.location_id !="undefined" && req.params.location_id!="" ){
                    //     query.equalTo("item_id", req.params.location_id);
                    // }
                    // if (typeof req.params.customer_id !="undefined" && req.params.customer_id!="" ){
                    //     query.equalTo("customer_id", req.params.customer_id);
                    // }                    
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
    }
     , function (reason) {
                response.err =true;
                response.message = JSON.stringify(reason);
                resp.error(response)
    }); 
}
