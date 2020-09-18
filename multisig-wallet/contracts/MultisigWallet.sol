// SPDX-License-Identifier: Unlicense

pragma solidity ^0.7.0;

contract MultisigWallet {
    uint public numSigners;
    mapping(address => bool) public signers;
    mapping(address => mapping(uint => bool)) public votes;
    uint quorum;
    TransferProposal[] public transferProposals;
    bool proposalPending;

    enum Status { Pending, Rejected, Executed }

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

    modifier isPending(uint _proposalId) {
        require(transferProposals[_proposalId].status == Status.Pending, "Proposal is not pending");
        _;
    }

    modifier hasntVoted(uint _proposalId) {
        require(!votes[msg.sender][_proposalId], "Already voted on this proposal");
        _;
    }

    modifier noPendingProposal {
        require(!proposalPending, "There is already a pending proposal");
        _;
    }

    modifier sufficientBalance(uint _proposalId) {
        TransferProposal memory proposal = transferProposals[_proposalId];

        require(address(this).balance >= proposal.amount, "Not enough balance to execute transfer");
        _;
    }

    constructor(address[] memory _signers, uint _quorum) {
        numSigners = _signers.length;
        quorum = _quorum;
        proposalPending = false;

        for (uint i = 0; i < numSigners; i++) {
            signers[_signers[i]] = true;
        }
    }

    function deposit() onlySigner public payable {}

    function proposeTransfer(address payable _receiver, uint _amount) onlySigner noPendingProposal public {
        transferProposals.push(TransferProposal({
            id: transferProposals.length,
            receiver: _receiver,
            amount: _amount,
            yesVotes: 1,
            noVotes: 0,
            status: Status.Pending
        }));

        proposalPending = true;
        votes[msg.sender][transferProposals.length - 1] = true;
    }

    function voteOnTransferProposal(uint _proposalId, bool _vote) onlySigner isPending(_proposalId) hasntVoted(_proposalId) public {
        if (_vote) {
            transferProposals[_proposalId].yesVotes += 1;

            if (transferProposals[_proposalId].yesVotes >= quorum) {
                executeTransfer(_proposalId);
                proposalPending = false;
            }
        } else {
            transferProposals[_proposalId].noVotes += 1;

            if (transferProposals[_proposalId].noVotes > (numSigners - quorum)) {
                transferProposals[_proposalId].status = Status.Rejected;
                proposalPending = false;
            }
        }
    }

    function executeTransfer(uint _proposalId) sufficientBalance(_proposalId) private {
        TransferProposal storage proposal = transferProposals[_proposalId];

        proposal.receiver.transfer(proposal.amount);

        proposal.status = Status.Executed;
    }

    fallback() external {
        revert();
    }
}