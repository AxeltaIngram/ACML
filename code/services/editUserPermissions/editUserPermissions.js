var DevToken = "8cbzirb3rhv_o4p97Z08lFr740kXLdZ0jsNo_uhZHqQOCG9jAGyVcuBdDWFjnqul1iEC9PoCVFnks7LtQQ==";
var systemKey = "";
function editUserPermissions(req, resp) {
  log("systemKey " + req.systemKey);
  systemKey = req.systemKey
  var testParams = {
    userEmailId:"",  
	permissions :{}
  };
  
  ClearBlade.init({request:req});
  var response = {
    err:false,
    message:"",
    payload:{}
  }
  var sendResponse = function() {
    resp.success(response)
  }
  var user = ClearBlade.User();
  var query = ClearBlade.Query();
  
  if (typeof req.params.userEmailId !="undefined" && req.params.userEmailId!="" && typeof req.params.permissions !="undefined" && req.params.permissions !=""  ){
    query.equalTo("email", req.params.userEmailId);
	user.allUsers(query, function(err, data) {
		var user_id = data.Data[0].user_id;
		if(typeof user_id != "undefined"){
			var changes ={}
			changes.changes = stringToJSONConveter(req.params.permissions);
			changes.user = user_id; 
			log("changes  >>  "+ JSON.stringify(changes));
			var requestObject = Requests();
			var options = {
				'uri':"https://ingrammicro.clearblade.com:443/admin/user/"+systemKey,
				"body": changes,
				"headers":{"ClearBlade-DevToken" : DevToken}
			}
			// var res = callSwaggerAPI(options);
			 callSwaggerAPI(options)
			 .then(function (res) {
				 log("Response >>> "+JSON.stringify(res));
					if(typeof res.status !="undefined" && res.status == "success"){
						response.message = "success";
					}
					else{
						response.err =true;
						response.message = JSON.stringify(res);
					}
					sendResponse();
			 }
			 , function (reason) {
						deferred.reject(reason); 
						response.err =true;
						response.message = JSON.stringify(res);
						sendResponse();
				});			
		}    
	});
  }
  else{
	response.payload = "Invalid Params ";
	sendResponse();
  }
 
}
