const MultisigWallet = artifacts.require("MultisigWallet");
const truffleAssert = require("truffle-assertions");
const _ = require("lodash");

contract("MultisigWallet.proposeTransfer", async accounts => {
    it("should allow signers to create transfer proposals", async () => {
        let mw = await MultisigWallet.deployed();

        await mw.proposeTransfer(accounts[3], 21);

        let newProposal = await mw.transferProposals(0);

        let expectedProposalData = {
            id: 0,
            receiver: accounts[3],
            amount: 21,
            yesVotes: 1,
            noVotes: 0,
            status: 0
        }

        let newProposalData = {
            id: newProposal.id.words[0],
            receiver: newProposal.receiver,
            amount: newProposal.amount.words[0],
            yesVotes: newProposal.yesVotes.words[0],
            noVotes: newProposal.noVotes.words[0],
            status: newProposal.status.words[0]
        }

        assert.isTrue(_.isEqual(newProposalData, expectedProposalData));
    });

    it("should not allow non-signers to create transfer proposals", async () => {
        let mw = await MultisigWallet.deployed();

        await truffleAssert.reverts(mw.proposeTransfer(accounts[4], 21, { from: accounts[3]} ), "Only signers can call this function");
    });
});
