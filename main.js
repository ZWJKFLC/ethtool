const { hardhattool } = require("./hardhattool/hardhattool.js")

class ethtoolclass {
  constructor(info) {
    this.ethtool = this;
    let check = ["path"];
    console.log(info);
    if (!check.every(key => key in info)) {
      throw "error info"
    }
    this.info = info;
    Object.assign(this, {
      "hardhattool": new hardhattool(this.info),
    });
  }
  async set(info) {
    let check = ["path"];
    if (!check.every(key => key in info)) {
      throw "error info"
    }
    this.ethtool.info = info;
  }
}





module.exports = {
  ethtoolclass
}