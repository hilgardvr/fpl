const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const https = require('https');
const path = require('path');
const fplApi = 'https://fantasy.premierleague.com/api/bootstrap-static/';

app.use(express.static(__dirname + "/public"));

let playerData = [];

function createData (jsonData) {
    playerData = [];
    /* for (let i = 40; i < 50; i++) {
        console.log(jsonData.elements[i]);
    } */
	console.log("jsonData: ", jsonData);
	if (jsonData) {
		for (let i = 0; i < jsonData.elements.length; i++) { //jsonData.elements.length; i++) {
			const price = parseFloat(jsonData.elements[i].now_cost);
			const elemType = parseInt(jsonData.elements[i].element_type);
			const minutes = parseInt(jsonData.elements[i].minutes);
			const points = parseInt(jsonData.elements[i].total_points);
			const ppg = parseFloat(jsonData.elements[i].points_per_game);
			const ppm = points / price;
			const ppgpm = ppg / (price / 10);
			const ppgmpm = points / minutes * 90 / (price / 10);
			const selected_by_percent = parseFloat(jsonData.elements[i].selected_by_percent);
			const market_cap = price * selected_by_percent; 
			const newPlayer = {
				"name": jsonData.elements[i].first_name + " " + jsonData.elements[i].web_name,
				"position": elemType,
				"price": price,
				"points": points,
				"ppg": ppg,
				"total_points": points,
				"minutes": minutes,
				"ppm": ppm,
				"ppgpm": ppgpm,
				"ppgmpm": ppgmpm,
				"selected_by_percent": selected_by_percent,
				"market_cap": market_cap
			}
			playerData.push(newPlayer);
		}
    	console.log("Player data created");
	} else {
    	console.log("Player data is empty");
	}
}

function getData () {
	console.log("calling get " + fplApi);
    https.get(fplApi, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            createData(JSON.parse(data));
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}! Retrieving api data.`);
    getData();
});

app.get('/', (req, res) => {
    console.log("Index page requst received");
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/playerDataApi', (req, res) => {
    console.log("Player data api request received");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(playerData));
});
