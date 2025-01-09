// Import Web3.js
const Web3 = require('web3');
let web3;

// Check if MetaMask is available
if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    // Request MetaMask connection
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            const account = accounts[0];
            console.log('Connected Account:', account);
        })
        .catch(error => {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect to MetaMask!');
        });
} else {
    alert('MetaMask is not installed. Please install it to use this application.');
}

// Set up contract ABI and address
const contractAddress = "0x41b387586B4b4619BE4FF7ad14136e122aE3F1F1"; // Replace with actual address
const contractABI =  [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "ModelListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "ModelPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "rating",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "rater",
                "type": "address"
            }
        ],
        "name": "ModelRated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getAllModels",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            }
        ],
        "name": "getModelDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasPurchased",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "listModel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "models",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "totalRating",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalReviews",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "averageRating",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            }
        ],
        "name": "purchaseModel",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "modelId",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "rating",
                "type": "uint8"
            }
        ],
        "name": "rateModel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];
let contract;
let account;

// Initialize the dApp
const initApp = async () => {
    if (window.ethereum) {
        try {
            // Request accounts
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];

            // Initialize web3 and contract
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);

            // Display the account address
            document.getElementById('account-address').textContent = account;

            console.log("MetaMask connected with account:", account);
        } catch (error) {
            console.error("MetaMask connection error:", error);
            alert('Error connecting to MetaMask. Please try again.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this application.');
    }
};

// List a model
document.getElementById('list-model-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('model-name').value;
    const description = document.getElementById('model-description').value;
    const price = web3.utils.toWei(document.getElementById('model-price').value, 'ether');

    try {
        document.getElementById('loading').style.display = 'block';
        await contract.methods.listModel(name, description, price).send({ from: account });

        alert('Model listed successfully!');
        fetchAvailableModels();
    } catch (error) {
        console.error('Error while listing model:', error);
        alert('Failed to list model.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

// Fetch available models
const fetchAvailableModels = async () => {
    try {
        const modelCount = await contract.methods.modelsLength().call();
        const modelsList = document.getElementById('models-grid');
        modelsList.innerHTML = '';

        for (let i = 0; i < modelCount; i++) {
            const model = await contract.methods.models(i).call();
            const modelItem = document.createElement('li');
            modelItem.textContent = `${model.name} - ${web3.utils.fromWei(model.price, 'ether')} ETH`;
            modelsList.appendChild(modelItem);
        }
    } catch (error) {
        console.error('Error fetching models:', error);
    }
};

// Purchase a model
document.getElementById('purchase-button').addEventListener('click', async () => {
    const modelId = document.getElementById('purchase-model-id').value;

    if (!modelId) {
        alert('Please enter a model ID!');
        return;
    }

    try {
        document.getElementById('loading').style.display = 'block';

        const price = await contract.methods.getModelPrice(modelId).call();
        await contract.methods.purchaseModel(modelId).send({ from: account, value: price });

        alert('Model purchased successfully!');
    } catch (error) {
        console.error('Error purchasing model:', error);
        alert('Failed to purchase model.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

// Rate a model
document.getElementById('rate-button').addEventListener('click', async () => {
    const modelId = document.getElementById('rate-model-id').value;
    const rating = document.getElementById('rating-input').value;

    if (!modelId || !rating) {
        alert('Please provide both model ID and rating!');
        return;
    }

    try {
        document.getElementById('loading').style.display = 'block';

        await contract.methods.rateModel(modelId, rating).send({ from: account });

        alert('Model rated successfully!');
    } catch (error) {
        console.error('Error rating model:', error);
        alert('Failed to rate model.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

// Withdraw funds
document.getElementById('withdraw-button').addEventListener('click', async () => {
    try {
        document.getElementById('loading').style.display = 'block';

        await contract.methods.withdrawFunds().send({ from: account });

        alert('Funds withdrawn successfully!');
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        alert('Failed to withdraw funds.');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

// Initialize the app when the page loads
window.onload = initApp;
