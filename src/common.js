require('dotenv').config();

var ethers = require('ethers');

var priv = process.env.PRIVATE_KEY;
const NODE_URL = process.env.NODE_URL;

const provider = new ethers.providers.getDefaultProvider(NODE_URL);
const wallet = new ethers.Wallet(priv, provider);

exports.provider = provider;
exports.wallet = wallet;


async function sleep(seconds) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, seconds);
	});
}

exports.sleep = sleep;