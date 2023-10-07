const fs = require('fs');
var path = require('path');
var filePath = path.resolve(process.cwd(), './deployments/');
var jsonFile = require('jsonfile')

async function readfile(filePath) {
    let info = new Array();
    return new Promise(function (resolve, reject) {
        fs.readdir(filePath, async function (err, files) {
            if (err) {
                console.warn(err, "读取文件夹错误！")
                global.zwjerror = true;
                reject();
            }
            for (let i = 0; i < files.length; i++) {
                let nowpath = filePath + '/' + files[i];
                if (fs.statSync(nowpath).isDirectory()) {
                    info = info.concat(await readfile(nowpath));
                } else {
                    info.push(nowpath);
                }
            }
            resolve(info);
        });
    });
}
async function loadcontractinfo(filePath) {
    let files = await readfile(filePath);
    // return new Promise(async function (resolve, reject) {
    //     let info = new Array();
    //     for (let i = 0; i < files.length; i++) {
    //         const element = files[i];
    //         info.push(await jsonFile.readFile(element));
    //     }
    //     resolve(info)
    // });
    let info = new Array();
    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        info.push(await jsonFile.readFile(element));
    }
    return info
}

exports.getcontractinfo = async function getcontractinfo() {
    return await loadcontractinfo(filePath);
}
exports.id_getcontractinfo = async function id_getcontractinfo() {
    let info = new Object();
    // let filelist = await readfile(filePath);
    // for (let i in filelist) {
    //     let fileinfo = await jsonFile.readFile(filelist[i]);
    //     let chainId =fileinfo.network.chainId;
    //     if(!(info[chainId] !== null && typeof info[chainId] === 'object')){
    //         info[chainId]=new Object();
    //     }
    //     info[chainId][fileinfo.contractName] = fileinfo;
    // }
    let oldinfo = await loadcontractinfo(filePath);
    for (let i in oldinfo) {
        console.log(oldinfo[i]);
        let chainId = fileinfo.network.chainId;
        if (!(info[chainId] !== null && typeof info[chainId] === 'object')) {
            info[chainId] = new Object();
        }
        info[chainId][fileinfo.contractName] = fileinfo;
    }

    return info;
}


// test();

// async function test(){
//     return console.log(await loadcontractinfo(filePath));
// }