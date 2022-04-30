
const { utils, Contract } = require('ethers');

var { wallet, provider } = require('./common')

// the solve contract
// you should deploy the contract under the same account as the challenge contract
// the solve contract should be deployed to the same address as the challenge contract
// the contract could be found under the src/contracts/GuessTheNewNumberSolver.sol file
const contractAddress = '0xbA2C6382d99505c24D65559839514b0222792154';

async function main() {
	const iface = new utils.Interface([
		'function destroy()',
		'function solve() payable',
		'constructor(address _challengeAddress)',
		'function challenge() view returns (address)'
	]);
	var contract = new Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);
	const options = { value: utils.parseEther("1.0") };
	let tx = await contractWithSigner.solve(options);

	var result = await tx.wait();
	console.log(result);
}

main().catch(console.error);