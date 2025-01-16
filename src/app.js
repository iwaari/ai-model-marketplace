const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "0xB773E623eE69387FeD7C71e36677139fE124a140"; // Replace with actual address
const contractABI = [
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
const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function listModel() {
    const name = document.getElementById("modelName").value.trim();
    const description = document.getElementById("modelDescription").value.trim();
    const price = document.getElementById("modelPrice").value.trim();

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
        alert("Please enter a valid price in ETH!");
        return;
    }

    try {
        const priceInWei = ethers.utils.parseEther(price);
        console.log("Parsed price in Wei:", priceInWei.toString());

        const tx = await contract.listModel(name, description, priceInWei);
        await tx.wait();
        alert("Model listed successfully!");
    } catch (error) {
        console.error("Error during listModel transaction:", error);
        alert("Error while listing the model! See console for details.");
    }
}

async function purchaseModel() {
    const modelId = document.getElementById("modelIdPurchase").value.trim();

    try {
        const model = await contract.getModelDetails(modelId);
        const price = model[2]; // Price is in Wei
        console.log("Model details fetched:", model);

        const tx = await contract.purchaseModel(modelId, { value: price });
        await tx.wait();
        alert("Model purchased successfully!");
    } catch (error) {
        console.error("Error during purchaseModel transaction:", error);
        alert("Error while purchasing the model! See console for details.");
    }
}

async function rateModel() {
    const modelId = document.getElementById("modelIdRate").value.trim();
    const rating = parseInt(document.getElementById("modelRating").value.trim(), 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Please enter a valid rating between 1 and 5!");
        return;
    }

    try {
        const tx = await contract.rateModel(modelId, rating);
        await tx.wait();
        alert("Model rated successfully!");
    } catch (error) {
        console.error("Error during rateModel transaction:", error);
        alert("Error while rating the model! See console for details.");
    }
}

async function getModelDetails() {
    const modelId = document.getElementById("modelIdDetails").value.trim();

    try {
        const details = await contract.getModelDetails(modelId);
        const name = details[0];
        const description = details[1];
        const price = ethers.utils.formatEther(details[2]);
        const creator = details[3];
        const averageRating = details[5]; // Adjusted index based on ABI

        document.getElementById("modelDetails").innerText = `
            Name: ${name}
            Description: ${description}
            Price: ${price} ETH
            Creator: ${creator}
            Average Rating: ${averageRating}
        `;
    } catch (error) {
        console.error("Error during getModelDetails transaction:", error);
        alert("Error while fetching model details! See console for details.");
    }
}

async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert("Funds withdrawn successfully!");
    } catch (error) {
        console.error("Error during withdrawFunds transaction:", error);
        alert("Error while withdrawing funds! See console for details.");
    }
}

// Connection handler
async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("MetaMask connected!");
        } catch (error) {
            console.error("MetaMask connection failed:", error);
        }
    } else {
        alert("MetaMask is not installed!");
    }
}

// Improved testConversion function
function testConversion() {
    const price = document.getElementById("modelPrice").value.trim();

    try {
        const priceInWei = ethers.utils.parseEther(price);
        console.log("Input (ETH):", price);
        console.log("Converted to Wei:", priceInWei.toString());
    } catch (error) {
        console.error("Error during conversion:", error);
        alert("Invalid input for price! Make sure it's a valid number.");
    }
}

// Connect MetaMask on page load
connectMetaMask();
