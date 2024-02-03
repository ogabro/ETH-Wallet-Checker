const ethers = require('ethers');
const { getMarketPrices } = require('./marketPrices'); // Import the marketPrices module

// Replace these with your own values
const alchemyApiKey = 'Insert_your_Alchemy_key_here'; // Replace with your Alchemy API key
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // Wrapped Ethereum (WETH) contract address

async function checkBalance(address) {
  const providerUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`; // Alchemy API endpoint
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  // Check ETH balance
  const ethBalance = await provider.getBalance(address);
  const ethBalanceInEther = parseFloat(ethers.utils.formatEther(ethBalance));

  // Check WETH balance
  const wethContract = new ethers.Contract(wethAddress, ['function balanceOf(address) view returns (uint256)'], provider);
  const wethBalance = await wethContract.balanceOf(address);
  const wethBalanceInEther = parseFloat(ethers.utils.formatUnits(wethBalance, 18));

  return {
    ethBalance: ethBalanceInEther,
    wethBalance: wethBalanceInEther
  };
}

async function main() {
  const walletAddresses = []; // An array to store wallet addresses entered by the user

  // Prompt the user to enter wallet addresses
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Enter wallet addresses (one per line), and type "done" when finished:');
  let input = '';
  while (true) {
    input = await new Promise((resolve) => {
      readline.question('', (answer) => {
        resolve(answer);
      });
    });

    if (input.toLowerCase() === 'done') {
      break;
    }

    walletAddresses.push(input);
  }

  readline.close();

  for (const address of walletAddresses) {
    const balances = await checkBalance(address);

    console.log(`Wallet Address: ${address}`);
    console.log(`ETH Balance: ${balances.ethBalance} ETH`);
    console.log(`WETH Balance: ${balances.wethBalance} WETH`);
    console.log('--------------------------------');
  }
}

async function main() {
  const marketPrices = await getMarketPrices();

  // ... Calculate and print totals and market values
}

main().catch((error) => {
  console.error('Error:', error);
});
