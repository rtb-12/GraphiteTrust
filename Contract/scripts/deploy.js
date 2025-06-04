async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
  const registry = await ReputationRegistry.deploy();
  await registry.deployed();

  console.log("ReputationRegistry deployed to:", registry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });