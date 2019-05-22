/**
 * @typedef {object} testCrud
 
*/

/**
 * @typedef {object} createTestCrudParams
 * @property {testCrud} item
 * @property {testCrud[]} items
*/

/**
 * Creates items in the "testCrud" collection
 * @param {{ params: createTestCrudParams }} req
 * @param {createTestCrudParams} req.params
 * @param {CbServer.Resp} resp
*/
function createTestCrud(req, resp) {
  log(req) 
  if (!req.params.item && !req.params.items) {
    resp.error('invalid request, expected structure `{ item: { myProp: "", myProp2: "" } }`}')  
  }
  ClearBlade.init({ request: req }); 

  if (req.params.item) {
    req.params.items = [req.params.item];
  }
  var col = ClearBlade.Collection({ collectionName: 'testCrud' });
  col.create(req.params.items, function(err, data) {
    log(data) 
    if (err) {
      resp.error(data);
    } else {
      resp.success(data);
    }
  });
}
