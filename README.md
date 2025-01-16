# AI Model Marketplace Decentralized Application (dApp)

A decentralized application (dApp) built on the Ethereum blockchain allowing users to list, purchase, and rate AI models. This project uses Solidity for smart contract development, Web3.js for Ethereum interactions, and MetaMask for wallet management.

## Features

- **List AI Models**: Users can list their AI models by specifying a name, description, and price.
- **Purchase AI Models**: Users can purchase AI models by sending the correct price in Ether (ETH).
- **Rate AI Models**: Users who have purchased a model can rate it between 1 to 5 stars.
- **Retrieve Model Details**: Users can view a model's name, description, price, creator’s address, average rating, and total reviews.
- **Get All Models**: Users can retrieve a list of all models available in the marketplace.

## Technologies Used

- **Solidity**: Smart contract language for Ethereum blockchain.
- **Truffle Framework**: Tool for smart contract development, testing, and deployment.
- **Web3.js**: JavaScript library for interacting with Ethereum nodes.
- **MetaMask**: Ethereum wallet for browser-based interactions with the dApp.
- **Ganache**: Personal Ethereum blockchain for local development.

## Smart Contract Functions

### 1. **listModel()**
   - Allows users to list AI models with a name, description, and price (in Ether).
   - Emits the `ModelListed` event.

### 2. **purchaseModel()**
   - Allows users to purchase a model by sending the exact Ether amount.
   - Ensures the correct price is paid and the model is not purchased multiple times by the same address.
   - Emits the `ModelPurchased` event.

### 3. **rateModel()**
   - Allows users who have purchased a model to leave a rating between 1 and 5 stars.
   - Emits the `ModelRated` event.

### 4. **getModelDetails()**
   - Retrieves model details such as name, description, price, creator, average rating, and total reviews.

### 5. **getAllModels()**
   - Retrieves all available model IDs for display.

### 6. **withdrawFunds()**
   - Allows the contract owner to withdraw contract funds (if applicable).

## Installation and Usage

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-model-marketplace.git
cd ai-model-marketplace
```
