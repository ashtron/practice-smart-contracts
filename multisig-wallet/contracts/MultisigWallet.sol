// SPDX-License-Identifier: Unlicense

pragma solidity ^0.7.0;

contract MultisigWallet {
    address public owner;
    uint public maxSigners;
    uint public numSigners;
    mapping(address => bool) public signers;
    TransferProposal[] transferProposals;

    struct TransferProposal {
        uint id;
        address payable receiver;
        uint amount;
        uint yesVotes;
        uint noVotes;
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

    constructor() {
        maxSigners = 3;
        owner = msg.sender;
        addSigner(owner);
    }

    // add check that signer hasn't already been added
    function addSigner(address _newSigner) onlyOwner spotAvailable public {
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
            noVotes: 0
        }));
    }

    function voteOnTransferProposal(uint _proposalId, bool _vote) onlySigner public {
        if (_vote) {
            transferProposals[_proposalId].yesVotes += 1;

            if (transferProposals[_proposalId].yesVotes >= 2) {
                executeTransfer(_proposalId);
            }
        } else {
            transferProposals[_proposalId].noVotes += 1;
        }
    }

    function executeTransfer(uint _proposalId) private {
        TransferProposal memory proposal = transferProposals[_proposalId];

        proposal.receiver.transfer(proposal.amount);
    }

    fallback() external {
        revert();
    }
}