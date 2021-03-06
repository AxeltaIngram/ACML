function RB_RuleEditor_High_Temperature_Service (req, resp) {
    
    var reqObject;

    try {
        reqObject = JSON.parse(req.params);
    } catch(e) {
        reqObject = req.params;
    }
  
    if ((tryParse(reqObject.body).sensor_message.dataValue > "22")) {
	  callAlertProvider0();
  }
  
    
    
    function callAlertProvider0 () {
      
        ClearBlade.init({request:req});
        ClearBlade.Code().execute("alert_service", Object.assign({ruleName: 'High_Temperature'}, req.params), true, function (err, body){
            if(err) {
                log("Failure while executing alert_service; " + JSON.stringify(err));
                resp.error(body);
            } else {
                log("Successfully executed alert_service");
                resp.success(body);
            }
        })
    
    }
    
    
    resp.success('Nothing to do');
  }
 
  function tryParse(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
}