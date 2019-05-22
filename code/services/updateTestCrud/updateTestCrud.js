/**
 * @typedef {object} testCrud
 * @property {string} item_id
 
*/

/**
 * @typedef {object} updateTestCrudParams
 * @property {testCrud} item
 */

/**
 * Updates an item from the "testCrud" collection
 * @param {{ params: updateTestCrudParams }} req
 * @param {updateTestCrudParams} req.params
 * @param {CbServer.Resp} resp
 */
function updateTestCrud(req, resp) {
  log(req)    
  if (!req.params.item || !req.params.item.item_id) {
    resp.error('invalid request, expected structure `{ item: { myPropToUpdate: "", item_id: "00000000-0000-0000-0000-000000000000" } } `')
  }
  ClearBlade.init({ request: req });

  var query = ClearBlade.Query();  
  query.equalTo('item_id', req.params.item.item_id);

  var col = ClearBlade.Collection({ collectionName: "testCrud" });
  col.update(query, req.params.item, function (err, data) {
    log(data)
    if (err) {
        resp.error(data)
    } else {
        resp.success(data);
    }
  });
}
