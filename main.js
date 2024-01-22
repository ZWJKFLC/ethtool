const { hardhattool } = require("./hardhattool/hardhattool.js")

class ethtoolclass {
  constructor(info) {
    let check = ["basepath"];
    if (!check.every(key => key in info)) {
      throw "error info"
    }
    this.ethtool = this;
    this.info = info;
    Object.assign(this, {
      hardhattool: new hardhattool(this.info),
    });
  }
  async set(info) {
    let check = ["basepath"];
    if (!check.every(key => key in info)) {
      throw "error info"
    }
    this.ethtool.info = info;
  }
}






module.exports = {
  // ethtoolclass
  hardhattool
}