
const { utils, Contract } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0xf3AF4D467E7aEf028c4AcF66ed84383f4FF5890D';

async function main() {
	const iface = new utils.Interface([
		'function guess(uint8 n) payable',
		'function isComplete() view returns (bool)'
	]);

	var contract = new Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);

	const options = { value: utils.parseEther("1.0") }
	let tx = await contractWithSigner.guess(42, options);

	var result = await tx.wait();
	console.log(result);
}


main().catch(console.error);