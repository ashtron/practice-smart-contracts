const MultisigWallet = artifacts.require("MultisigWallet");

module.exports = function(deployer, network, accounts) {
  const signers = [accounts[0], accounts[1], accounts[2]];

  deployer.deploy(MultisigWallet, signers, 2);
};
