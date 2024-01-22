const { sign } = require("./sign/sign");
const { log } = require("./log/log");
const { id_readcontracts } = require("./log/id_readcontracts");
var path = require('path');
class hardhattool {
    constructor(info) {
        let check = ["basepath"];
        if (!check.every(key => key in info)) {
            throw "error info"
        }
        this.hhtool = this;
        this.info = info;
        this.info.deploymentPath = path.resolve(this.info.basepath, `./deployments`)
        Object.assign(this, {
            sign: new sign(this),
            log: new log(this),
            id_readcontracts: new id_readcontracts(this),
        });
    }
}




module.exports = {
    hardhattool
}