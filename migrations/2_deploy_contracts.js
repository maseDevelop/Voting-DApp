var StarWarsPoll = artifacts.require("./StarWarsPoll.sol");

module.exports = function(deployer) {
  deployer.deploy(StarWarsPoll);
};
