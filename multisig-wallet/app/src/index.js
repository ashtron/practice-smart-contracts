import Web3 from "web3";
import MultisigWalletArtifact from "../../build/contracts/MultisigWallet.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // Get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MultisigWalletArtifact.networks[networkId];

      this.mw = new web3.eth.Contract(
        MultisigWalletArtifact.abi,
        deployedNetwork.address,
      );

      // Get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      const { numProposals } = this.mw.methods;
      this.currentProposalId = await numProposals().call() - 1;

      if (this.currentProposalId >= 0) {
        this.getCurrentProposal();
      }
      
    } catch (error) {
      console.error(error);
    }
  },

  deposit: async function() {
    const { deposit } = this.mw.methods;
    const depositAmount = App.web3.utils.toWei(document.getElementById("deposit-amount").value, "ether");

    await deposit().send({ from: this.account, value: depositAmount });
  },

  getCurrentProposal: async function() {
      const { transferProposals } = this.mw.methods;
      
      const currentProposal = await transferProposals(this.currentProposalId).call();
      const proposalNumber = document.getElementById("proposal-number"); 
      const amount = document.getElementById("amount");
      const receiver = document.getElementById("receiver");

      proposalNumber.innerHTML = currentProposal.id;
      amount.innerHTML = App.web3.utils.toWei(currentProposal.amount, "ether");
      receiver.innerHTML = currentProposal.receiver;
  },

  proposeTransfer: async function() {
    const receiver = document.getElementById("receiver-input").value;
    const amount = String(App.web3.utils.toWei(document.getElementById("amount-input").value, "ether"));

    const { proposeTransfer } = this.mw.methods;
    await proposeTransfer(receiver, amount).send({ from: this.account });
  },

  vote: async function(choice) {
    const { voteOnTransferProposal } = this.mw.methods;
    const { votes } = this.mw.methods;

    await voteOnTransferProposal(this.currentProposalId, choice).send({ from: this.account });
    const voteResult = await votes(this.account, this.currentProposalId).call();

    const vote = document.getElementById("vote");
    vote.innerHTML = voteResult;
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});