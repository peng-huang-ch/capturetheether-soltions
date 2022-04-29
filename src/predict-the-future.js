
const { utils, Contract } = require('ethers');

var { wallet, provider, sleep } = require('./common')

const contractAddress = '0x7041ABb6B0deF6F6A47f7568afBbEee6BB189b1C';

async function main() {
	const iface = new utils.Interface([
		'event Received(address, uint256)',
		'event challengeSolved(uint256 balance)',
		'function challenge() view returns (address)',
		'function destroy()',
		'function predict(uint8 n) payable',
		'function solve() payable',
		'function solver(address challengeAddress)'
	]);

	// var guesser = await provider.getStorageAt('0x86309626565D1A24842965c8c0c859dF89a0b0b6', 0);
	// var settlementBlockNumber = await provider.getStorageAt('0x86309626565D1A24842965c8c0c859dF89a0b0b6', 1);
	// var guess = await provider.getStorageAt('0x86309626565D1A24842965c8c0c859dF89a0b0b6', 2);
	// console.log('guesser	: ', guesser);
	// console.log('guess  	: ', guess);
	// console.log('settlementBlockNumber : ', settlementBlockNumber);

	var contract = new Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);

	// 1. call the predict function
	// const options = { value: utils.parseEther("1.0") }
	// let tx = await contractWithSigner.predict(1, options);

	// 2. call the solve function, maybe take too long to wait for the solved
	for (let i = 0; i < 1000; i++) {
		try {
			let tx = await contractWithSigner.solve();

			console.log('tx : ', tx);
			var result = await tx.wait();
			console.log(result);
			console.log('done..')
			return;
		} catch (error) {
			console.error(i);
			await sleep(3000);
		}
	}
}

main().catch(console.error);