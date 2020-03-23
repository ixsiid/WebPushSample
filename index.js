const express = require('express');
const path = require('path');

const webpush = require('web-push');

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const fs = require("fs");
const vapidDetails = require('./vapid.json');

app.post('/subscribe', (req, res) => {
	const id = req.body.endpoint.match(/\/([^\/]*?)\:/)[1];
	let success = false;
	try {
		fs.writeFileSync(path.join('subscribe', id + '.json'), JSON.stringify(req.body));
		console.log(`new subscription: ${id}`);
		success = true;
	} catch (err) {
		console.log(err);
	}
	
	res.status(201).json({ success, id });
});

app.post("/unscribe", (req, res) => {
	const file = req.body.id + '.json';
	fs.unlink(path.join('subscribe', file), err => console.log(err || `Delete ${file}`));
	res.status(201).json({ message: 'Subscribe data has probably been deleted.' });
});

app.post("/notify", (req, res) => {
	let success = false;

	const payload = JSON.stringify(req.body);
	const options = {
		vapidDetails,
		TTL: req.body.ttl || 3600,
		headers: { 'headerName': 'header value' },
	};

	(req.body.id instanceof Array ? req.body.id : [req.body.id]).forEach(id => {
		const pushSubscription = JSON.parse(fs.readFileSync(path.join('subscribe', id + '.json'), 'utf8'));

		webpush.sendNotification(
			pushSubscription,
			payload,
			options
		);
	});
	success = true;

	res.status(201).json({ success });
});

// app.use(express.static('public'));

app.all('*', (req, res) => {
	console.log(`Unknown access, base: [${req.baseUrl}], original: [${req.originalUrl}]`);
});

app.listen(48211, _ => console.log("listen started"));




