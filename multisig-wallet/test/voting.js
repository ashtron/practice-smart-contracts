const MultisigWallet = artifacts.require("MultisigWallet");
const truffleAssert = require("truffle-assertions");

contract("MultisigWallet.voteOnTransferProposal", async accounts => {
    it("should allow signers to vote on a transfer proposal", async () => {
        let mw = await MultisigWallet.deployed();

        let initialBalance = await web3.eth.getBalance(accounts[3]);

        await mw.deposit({ from: accounts[0], value: 21 });

        await mw.proposeTransfer(accounts[3], 21);
        await mw.voteOnTransferProposal(0, true, { from: accounts[1] });
        
        let newBalance = await web3.eth.getBalance(accounts[3]);

        assert.equal(Number(newBalance), Number(initialBalance) + 21);
    });

    it("should not allow signers to vote on a transfer proposal more than once", async () => {
        let mw = await MultisigWallet.deployed();

        await mw.proposeTransfer(accounts[4], 21, { from: accounts[1] });
        
        await truffleAssert.reverts(mw.voteOnTransferProposal(1, true, { from: accounts[1] }));
    });

    //     await mw.addSigner(accounts[1]);
    //     await mw.addSigner(accounts[2]);

    //     await mw.proposeTransfer(accounts[3], 21);

    //     await mw.voteOnTransferProposal(0, true);

    //     assert.isTrue(false);
    // });

    // it("should not allow others to vote on a transfer proposal", async () => {
    //     let mw = await MultisigWallet.deployed();

    //     assert.isTrue(false);
    // });

    // it("should execute proposal when quorum is reached", async () => {
    //     let mw = await MultisigWallet.deployed();

    //     assert.isTrue(false);
    // });

    // it("should mark unpassed proposals Rejected", async () => {
    //     let mw = await MultisigWallet.deployed();

    //     assert.isTrue(false);
});