const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
class log {
    constructor(hhtool) {
        this.hhtool = hhtool;
        this.info = hhtool.info;
    }
    async writer_info(network, Artifact, contract) {
        await this.baseinit(network, Artifact, contract);
        await this.baseinit2(network, Artifact);
    }
    async writer_info_all(network, Artifact, contract, Argument) {
        await this.baseinit(network, Artifact, contract);

        this.contractinfo["constructorArguments"] = Argument;
        await this.writer_Arguments(network, Artifact)
        await this.baseinit2(network, Artifact);
    }
    async writer_info_all_proxy(network, Artifact, contract, Argument, proxyaddr) {
        await this.baseinit(network, Artifact, contract);

        this.contractinfo["constructorArguments"] = Argument;
        await this.writer_Arguments(network, Artifact)
        this.contractinfo["p_address"] = proxyaddr;

        await this.baseinit2(network, Artifact);
    }
    async baseinit(network, Artifact, contract) {
        if (contract.target) {
            contract.address = contract.target
        }
        let deploymentPath = this.info.deploymentPath
        await creatfile(deploymentPath);
        await this.set_base_info(network, Artifact, contract);
    }
    async baseinit2(network, Artifact) {
        let deploymentPath = this.info.deploymentPath
        await writeFile(
            deploymentPath + `/${network.name}/${Artifact.contractName}.json`,
            JSON.stringify(this.info, replacer, 2));
        await writeFile(
            deploymentPath + `/newinfo/${Artifact.contractName}.json`,
            JSON.stringify(this.info, replacer, 2));
        console.log(`Exported deployments into ${deploymentPath}`);
        await this.updatedeployments();
    }
    async set_base_info(network, Artifact, contract) {
        this.contractinfo = {}
        this.contractinfo["contractName"] = Artifact.contractName;
        this.contractinfo["abi"] = Artifact.abi;
        this.contractinfo["address"] = contract.address;
        this.contractinfo["target"] = contract.target;
        // this.contractinfo["blocknumber"] = contract.provider._maxInternalBlockNumber;
        this.contractinfo["blocknumber"] = await contract.runner.provider.getBlockNumber();
        this.contractinfo["constructorArguments"] = [];
        this.contractinfo["network"] = {};
        this.contractinfo.network["name"] = network.name;
        this.contractinfo.network["chainId"] = network.config.chainId;
        this.contractinfo.network["url"] = network.config.url;
        if (!this.contractinfo.network["url"]) {
            this.contractinfo.network["url"] = "http://127.0.0.1:8545"
        }
    }
    async writer_Arguments(network, Artifact) {
        let deploymentPath = this.info.deploymentPath
        await creatfile(path.resolve(deploymentPath, `../Arguments`));
        let dir = (
            path.resolve(deploymentPath, `../Arguments`) +
            `/${network.name}/${Artifact.contractName}.json`
        )
        await writeFile(
            dir,
            JSON.stringify(
                this.contractinfo.constructorArguments,
                replacer,
                2
            )
        );
    }
    async updatedeployments() {
        var contractinfo = await this.hhtool.id_readcontracts.getcontractinfo(this.info.deploymentPath);
        await writeFile(
            this.info.deploymentPath + `/all.json`,
            JSON.stringify(contractinfo));
    }
}
module.exports = {
    log
}
function replacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString(); // 将 BigInt 转换为字符串
    } else {
        return value; // 其他类型的值保持不变
    }
}
async function creatfile(deploymentPath) {
    if (!fs.existsSync(deploymentPath)) {
        await fs.mkdirSync(deploymentPath, { recursive: true });
    }
    let dir = deploymentPath + `/newinfo`;
    if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir, { recursive: true });
    }
    dir = deploymentPath + `/${network.name}`;
    if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir, { recursive: true });
    }
}