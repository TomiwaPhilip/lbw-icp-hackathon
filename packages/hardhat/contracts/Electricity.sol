//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract GnosisEnergy {
	struct Payment {
		uint256 id;
		uint256 amount;
		uint256 value;
		uint256 timestamp;
	}
	uint256 public energyPrice; // price in xDai per 1kw of energy
	address public owner; // address of contract deployer alias distro company
	uint256 public totalEnergyCount; // total amount of payments made by all users
	//store the history of payments made by a user
	mapping(address => Payment[]) internal userPayment;

	event EnergyPurchased(address indexed user, uint256 amount);
	event PriceUpdated(uint256 currAmount);
	event withdrawal(uint256 amount, address indexed owner);

	constructor(uint256 _initialEnergyPrice, address _addr) {
		owner = _addr;
		// _initialEnergyPrice =_initialEnergyPrice * (10**18);
		energyPrice = _initialEnergyPrice;
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Unauthorized");
		_;
	}

	// function to allow smart contract recieve funds
	receive() external payable {}

	// function to update the unit price  of energy
	function updateEnergyPrice(uint256 _newPrice) external onlyOwner {
		// _newPrice = _newPrice * (10**18);
		energyPrice = _newPrice;
		emit PriceUpdated(energyPrice);
	}

	function makePayment() external payable {
		if (msg.value < energyPrice) {
			revert("low funds");
		}
		_recordPayment(msg.sender, msg.value);
	}
	//function to get a user history of payments
	function getUserPaymentHistory(
		address _user
	) external view returns (Payment[] memory) {
		return userPayment[_user];
	}
	// Function to record a payment
	function _recordPayment(address payer, uint256 amount) private {
		if (amount < 0 || msg.sender.balance < amount) {
			revert("record failed");
		}
		totalEnergyCount += 1;
		uint256 value = amount * energyPrice;
		userPayment[payer].push(
			Payment(totalEnergyCount, amount, value, block.timestamp)
		);
		emit EnergyPurchased(msg.sender, msg.value);
	}

	// Function to transfer the contract's balance to a specified address
	function withdrawFunds(address payable recipient) public payable onlyOwner {
		uint256 contractBalance = address(this).balance;
		require(contractBalance > 0, "zero balance");
		(bool sent, ) = recipient.call{ value: contractBalance }("");
		require(sent, "Failed to send funds");
		emit withdrawal(contractBalance, recipient);
	}
}
