window.onload = function() {
    document.getElementById("connectButton").addEventListener("click", () => {
    ethereum.enable();
  });

  document.getElementById("getAccountsButton").addEventListener("click", async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts);
    // getAccountsResults.innerHTML = response.result[0] || 'Not able to get accounts';
  });
};