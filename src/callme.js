
var ethers = require('ethers');

var { wallet, provider } = require('./common')

var contractAddress = '';

async function main() {
	const iface = new ethers.utils.Interface([{ "constant": false, "inputs": [], "name": "callme", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "isComplete", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }]);
	var contract = new ethers.Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);
	let tx = await contractWithSigner.callme();

	var result = await tx.wait();
	console.log(result);
}


main().catch(console.error);