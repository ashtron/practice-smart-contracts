const MultisigWallet = artifacts.require("MultisigWallet");
const truffleAssert = require("truffle-assertions");

contract("MultisigWallet.addSigner", async accounts => {
  
  it("should add `owner` as a signer", async () => {
    let mw = await MultisigWallet.deployed();

    let owner = await mw.owner();

    assert.isTrue(await mw.signers(owner));
  });

  it("should allow `owner` to add new signers", async () => {
    let mw = await MultisigWallet.deployed();

    let owner = await mw.owner();
    mw.addSigner(accounts[1]);

    assert.isTrue(await mw.signers(accounts[1]));
  });

  it("should not allow others to add signers", async () => {
    let mw = await MultisigWallet.deployed();

    await truffleAssert.reverts(mw.addSigner(accounts[2], {from: accounts[1]}));
  });

  it("should not add existing signer", async () => {
    let mw = await MultisigWallet.deployed();

    let owner = await mw.owner();

    await truffleAssert.reverts(mw.addSigner(accounts[1]));
  });

  it("should not allow more than `maxSigners` signers", async () => {
    let mw = await MultisigWallet.deployed();

    // We have two signers already.
    await mw.addSigner(accounts[2]);

    await truffleAssert.reverts(mw.addSigner(accounts[3]));
  });
});
