
const { utils, Contract } = require('ethers');

var { wallet, provider } = require('./common')

const contractAddress = '0xa512F128aB23D1d9a36C8D053585f5E1ff2D5603';
var answerHash = '0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365';

function guessSecretNumber(answerHash) {
	for (let i = 0; ; i++) {
		if (utils.keccak256(i) === answerHash) {
			return i;
		}
		console.log('i :', i);
	}
}

async function main() {
	const answer = guessSecretNumber(answerHash);
	console.log('answer', answer);
	const iface = new utils.Interface([
		'function guess(uint8 n) payable',
		'function isComplete() view returns (bool)'
	]);

	var contract = new Contract(contractAddress, iface, provider);
	let contractWithSigner = contract.connect(wallet);
	const options = { value: utils.parseEther("1.0") }
	let tx = await contractWithSigner.guess(answer, options);

	var result = await tx.wait();
	console.log(result);
}

main().catch(console.error);