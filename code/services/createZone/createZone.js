function createZone(req, resp) {
   var testParams = {
    zone: {
      "name": "test Zone",
      "location_id": "ae9cd9b7-6c6c-491e-87dc-2efb6e58b567"
    }
  };
  // req.params = testParams;
  ClearBlade.init({ request: req });
  var response = {
    err: false,
    message: "",
    payload: []
  }

  var sendResponse = function () {
    resp.success(response)
  }

  var callback = function (err, data) {
    if (err) {
      response.err = true;
      response.message = data;
      sendResponse();
    } else {
      response.payload.push(data[0].item_id)
      if (response.payload.length === req.params.zones.length) {
        sendResponse();
      }
    }
  };
  var col = ClearBlade.Collection({ collectionName: "Zones" });
  if (req.params.zone) {
    if((req.params.zone).constructor === Array)
    {
     req.params.zones = req.params.zone;
    }else{
     req.params.zones = [req.params.zone];
    }
   
  }
  req.params.zones.forEach(function (item) {
    if (!item.name) {
      response.err = true
      response.message = 'name cannot be blank'
      sendResponse()
    }
    col.create(item, callback);
  })
}
