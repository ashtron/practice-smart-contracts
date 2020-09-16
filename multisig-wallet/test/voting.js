// const MultisigWallet = artifacts.require("MultisigWallet");
// const truffleAssert = require("truffle-assertions");

// contract("MultisigWallet.voteOnTransferProposal", async accounts => {
//     it("should allow signers to vote on a transfer proposal", async () => {
//         let mw = await MultisigWallet.deployed();

//         await mw.addSigner(accounts[1]);
//         await mw.addSigner(accounts[2]);

//         await mw.proposeTransfer(accounts[3], 21);

//         await mw.voteOnTransferProposal(0, true);

//         assert.isTrue(false);
//     });

//     it("should not allow others to vote on a transfer proposal", async () => {
//         let mw = await MultisigWallet.deployed();

//         assert.isTrue(false);
//     });

//     it("should execute proposal when quorum is reached", async () => {
//         let mw = await MultisigWallet.deployed();

//         assert.isTrue(false);
//     });

//     it("should mark unpassed proposals Rejected", async () => {
//         let mw = await MultisigWallet.deployed();

//         assert.isTrue(false);
//     });
// });