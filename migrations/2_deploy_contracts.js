const AIModelMarketplace = artifacts.require("AIModelMarketplace");

module.exports = function(deployer) {
    deployer.deploy(AIModelMarketplace, { gas: 5000000 }).then(() => {
      console.log("Deployment successful!");
    }).catch(err => {
      console.error("Deployment failed:", err);
    });
  };
  