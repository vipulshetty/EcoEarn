require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    polygonZkEVMTestnet: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};