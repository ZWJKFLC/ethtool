const fs = require('fs');
var path = require('path');
var jsonFile = require('jsonfile')

class id_readcontracts {
    constructor(hhtool) {
        this.hhtool = hhtool;
        this.info = hhtool.info;
    }
    async getcontractinfo() {
        let info = new Object();
        let filelist = await loadcontractinfo(this.info.deploymentPath);
        for (let i in filelist) {
            let fileinfo = await jsonFile.readFile(filelist[i]);
            try {
                var chainId = fileinfo.network.chainId;
            } catch (error) {
                continue;
            }
            if (!(info[chainId] !== null && typeof info[chainId] === 'object')) {
                info[chainId] = new Object();
            }
            info[chainId][fileinfo.contractName] = fileinfo;
        }
        return info;
    }
    async loc_getcontractinfo() {
        if (loc_allinfo) {
            return loc_allinfo;
        }
        loc_allinfo = require(this.info.deploymentPath + "/all.json");
        return loc_allinfo;
    }
}
async function loadcontractinfo(filePath) {
    return new Promise(function (resolve, reject) {
        let info = new Array();
        fs.readdir(filePath, async function (err, files) {
            if (err) {
                console.warn(err, "读取文件夹错误！")
                global.zwjerror = true;
                reject();
            } else {
                for (const filename of files) {
                    const filedir = path.join(filePath, filename);
                    const stats = await fs.promises.stat(filedir);

                    if (stats.isDirectory()) {
                        const subInfo = await loadcontractinfo(filedir);
                        info = info.concat(subInfo);
                    } else {
                        info.push(filedir);
                    }
                }
            }
            resolve(info);
        });
    });
}


module.exports = {
    id_readcontracts
}