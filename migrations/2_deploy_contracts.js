const AIModelMarketplace = artifacts.require("AIModelMarketplace");

module.exports = async function(deployer) {
  try {
    const gasPrice = await web3.eth.getGasPrice(); // Fetch current gas price
    const gasLimit = 6000000; // Increase the gas limit if needed

    await deployer.deploy(AIModelMarketplace, { gas: gasLimit, gasPrice: gasPrice });
    console.log("Deployment successful!");
  } catch (err) {
    console.error("Deployment failed:", err);
  }
};
