// SPDX-License-Identifier: Unlicense

pragma solidity ^0.7.0;

contract MultisigWallet {
    uint public numSigners;
    mapping(address => bool) public signers;
    // mapping(address => bool[]) public votes;
    mapping(address => mapping(uint => bool)) public votes;
    uint quorum;
    TransferProposal[] public transferProposals;

    enum Status { Voting, Rejected, Executed }

    struct TransferProposal {
        uint id;
        address payable receiver;
        uint amount;
        uint yesVotes;
        uint noVotes;
        Status status;
    }

    modifier onlySigner {
        require(signers[msg.sender], "Only signers can call this function");
        _;
    }

    modifier hasVotingStatus(uint _proposalId) {
        require(transferProposals[_proposalId].status == Status.Voting, "Proposal does not have Voting status");
        _;
    }

    modifier hasntVoted(uint _proposalId) {
        require(!votes[msg.sender][_proposalId], "Already voted on this proposal");
        _;
    }

    constructor(address[] memory _signers, uint _quorum) {
        numSigners = _signers.length;
        quorum = _quorum;

        for (uint i = 0; i < numSigners; i++) {
            signers[_signers[i]] = true;
            // votes[_signers[i]] = new bool[](numSigners);
        }
    }

    function deposit() onlySigner public payable {}

    function proposeTransfer(address payable _receiver, uint _amount) onlySigner public {
        transferProposals.push(TransferProposal({
            id: transferProposals.length,
            receiver: _receiver,
            amount: _amount,
            yesVotes: 1,
            noVotes: 0,
            status: Status.Voting
        }));

        // mapping(address => mapping(uint => bool)) public votes;
        votes[msg.sender][transferProposals.length - 1] = true;
    }

    function voteOnTransferProposal(uint _proposalId, bool _vote) onlySigner hasVotingStatus(_proposalId) hasntVoted(_proposalId) public {
        if (_vote) {
            transferProposals[_proposalId].yesVotes += 1;

            if (transferProposals[_proposalId].yesVotes >= quorum) {
                executeTransfer(_proposalId);
            }
        } else {
            transferProposals[_proposalId].noVotes += 1;

            if (transferProposals[_proposalId].noVotes > (numSigners - quorum)) {
                transferProposals[_proposalId].status = Status.Rejected;
            }
        }
    }

    // Handle case where contract doesn't have enough funds.
    function executeTransfer(uint _proposalId) private {
        TransferProposal storage proposal = transferProposals[_proposalId];

        proposal.receiver.transfer(proposal.amount);

        proposal.status = Status.Executed;
    }

    fallback() external {
        revert();
    }
}