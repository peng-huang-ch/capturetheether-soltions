

var ethers = require('ethers');

var { wallet, provider } = require('./common')

var contractAddress = '0x3BbD3B24D32B595bdE7c38D26DfFA6260a33b7c0';

async function main() {
	const iface = new ethers.utils.Interface([
		'function collectPenalty()',
		'function withdraw()',
		'function isComplete() view returns (bool)',
		'constructor(address player) payable'
	]);
	var contract = new ethers.Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);

	let tx = await contractWithSigner.collectPenalty();
	console.log('tx : ', tx);
	var result = await tx.wait();
	console.log(result);
}


main().catch(console.error);