const { sign } = require("./sign/sign");
const { log } = require("./log/log");
class hardhattool {
    constructor(info) {
        this.hhtool = this;
        this.info = info;
        Object.assign(this, {
            "sign": new sign(this),
            "log": new log(this),
        });
    }
}




module.exports = {
    hardhattool
}