// SPDX-License-Identifier: Unlicense

pragma solidity ^0.7.0;

contract MultisigWallet {
    address public owner;
    uint public maxSigners;
    uint public numSigners;
    mapping(address => bool) public signers;
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

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlySigner {
        require(signers[msg.sender]);
        _;
    }

    modifier spotAvailable {
        require(numSigners < maxSigners);
        _;
    }

    modifier hasVotingStatus(uint _proposalId) {
        require(transferProposals[_proposalId].status == Status.Voting);
        _;
    }

    constructor() {
        maxSigners = 3;
        owner = msg.sender;
        addSigner(owner);
    }

    function addSigner(address _newSigner) onlyOwner spotAvailable public {
        // Avoid incrementing `numSigners` if address is already a signer
        require(!signers[_newSigner]);

        signers[_newSigner] = true;
        numSigners += 1;
    }

    function deposit() onlySigner public payable {}

    function proposeTransfer(address payable _receiver, uint _amount) onlySigner public {
        transferProposals.push(TransferProposal({
            id: transferProposals.length,
            receiver: _receiver,
            amount: _amount,
            yesVotes: 0,
            noVotes: 0,
            status: Status.Voting
        }));
    }

    function voteOnTransferProposal(uint _proposalId, bool _vote) onlySigner hasVotingStatus(_proposalId) public {
        if (_vote) {
            transferProposals[_proposalId].yesVotes += 1;

            if (transferProposals[_proposalId].yesVotes >= 2) {
                executeTransfer(_proposalId);
            }
        } else {
            transferProposals[_proposalId].noVotes += 1;

            if (transferProposals[_proposalId].noVotes >= 1) {
                transferProposals[_proposalId].status = Status.Rejected;
            }
        }
    }

    function executeTransfer(uint _proposalId) private {
        TransferProposal storage proposal = transferProposals[_proposalId];

        proposal.receiver.transfer(proposal.amount);

        proposal.status = Status.Executed;
    }

    fallback() external {
        revert();
    }
}