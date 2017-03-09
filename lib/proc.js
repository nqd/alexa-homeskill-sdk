'use strict';

let utils = require('./utils');

let genRes = function(req, res) {
  let resName = (res.err)?
    res.err.code : utils.createResHeaderName(req.event.header.name);

  let resNamespace = req.event.header.namespace;
  let header = utils.createHeader(resNamespace, resName);

  let resPayload = (res.payload)? res.payload : {};

  return utils.createDirective(header, resPayload);
};

module.exports = {
  genRes: genRes,
};
