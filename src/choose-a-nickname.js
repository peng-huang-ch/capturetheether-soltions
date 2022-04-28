
const { utils, Contract } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee';

async function main() {
	const iface = new utils.Interface([
		'function nicknameOf(address) view returns (bytes32)',
		'function setNickname(bytes32 nickname)'
	]);

	var contract = new Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);
	let name = utils.formatBytes32String('aaron');
	let tx = await contractWithSigner.setNickname(name);

	var result = await tx.wait();
	console.log(result);
}


main().catch(console.error);