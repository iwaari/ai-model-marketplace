// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {

    struct Model {
        string name;
        string description;
        uint256 price;
        address creator;
        uint256 totalRating;
        uint256 totalReviews;
        uint256 averageRating; // Store the average rating to save on calculations
    }

    // Array to store all models
    Model[] public models;

    // Mapping to track which users purchased which models
    mapping(uint256 => mapping(address => bool)) public hasPurchased;

    // Event declarations for better logging
    event ModelListed(uint256 modelId, string name, uint256 price, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating, address rater);

    // Function to list a new AI model
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero");
        require(bytes(name).length > 0, "Model name is required");
        require(bytes(description).length > 0, "Model description is required");

        models.push(Model({
            name: name,
            description: description,
            price: price,
            creator: msg.sender,
            totalRating: 0,
            totalReviews: 0,
            averageRating: 0
        }));

        // Emit event for successful listing
        emit ModelListed(models.length - 1, name, price, msg.sender);
    }

    // Function to purchase a model
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Invalid model ID");
        Model storage model = models[modelId];

        require(msg.value == model.price, "Incorrect payment amount");
        require(!hasPurchased[modelId][msg.sender], "You have already purchased this model");

        hasPurchased[modelId][msg.sender] = true;

        // Transfer payment to the creator
        payable(model.creator).transfer(msg.value);

        // Emit event for successful purchase
        emit ModelPurchased(modelId, msg.sender);
    }

    // Function to rate a purchased model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Invalid model ID");
        require(hasPurchased[modelId][msg.sender], "You must purchase the model before rating");
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5");

        Model storage model = models[modelId];

        // Update total rating and reviews count
        model.totalRating += rating;
        model.totalReviews += 1;

        // Update average rating (simpler than recalculating each time)
        model.averageRating = model.totalRating / model.totalReviews;

        // Emit event for successful rating
        emit ModelRated(modelId, rating, msg.sender);
    }

    // Function to retrieve model details
    function getModelDetails(uint256 modelId)
        public
        view
        returns (string memory, string memory, uint256, address, uint256, uint256)
    {
        require(modelId < models.length, "Invalid model ID");

        Model storage model = models[modelId];

        return (
            model.name,
            model.description,
            model.price,
            model.creator,
            model.averageRating,
            model.totalReviews
        );
    }

    // Function to retrieve all model IDs
    function getAllModels() public view returns (uint256[] memory) {
        uint256[] memory modelIds = new uint256[](models.length);
        for (uint256 i = 0; i < models.length; i++) {
            modelIds[i] = i;
        }
        return modelIds;
    }

    // Function to withdraw funds for the owner (contract-level)
    function withdrawFunds() public {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");
        payable(msg.sender).transfer(balance);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
