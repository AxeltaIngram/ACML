function getTestHistory(req, resp) {
  ClearBlade.init({request:req});
  var reqObj = req.params;
  var finalObj ={"Method": "getTestHistory"};
  var cusQuery = ClearBlade.Query({collectionName:"Customers"});
  if (typeof reqObj.customer_id !=="undefined" ){
    cusQuery.equalTo("item_id",reqObj.customer_id);
  }
  processQuery(cusQuery).then(function (customers_data) {
    buildTestHistoryData(customers_data).then(function(DATA){
      finalObj.DATA = DATA;
      resp.success(finalObj);
    }, 
    function (reason) {
        resp.error("Data Fetching Error : "+JSON.stringify(reason) );
    });
  }, 
  function (reason) {
      resp.error("Customer data fetching error : "+JSON.stringify(reason) );
  });
}
/**
 * @typedef buildTestHistoryData
 * @param {object} customers_data -  Customers Data from customers table
 * @returns -- promise object 
 */


function buildTestHistoryData(customers_data){
  var deferred = Q.defer();
    var Data =[];
    var itr =1;
    customers_data.DATA.forEach(function(cus_data){ 
      var customer_id = cus_data.item_id;
      var customer_name = cus_data.name;
      log("customer_name "+customer_name); 
        var cuslocQuery = ClearBlade.Query({collectionName:"Locations"});
        cuslocQuery.equalTo("customer_id",customer_id);
        processQuery(cuslocQuery).then(function (loctions_data) {
          loctions_data.DATA.forEach(function(loc_data){
            log("location "+customer_id);
            var location_id = loc_data.item_id;
            var testJson = {};
            testJson.customer_name = customer_name;
            testJson.customer_name = customer_name;
            Data.push(testJson); 
          });
          
        }, 
        function (reason) {
            resp.error("Customer Locations data fetching error : "+JSON.stringify(reason) );
            deferred.reject(reason);
        });   
      itr++;
    });
    if((customers_data.DATA).length < itr){
      deferred.resolve(Data);
    }
  return deferred.promise;
}