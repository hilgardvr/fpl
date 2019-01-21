const express = require('express');
const app = express();
const port = 3000;
const https = require('https');
const path = require('path');
const fplApi = 'https://fantasy.premierleague.com/drf/bootstrap-static';

app.use(express.static(__dirname + "/public"));

let playerData = [];

function createData (jsonData) {
    playerData = [];
    /* for (let i = 40; i < 50; i++) {
        console.log(jsonData.elements[i]);
    } */
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
            /*
            id: 44,
            photo: '178304.jpg',
            web_name: 'Mousset',
            team_code: 91,
            status: 'a',
            code: 0,
            first_name: 'Lys',
            second_name: 'Mousset',
            squad_number: 9,
            news: '',
            now_cost: 49,
            news_added: '2018-09-01T13:01:13Z',
            chance_of_playing_this_round: 100,
            chance_of_playing_next_round: 100,
            value_form: '0.2',
            value_season: '2.7',
            cost_change_start: -1,
            cost_change_event: 0,
            cost_change_start_fall: 1,
            cost_change_event_fall: 0,
            in_dreamteam: false,
            dreamteam_count: 0,
            selected_by_percent: '0.2',
            form: '1.0',
            transfers_out: 17841,
            transfers_in: 10444,
            transfers_out_event: 422,
            transfers_in_event: 487,
            loans_in: 0,
            loans_out: 0,
            loaned_in: 0,
            loaned_out: 0,
            total_points: 13,
            event_points: 1,
            points_per_game: '0.9',
            ep_this: '1.0',
            ep_next: '1.0',
            special: false,
            minutes: 149,
            goals_scored: 0,
            assists: 0,
            clean_sheets: 0,
            goals_conceded: 9,
            own_goals: 0,
            penalties_saved: 0,
            penalties_missed: 0,
            yellow_cards: 1,
            red_cards: 0,
            saves: 0,
            bonus: 0,
            bps: 28,
            influence: '14.0',
            creativity: '45.1',
            threat: '57.0',
            ict_index: '11.3',
            ea_index: 0,
            element_type: 4,
            team: 2*/
        }
        playerData.push(newPlayer);
    }
    console.log("Player data created");
}

function getData () {
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
