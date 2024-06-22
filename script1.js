const menuBtn = document.querySelector(".fa-bars");
const navbar = document.querySelector(".navbar");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});

const apiKey = "63c5a6bf56f958b121ecd6b7ae6307f0";
const apiUrlStandings =
  "https://v3.football.api-sports.io/standings?league=140&season=2023";
const apiUrlScorers =
  "https://v3.football.api-sports.io/players/topscorers?league=140&season=2023";
const apiUrlResults =
  "https://v3.football.api-sports.io/fixtures?league=140&season=2023";
const apiUrlFixtures =
  "https://v3.football.api-sports.io/fixtures?league=140&season=2024";

async function getFixtures() {
  try {
    const response = await fetch(apiUrlFixtures, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": apiKey,
      },
    });

    const data = await response.json();
    const games = data.response;

    displayFixtures(games);
  } catch (error) {
    console.error("Error: something went wrong", error.message);
  }
}

function displayFixtures(games) {
  const fixturesTable = games
    .map(
      (game) => `
        <tr><td>Round ${game.league.round.slice(-2).trim()}</td><td class='${
        game.teams.home.winner == true ? "winner" : "loser"
      }'><img src=${game.teams.home.logo} height='20'</img> ${
        game.teams.home.name
      }</td> <td>vs</td> <td class='${
        game.teams.away.winner == true ? "winner" : "loser"
      }'>${game.teams.away.name} <img src=${
        game.teams.away.logo
      } height='20'</img></td>
        <td>${game.fixture.date.slice(0, 10)}</td>
        <td>${game.fixture.date.slice(11, 16)}</td></tr>`
    )
    .join("");

  const fixturesTableHTML = `
  <h1 class='title'>Next in LA LIGA</h1><table class='table matches'>
    ${fixturesTable}
  </table>
`;

  document.getElementById("schedule").innerHTML = fixturesTableHTML;
}

async function getResults() {
  try {
    const response = await fetch(apiUrlResults, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": apiKey,
      },
    });

    const data = await response.json();
    const games = data.response;

    displayResults(games);
  } catch (error) {
    console.error("Error: something went wrong", error.message);
  }
}

function displayResults(games) {
  const resultsTable = games
    .map(
      (game) => `
        <tr><td>Round ${game.league.round.slice(-2).trim()}</td><td class='${
        game.teams.home.winner == true ? "winner" : "loser"
      }'><img src=${game.teams.home.logo} height='20'</img> ${
        game.teams.home.name
      }</td> <td>vs</td> <td class='${
        game.teams.away.winner == true ? "winner" : "loser"
      }'>${game.teams.away.name} <img src=${
        game.teams.away.logo
      } height='20'</img></td>
        <td>${game.score.fulltime.home} - ${game.score.fulltime.away}</td>
        <td>(${game.score.halftime.home} - ${
        game.score.halftime.away
      })</td></tr>`
    )
    .join("");

  const resultsTableHTML = `
  <h1 class='title'>RESULTS</h1>
  <table class='table matches'>
    ${resultsTable}
  </table>
`;

  document.getElementById("results").innerHTML = resultsTableHTML;
}

async function getStandings() {
  try {
    const response = await fetch(apiUrlStandings, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": apiKey,
      },
    });

    const data = await response.json();
    const standings = data.response[0].league.standings[0];

    displayStandings(standings);
  } catch (error) {
    console.error("Error: something went wrong", error.message);
  }
}

function displayStandings(standings) {
  const standingsTable = standings
    .map(
      (team) => `
      <tr>
        <td>${team.rank}</td>
        <td><img src=${team.team.logo} height='20'></td>
        <td class='teamName'>${team.team.name}</td>
        <td class='points'>${team.points}</td>
        <td>${team.all.win}</td>
        <td>${team.all.draw}</td>
        <td>${team.all.lose}</td>
        <td>${team.all.goals.for}</td>
        <td>${team.all.goals.against}</td>
        <td>${team.goalsDiff}</td>
      </tr>
    `
    )
    .join("");

  const standingsTableHTML = `
    <h1 class='title'>STANDINGS</h1>
    <table class='table'>
      <tr class='tableHeading'>
        <td></td><td></td><td></td><td>P</td><td>W</td><td>D</td><td>L</td><td>GF</td><td>GA</td><td>GD</td>
      </tr>
      ${standingsTable}
    </table>
  `;

  document.getElementById("standings").innerHTML = standingsTableHTML;
}

async function getScorers() {
  try {
    const response = await fetch(apiUrlScorers, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": apiKey,
      },
    });

    const data = await response.json();
    const scorers = data.response;

    displayScorers(scorers);
  } catch (error) {
    console.error("Error: something went wrong", error.message);
  }
}

function displayScorers(scorers) {
  const goalscorersTable = scorers
    .map(
      (player) => `
     <td class='playerName'>
    ${player.player.firstname} ${player.player.lastname}<td><td class='teamName'>${player.statistics[0].team.name}<td><td>${player.player.nationality}<td><td>${player.statistics[0].goals.total}<td></tr>`
    )
    .join("");

  const goalscorersTableHTML = `<h1 class='title'>TOP 20 GOALSCORERS</h1><table class='table scorers'><tr class='tableHeading'><td>Player<td><td>Team<td><td>Country<td><td>Goals<td></tr><tr>
      ${goalscorersTable}
    </table>
  `;

  document.getElementById("goalscorers").innerHTML = goalscorersTableHTML;
}

getFixtures();
getResults();
getStandings();
getScorers();
