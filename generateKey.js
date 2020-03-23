const fs = require('fs');
const path = require('path');

const webpush = require('web-push');

if (process.argv.length <= 2) {
	console.log('ERROR: please run `node generateKey.js YOUR_DOMAIN_NAME`');
	return;
}

const keys = webpush.generateVAPIDKeys();
console.log('public');
console.log(keys.publicKey);
console.log('private');
console.log(keys.privateKey);

fs.writeFile('vapid.json', JSON.stringify({
	subject: 'https://' + process.argv[2],
	publicKey: keys.publicKey,
	privateKey: keys.privateKey,
}), err => {
	if (err) {
		console.error('Unknown error');
		console.error(err);
	} else {
		console.log('Saved "vapid.json"');
	}
});

fs.writeFile(path.join('public', 'key.js'), `const API_KEY = "${keys.publicKey}";`, err => {
	if (err) {
		console.error('Unknown error');
		console.error(err);
	} else {
		console.log('Saved "public/key.js");
	}
});


