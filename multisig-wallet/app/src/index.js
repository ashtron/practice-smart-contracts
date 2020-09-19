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

      this.getCurrentProposal();
    } catch (error) {
      console.error(error);
    }
  },

  deposit: async function() {
    const { deposit } = this.mw.methods;

    await deposit().send({ from: this.account, value: 21 });
  },

  getCurrentProposal: async function() {
    const { transferProposals } = this.mw.methods;
    const currentProposal = await transferProposals(0).call();

    const proposalNumber = document.getElementById("proposal-number"); 
    const amount = document.getElementById("amount");
    const receiver = document.getElementById("receiver");

    proposalNumber.innerHTML = currentProposal.id;
    amount.innerHTML = currentProposal.amount;
    receiver.innerHTML = currentProposal.receiver;
  },

  proposeTransfer: async function() {
    const receiver = document.getElementById("receiver-input").value;
    const amount = parseInt(document.getElementById("amount-input").value);
    console.log(amount);

    // this.setStatus("Initiating transaction... (please wait)");

    const { proposeTransfer } = this.mw.methods;
    await proposeTransfer(receiver, amount).send({ from: this.account });
    // await sendCoin(receiver, amount).send({ from: this.account });

    // this.setStatus("Transaction complete!");
    // this.refreshBalance();
  },

  vote: async function(choice) {
    // const { voteOnTransferProposal } = this.mw.methods;
    const { votes } = this.mw.methods;

    // await voteOnTransferProposal(0, true).send({ from: this.account });
    const voteResult = await votes(this.account, 0).call();

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