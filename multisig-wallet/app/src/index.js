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
      // const { signers } = this.mw.methods;
      // console.log(signers);

      // this.refreshBalance();
    } catch (error) {
      console.error(error);
    }
  },
  
  // refreshBalance: async function() {
  //   const { getBalance } = this.meta.methods;
  //   const balance = await getBalance(this.account).call();

  //   const balanceElement = document.getElementsByClassName("balance")[0];
  //   balanceElement.innerHTML = balance;
  // },

  proposeTransfer: async function() {
    const receiver = document.getElementById("receiver").value;
    const amount = parseInt(document.getElementById("amount").value);
    console.log(receiver);
    console.log(amount);

    // this.setStatus("Initiating transaction... (please wait)");

    const { proposeTransfer } = this.mw.methods;
    console.log(proposeTransfer);
    await proposeTransfer(receiver, amount).send({ from: this.account });
    // await sendCoin(receiver, amount).send({ from: this.account });

    // this.setStatus("Transaction complete!");
    // this.refreshBalance();
  }

  // setStatus: function(message) {
  //   const status = document.getElementById("status");
  //   status.innerHTML = message;
  // },
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





// window.onload = function() {
//     document.getElementById("connectButton").addEventListener("click", () => {
//     ethereum.enable();
//   });

//   document.getElementById("getAccountsButton").addEventListener("click", async () => {
//     const accounts = await ethereum.request({ method: 'eth_accounts' });
//     console.log(accounts);
//     // getAccountsResults.innerHTML = response.result[0] || 'Not able to get accounts';
//   });
// };