const keepers = [];
const defenders = [];
const midfielders = [];
const strikers = [];
const allPlayers = [];
let displayed = [];
let sortBy = "points";

function sortData(data, sortBy) {
    data.sort((p1, p2) => p2[sortBy] - p1[sortBy]);
};


function createTable(tableID, bodyID) {
    const table = `
        <h2><span id="head-span"></span><span id="sortby-span"></span></h2>
        <table id=${tableID}>
            <thead>
                <tr id="table-header-row">
                    <th id="th0">Name</th>
                    <th id="th2">Total Points</th>
                    <th id="th4">Points Per Game</th>
                    <th id="th1">Price</th>   
                    <th id="th3">Total Points/Million</th>
                    <th id="th5">PPG/Million</th>
                    <th id="th6">% Owned</th>
                    <th id="th7">Market Cap</th>
                </tr>
            </thead>
            <tbody id=${bodyID}></tbody>
        </table>`;
    return table;
}

function createTableRow(id, td0, td1, td2, td3, td4, td5, td6, td7) {
    let tableBody = document.getElementById(id);
    let row = tableBody.insertRow();
    const rowData = `
        <td>${td0}</td>
        <td class="middle">${td1}</td>
        <td class="middle">${td2}</td>
        <td class="middle">${td3}</td>
        <td class="middle">${td4}</td>
        <td class="middle">${td5}</td>
        <td class="middle">${td6}</td>
        <td class="middle">${td7}</td>
    `;
    row.innerHTML = rowData;
    
}

function tablePlayers(players, playerType) {
    displayed = players.slice();
    sortData(displayed, sortBy);
    let elem = document.getElementById("tables");
    elem.innerHTML += createTable("id", playerType);
    displayed.forEach(player => {
        createTableRow(playerType, player.name, player.points, player.ppg, player.price /10, 
            player.ppm.toFixed(2), player.ppgpm.toFixed(2), player.selected_by_percent.toFixed(2), 
            player.market_cap.toFixed(2));
    });
    document.getElementById("sortby-span").innerHTML = createTableHeaderSortBy();
}

function selectTypeVariable(str) {
    let type = allPlayers;
    switch (str) {
        case "keepers":
            type = keepers;
            break;
        case "defenders":
            type = defenders;
            break;
        case "midfielders":
            type = midfielders;
            break;
        case "strikers":
            type = strikers;
            break;
        case "allPlayers":
            type = allPlayers;
            break;
        default:
            break;
    }
    return type;
}

function createTableHeader(str) {
    switch (str) {
        case "keepers":
            str = "Goal Keepers";
            break;
        case "defenders":
            str = "Defenders";
            break;
        case "midfielders":
            str = "Midfielders";
            break;
        case "strikers":
            str = "Strikers";
            break;
        case "allPlayers":
            str = "All Players";
            break;
        default:
            break;
    }
    return str;
}

function createTableHeaderSortBy() {
    let str = "";
    switch (sortBy) {
        case "points":
            str = " - Sorted By Points";
            break;
        case "ppg":
            str = " - Sorted By Points Per Game";
            break;
        case "price":
            str = " - Sorted By Price";
            break;
        case "ppm":
            str = " - Sorted By Points/Million";
            break;
        case "ppgpm":
            str = " - Sorted By Points Per Game/Mil";
            break;
        case "selected_by_percent":
            str = " - Sorted By % Owned";
            break;
        case "market_cap":
            str = " - Sorted By Market Cap";
            break;
        default:
            str = " - Sorted";
            break;
    }
    return str;
}

function addPlayerButtonListeners () {
    let playerButtons = document.getElementsByClassName('select-player-buttons');
    for (let i = 0; i < playerButtons.length; i++) {
        playerButtons[i].addEventListener("click", (value) => {
            document.getElementById("tables").innerHTML = "";
            document.getElementById("select-sortBy").style.display = "block";
            let type = selectTypeVariable(value.target.value);
            tablePlayers(type, value.target.value);
            document.getElementById("head-span").innerHTML = createTableHeader(value.target.value);
        });
    };
}

function addSortByButtonListeners () {
    let sortByButtons = document.getElementsByClassName('sort-by-buttons');
    for (let i = 0; i < sortByButtons.length; i++) {
        sortByButtons[i].addEventListener("click", (value) => {
            let temp = document.getElementById("head-span").innerHTML;
            document.getElementById("tables").innerHTML = "";
            switch (value.target.value) {
                case "total-points":
                    sortBy = "points";
                    break;
                case "ppg":
                    sortBy = "ppg";
                    break;
                case "price":
                    sortBy = "price";
                    break;
                case "ppm":
                    sortBy = "ppm";
                    break;
                case "ppgpm":
                    sortBy = "ppgpm";
                    break;
                case "selected_by_percent":
                    sortBy = "selected_by_percent";
                    break;
                case "market_cap":
                    sortBy = "market_cap";
                    break;
                default:
                    return;
            }
            tablePlayers(displayed, value.target.value);
            document.getElementById("head-span").innerHTML = temp;
        });
    };
}

document.addEventListener('DOMContentLoaded',() => {
    fetch("/playerDataApi")
        .then((resp) => resp.json())
        .then(data => {
            // Received data - allocating player by position
            data.forEach(x => {
            switch (x.position) {
                case 1:
                    keepers.push(x);
                    allPlayers.push(x);
                    break;
                case 2:
                    defenders.push(x);
                    allPlayers.push(x);
                    break;
                case 3:
                    midfielders.push(x);
                    allPlayers.push(x);
                    break;
                case 4:
                    strikers.push(x);
                    allPlayers.push(x);
                    break;
            }
        });
        document.getElementById("select-sortBy").style.display = "none";
        addPlayerButtonListeners();
        addSortByButtonListeners ();
    })
    .catch(err => console.log(err));
});
