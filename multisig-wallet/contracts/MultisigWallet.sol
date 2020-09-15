// SPDX-License-Identifier: Unlicense

pragma solidity ^0.7.0;

contract MultisigWallet {
    address owner;
    address[] signers;
    TransferProposal[] transferProposals;

    struct TransferProposal {
        address receiver;
        uint amount;
    }

    modifier onlyOwner { _; }
    modifier onlySigner { _; }
    modifier spotAvailable { _; }

    constructor() {}

    function addSigner(address _newSigner) onlyOwner spotAvailable public {}

    function deposit() onlySigner public payable {}

    function proposeTransfer(address _receiver, uint _amount) onlySigner public {}

    function voteOnTransferProposal(uint _proposalId, bool _vote) onlySigner public {}

    function executeTransfer(uint _proposalId) private {}

    fallback() external {}
}