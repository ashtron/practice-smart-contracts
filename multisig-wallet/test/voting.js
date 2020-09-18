const MultisigWallet = artifacts.require("MultisigWallet");
const truffleAssert = require("truffle-assertions");

contract("MultisigWallet.voteOnTransferProposal", async accounts => {
    it("should allow signers to vote on a transfer proposal and execute when quorum is reached", async () => {
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
        
        await truffleAssert.reverts(mw.voteOnTransferProposal(1, true, { from: accounts[1] }), "Already voted on this proposal");
    });

    it("should not allow non-signers to vote on a transfer proposal", async () => {
        let mw = await MultisigWallet.deployed();

        await truffleAssert.reverts(mw.voteOnTransferProposal(1, true, { from: accounts[3] }), "Only signers can call this function");
    });

    it("should mark unpassed proposals Rejected", async () => {
        let mw = await MultisigWallet.deployed();

        await mw.proposeTransfer(accounts[4], 21);

        await mw.voteOnTransferProposal(2, false, { from: accounts[1] });
        await mw.voteOnTransferProposal(2, false, { from: accounts[2] });

        let proposal = await mw.transferProposals(2);

        assert.isTrue(proposal.status.words[0] === 1);
    });
});