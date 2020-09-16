const MultisigWallet = artifacts.require("MultisigWallet");
const truffleAssert = require("truffle-assertions");

contract("MultisigWallet.deposit", async accounts => {
  it("should allow deposits from signers", async () => {
    let mw = await MultisigWallet.deployed();

    await mw.deposit({ from: accounts[0], value: 21 });

    await mw.addSigner(accounts[1]);
    await mw.deposit({ from: accounts[1], value: 21 });

    let contractBalance = await web3.eth.getBalance(mw.address);

    assert.equal(contractBalance, 42);
  });

  it("should not allow deposits from others", async () => {
    let mw = await MultisigWallet.deployed();

    // accounts[2] has not been added as a signer
    await truffleAssert.reverts(mw.deposit({ from: accounts[2], value: 21 }));
  });
});
