const ethers = require("ethers");

class testscripts {
    constructor(hhtool) {
        this.hhtool = hhtool;
        this.info = hhtool.info;
    }
    async call_contract(signingKey, chainId, contractname, fun, params, options) {
        let provider = new ethers.JsonRpcProvider(contractinfo[chainId][contractname].network.url);
        let wallet = new ethers.Wallet(signingKey, provider);
        let contract = new ethers.Contract(
            contractinfo[chainId][contractname].target,
            contractinfo[chainId][contractname].abi,
            provider
        );
        let contractWithSigner = contract.connect(wallet);
        let tx;
        if (!params) {
            params = []
        }
        if (params.length > 0) {
            // tx = await contractWithSigner[fun](...params);
            // console.log(...params);
            tx = await contractWithSigner[fun](...params, { ...options });
        } else {
            tx = await contractWithSigner[fun]({ ...options });
        }
        return tx
    }
    async l_call_contract(wallet, contractname, fun, params, options) {
        let contract = new ethers.Contract(
            contractinfo[network.config.chainId][contractname].target,
            contractinfo[network.config.chainId][contractname].abi,
            network.config.provider
        );
        let contractWithSigner = contract.connect(wallet);
        let tx;
        //   console.log(params.length);
        if (params.length > 0) {
            // tx = await contractWithSigner[fun](...params);
            // console.log(...params);
            tx = await contractWithSigner[fun](...params, { ...options });
        } else {
            tx = await contractWithSigner[fun]({ ...options });
        }
        return tx
    }
    async l_creat_contract(wallet, contractname, args) {
        const Main_contract = await hre.ethers.getContractFactory(contractname);
        const main_contract = await Main_contract.connect(wallet).deploy(
            ...args
        );
        await main_contract.waitForDeployment();
        console.log(contractname + " deployed to:", main_contract.target);
        let Artifact = await artifacts.readArtifact(contractname);
        await this.hhtool.log.writer_info_all(network, Artifact, main_contract, args);
        contractinfo = await this.hhtool.id_readcontracts.getcontractinfo(this.info.deploymentPath);
    }
    async creat_contract(signingKey, chain_name, contractname, args) {
        let provider = new ethers.JsonRpcProvider(secret.hardhatset.networks[chain_name].url);
        let wallet = new ethers.Wallet(signingKey, provider);

        const Main_contract = await hre.ethers.getContractFactory(contractname);
        const main_contract = await Main_contract.connect(wallet).deploy(
            ...args
        );
        await main_contract.waitForDeployment();
        console.log(contractname + " deployed to:", main_contract.target);
        let Artifact = await artifacts.readArtifact(contractname);
        await this.hhtool.log.writer_info_all(network, Artifact, main_contract, args);
        contractinfo = await this.hhtool.id_readcontracts.getcontractinfo(this.info.deploymentPath);
    }

    contractadd(newontract) {
        contractinfo[newontract.network.chainId.toString()][newontract.contractName] = newontract;
    }

    getbyurl(url) {
        return new Promise(function (resolve, reject) {
            request({
                timeout: 10000,    // Set timeout
                method: 'GET',     // Set method
                url: url
            }, async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // let body = JSON.parse(body);
                    resolve(JSON.parse(body));
                } else {
                    resolve();
                }
            })
        })
    }
    async wait(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }


}
module.exports = {
    testscripts
}