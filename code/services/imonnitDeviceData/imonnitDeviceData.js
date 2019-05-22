var devicesTable="devices_metadata";
var gatewaysTable="gateways_data";
var sensorsTable="sensors_data";

var _resp, _req,reqObj,sensorObj,gatewayObj;

function imonnitDeviceData(req, resp) {

    ClearBlade.init({request:req});
    _resp=resp;
    _req=req;

    var d=new Date();
   
    log("Adapter Msg: "+req.params.body);

    reqObj=JSON.parse(req.params.body); //need to add JSON.parse
    //reqObj = req.params.body ;  /// for testing

    log("Adapter Msg: "+reqObj);

    gatewayObj=reqObj.gateway_message;
    sensorObj=reqObj.sensor_message;
	
    log("Sensor value "+sensorObj.sensorID);

    var gatewayMsgObj={
       "gateway_id":parseInt(gatewayObj.gatewayID),
       "network_id":parseFloat(gatewayObj.networkID),
       "gateway_name":gatewayObj.gatewayName,
       "battery_level":parseInt(gatewayObj.batteryLevel),
       "signal_strength":parseInt(gatewayObj.signalStrength),
       "reading_date":gatewayObj.date
    };
    var sensorMsgObj={
       "sensor_id":parseInt(sensorObj.sensorID),
       "sensor_name":sensorObj.sensorName,
       "sensor_reading":sensorObj.dataValue,
       "battery_level":parseInt(sensorObj.batteryLevel),
       "signal_strength":parseInt(sensorObj.signalStrength),
       "reading_time":sensorObj.messageDate
    };
   
    createNewDevice("devices_metadata",reqObj);
    createRecord(gatewaysTable,gatewayMsgObj);
    createRecord(sensorsTable,sensorMsgObj);

    _resp.success("success");
}  

function createNewDevice(collectionName,deviceObj){

	var networkId,gatewayId,sensorId; 

	networkId=deviceObj.gateway_message.networkID;
	gatewayId=deviceObj.gateway_message.gatewayID;
	sensorId=deviceObj.sensor_message.sensorID;

    log(networkId+" "+gatewayId+" "+sensorId);

	var query = ClearBlade.Query({collectionName: collectionName});
	query.equalTo("network_id", deviceObj.gateway_message.networkID);
    query.fetch(deviceCallBack);
    
    //query.fetch(statusCallBack);
	//query.columns(["network_id", "gateway_id", "sensors"]);
}

//Create a record
function createRecord(tbl, values) {
    var col = ClearBlade.Collection( {collectionName: tbl } );
    col.create(values, statusCallBack);
}

//add new gateways and networks
function createGateways(){
    var networkUUID;
    var codeEngine = ClearBlade.Code();
	var serviceToCall = "UUIDgenerator";
	var loggingEnabled = true;
	var params = {
  "network_ID": parseInt(gatewayObj.networkID)
};
codeEngine.execute(serviceToCall, params, loggingEnabled, function(err, data){
		if(err){
			_resp.error("Failed to complete my service: " + JSON.stringify(data))
		}else{
         networkUUID=JSON.parse(data).results;
        }
	});

var newDeviceObj={
            "network_id":parseInt(gatewayObj.networkID),
            "network_uuid":networkUUID,
            "gateway_id":parseInt(gatewayObj.gatewayID),
            "sensors":JSON.stringify({"sensorsList":[sensorObj.sensorID]}),
            "customer_name":"ingram"
        };
        log(newDeviceObj);
        var devicesMetaData = ClearBlade.Collection( {collectionName: devicesTable} );
       devicesMetaData.create(newDeviceObj, devicestatusCallBack);
}

//device data query callback
var deviceCallBack= function (err, data) {
    if (err) {
        log("error: " + JSON.stringify(data));
    	_resp.error(data);
    } else {
       var queryResult=data;
        queryResult=queryResult.DATA
    log(data);
    if(queryResult.length>0)
    {
       for(i=0;i<queryResult.length;i++) 
       {
         if(queryResult[i].gateway_id === parseInt(gatewayObj.gatewayID))
           {
              var listOfSensors=JSON.parse(queryResult[i].sensors).sensorsList;
              if(listOfSensors.indexOf(sensorObj.sensorID)<0)
              {
                  listOfSensors.push(sensorObj.sensorID);
                  log(listOfSensors);
                 var query = ClearBlade.Query();
                     query.equalTo('gateway_id', parseInt(gatewayObj.gatewayID));
                     var changes = {
                               sensors: JSON.stringify({
                                   "sensorsList":listOfSensors
                                   })
                                };
                                
                 var sensorUpdateObj = ClearBlade.Collection({collectionName:devicesTable});
                     sensorUpdateObj.update(query, changes, devicestatusCallBack);
              }
           }else{
               if(i===queryResult.length-1)
               {
                createGateways();
               }
           }
       }
    }else{
       
          //createGateways(); I ddid this manually so commented out for now
    }
    	//_resp.success(data);
    }
};

//Shared Status Callback
var statusCallBack = function (err, data) {
    if (err) {
        log("error: " + JSON.stringify(data));
    	_resp.error(data);
    } else {
        log(data);
         
    	//_resp.success(data);
    }
};

var devicestatusCallBack = function (err, data) {
    if (err) {
        log("error: " + JSON.stringify(data));
    	_resp.error(data);
    } else {
        log(data);
         
    	//_resp.success(data);
    }
};


