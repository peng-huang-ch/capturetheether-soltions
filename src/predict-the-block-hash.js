
const { utils, Contract } = require('ethers');
const { wallet, provider } = require('./common')

const contractAddress = '0x2e7da1240640cced8e14a54885b5624d99ab1fbb';

// https://www.freebuf.com/vuls/179173.html
// https://systemweakness.com/capture-the-ether-predict-the-block-hash-bdbaf870cd5d

// This piece of information is key to solve the challenge.
// We know that sometime in the future(~1 hour), 
// our current block will older than the 256 most recent blocks, 
// and if we try and get the hash through the blockhash function, it’ll return 0.

async function main() {
	const iface = new utils.Interface([
		'event Received(address, uint256)',
		'event challengeSolved(uint256 balance)',
		'function challenge() view returns (address)',
		'function destroy()',
		'function predict(bytes32 hash) payable',
		'function solve() payable',
		'function proxy(address challengeAddress)'
	]);

	// var guesser = await provider.getStorageAt('0x86309626565D1A24842965c8c0c859dF89a0b0b6', 0);
	// var settlementBlockNumber = await provider.getStorageAt('0x86309626565D1A24842965c8c0c859dF89a0b0b6', 1);
	// var guess = await provider.getStorageAt('0x86309626565D1A24842965c8c0c859dF89a0b0b6', 2);
	// console.log('guesser	: ', guesser);
	// console.log('guess  	: ', guess);
	// console.log('settlementBlockNumber : ', settlementBlockNumber);

	var contract = new Contract(contractAddress, iface, provider);
	var contractWithSigner = contract.connect(wallet);

	// 1. call the predict function
	// const options = { value: utils.parseEther('1.0') }
	// var tx = await contractWithSigner.predict('0x0000000000000000000000000000000000000000000000000000000000000000', options);
	// var result = await tx.wait();
	// console.log(result);
	// return;

	// 2. call the solve function, maybe take too long to wait for the solved
	var tx = await contractWithSigner.solve();
	var result = await tx.wait();
	console.log(result);
	console.log('done..');

	return;
}

main().catch(console.error);