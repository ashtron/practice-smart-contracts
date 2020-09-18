const MultisigWallet = artifacts.require("MultisigWallet");
const truffleAssert = require("truffle-assertions");

contract("MultisigWallet.deposit", async accounts => {
  it("should allow deposits from signers", async () => {
    let mw = await MultisigWallet.deployed();

    await mw.deposit({ from: accounts[0], value: 21 });
    await mw.deposit({ from: accounts[1], value: 21 });

    let contractBalance = await web3.eth.getBalance(mw.address);

    assert.equal(contractBalance, 42);
  });

  it("should not allow deposits from non-signers", async () => {
    let mw = await MultisigWallet.deployed();

    await truffleAssert.reverts(mw.deposit({ from: accounts[3], value: 21 }), "Only signers can call this function");
  });
});
