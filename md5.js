const crypto = require('crypto');
const assert = require('assert');

module.export = function(str) {
    assert(str != null) && assert(!str.empty());

    const md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
}