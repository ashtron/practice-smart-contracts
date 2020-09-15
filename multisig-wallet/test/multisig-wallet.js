const MultisigWallet = artifacts.require("MultisigWallet");

contract("MultisigWallet", async accounts => {
  it("should add owner as a signer", async () => {
    let mw = await MultisigWallet.deployed();

    let owner = await mw.owner();
    // let firstSigner = await mw.signers(owner);

    assert(await mw.signers(owner));
  });

  // it("should allow owner to add a new signer", async () => {
  //   let mw = await MultisigWallet.deployed();

  //   let owner = await mw.owner();

  //   mw.addSigner(accounts[1]);
  //   let newSigner = await mw.signers(1);

  //   assert.equal(newSigner, accounts[1]);
  // });

//   it("should not allow others to add new signers", async () => {
//     let mw = await MultisigWallet.deployed();

//     let owner = await mw.owner();

//     mw.addSigner(accounts[1]);
//     let newSigner = await mw.signers(1);

//     mw.addSigner({from: web3.eth.accounts[1]}, accounts[2]);

//     let thirdSigner = await mw.signers(2);

//     assert.equal(thirdSigner, address(0));
//   });
});
