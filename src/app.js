// Import Web3.js
const Web3 = require('web3');
let web3 = new Web3(window.ethereum);

if (window.ethereum) {
    // Request MetaMask connection
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        const account = accounts[0];
        console.log('Connected Account:', account);
        // Now you can interact with the Ethereum network
    }).catch(error => {
        console.error('Error:', error);
        alert('Failed to connect to MetaMask!');
    });
} else {
    alert('Please install MetaMask!');
}

// Set up contract ABI and address
const contractAddress = "0xed0248360C111fC7A2c74ffE290889c544050D69"; // Replace with actual address
const contractABI = [/* Your ABI here */]; // Replace with actual ABI

let contract;
let account;

const initApp = async () => {
    if (window.ethereum) {
        try {
            // Request user to connect MetaMask and get the account
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Initialize web3 instance
            web3 = new Web3(window.ethereum);

            // Initialize contract instance
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // Get the current account
            account = (await web3.eth.getAccounts())[0];

            // Display the account address in the HTML
            document.getElementById('account-address').textContent = account;

            console.log("MetaMask connected with account:", account);
        } catch (error) {
            console.error("User denied account access or error occurred:", error);
            alert('Failed to connect MetaMask. Please try again.');
        }
    } else {
        alert('Please install MetaMask!');
    }
};

// Handle List Model Form
document.getElementById('list-model-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('model-name').value;
    const description = document.getElementById('model-description').value;
    const price = web3.utils.toWei(document.getElementById('model-price').value, 'ether');

    try {
        // Show loading message
        document.getElementById('loading').style.display = 'block';

        await contract.methods.listModel(name, description, price).send({ from: account });

        // Fetch all available models after listing
        fetchAvailableModels();

        alert('Model listed successfully!');
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error while listing model:', error);
        alert('Error listing model. Please try again.');
        document.getElementById('loading').style.display = 'none';
    }
});

// Fetch all available models
const fetchAvailableModels = async () => {
    try {
        const models = await contract.methods.getAllModels().call();
        const modelsList = document.getElementById('models-grid');
        modelsList.innerHTML = ''; // Clear current list

        models.forEach(model => {
            const modelItem = document.createElement('li');
            modelItem.textContent = `${model.name} - ${web3.utils.fromWei(model.price, 'ether')} ETH`;
            modelsList.appendChild(modelItem);
        });
    } catch (error) {
        console.error('Error fetching models:', error);
    }
};

// Handle Purchase Model
document.getElementById('purchase-button').addEventListener('click', async () => {
    const modelId = document.getElementById('purchase-model-id').value;

    if (!modelId) {
        alert('Please enter a model ID!');
        return;
    }

    try {
        // Show loading message
        document.getElementById('loading').style.display = 'block';

        // Ensure you have enough ETH (optional check)
        const balance = await web3.eth.getBalance(account);
        const price = await contract.methods.getModelPrice(modelId).call();
        
        if (web3.utils.toBN(balance).lt(web3.utils.toBN(price))) {
            alert('Insufficient balance');
            return;
        }

        // Purchase model
        await contract.methods.purchaseModel(modelId).send({ from: account, value: price });

        alert('Model purchased successfully!');
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error while purchasing model:', error);
        alert('Error purchasing model. Please try again.');
        document.getElementById('loading').style.display = 'none';
    }
});

// Handle Rate Model
document.getElementById('rate-button').addEventListener('click', async () => {
    const modelId = document.getElementById('purchase-model-id').value;
    const rating = document.getElementById('rating-input').value;

    if (!modelId || !rating) {
        alert('Please enter model ID and rating!');
        return;
    }

    try {
        // Show loading message
        document.getElementById('loading').style.display = 'block';

        await contract.methods.rateModel(modelId, rating).send({ from: account });

        alert('Model rated successfully!');
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error while rating model:', error);
        alert('Error rating model. Please try again.');
        document.getElementById('loading').style.display = 'none';
    }
});

// Handle Withdraw Funds
document.getElementById('withdraw-button').addEventListener('click', async () => {
    try {
        // Show loading message
        document.getElementById('loading').style.display = 'block';

        await contract.methods.withdrawFunds().send({ from: account });

        alert('Funds withdrawn successfully!');
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error while withdrawing funds:', error);
        alert('Error withdrawing funds. Please try again.');
        document.getElementById('loading').style.display = 'none';
    }
});

// Initialize the app
initApp();
