const hre = require("hardhat");

async function main() {
  const EcoPointsNFT = await hre.ethers.getContractFactory("EcoPointsNFT");
  const ecoPointsNFT = await EcoPointsNFT.deploy();

  await ecoPointsNFT.deployed();

  console.log("EcoPointsNFT deployed to:", ecoPointsNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });