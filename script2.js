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

// Store references to popup windows
const popups = {};

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
    console.log(data);
    const games = data.response;

    // const nextFixtures = games.slice(0, 20);

    displayFixtures(games);
  } catch (error) {
    console.error("Error: something went wrong", error.message);
  }
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
    console.log(data);
    const games = data.response;

    // const recentResults = games.slice(-20);

    displayResults(games);
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

function displayResults(games) {
  const resultsTable = games
    .map(
      (game) => `
        <tr class="result-row" data-id="${game.fixture.id}">
          <td>Round ${game.league.round.slice(-2).trim()}</td>
          <td class='${game.teams.home.winner == true ? "winner" : "loser"}'>
            <img src=${game.teams.home.logo} height='20'</img> ${
        game.teams.home.name
      }
          </td> 
          <td>vs</td> 
          <td class='${game.teams.away.winner == true ? "winner" : "loser"}'>
            ${game.teams.away.name} <img src=${
        game.teams.away.logo
      } height='20'</img>
          </td>
          <td>${game.score.fulltime.home} - ${game.score.fulltime.away}</td>
          <td>(${game.score.halftime.home} - ${game.score.halftime.away})</td>
        </tr>`
    )
    .join("");

  const resultsTableHTML = `
  <h1 class='title'>RESULTS</h1>
  <table class='table matches'>
    ${resultsTable}
  </table>
`;

  document.getElementById("results").innerHTML = resultsTableHTML;

  // Add event listener to result rows for showing match statistics
  document.querySelectorAll(".result-row").forEach((row) => {
    row.addEventListener("click", async (event) => {
      const matchId = row.getAttribute("data-id");
      await showMatchStatistics(matchId);
    });
  });
}

// async function showMatchStatistics(matchId) {
//   const apiUrlStatistics = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${matchId}`;
//   try {
//     const response = await fetch(apiUrlStatistics, {
//       method: "GET",
//       headers: {
//         "x-rapidapi-host": "v3.football.api-sports.io",
//         "x-rapidapi-key": apiKey,
//       },
//     });

//     const data = await response.json();
//     console.log(data);
//     const stats = data.response;

//     // Display statistics in a popup window (or modal)
//     displayStatisticsPopup(stats, matchId);
//   } catch (error) {
//     console.error("Error fetching match statistics", error.message);
//   }
// }

// function displayStatisticsPopup(stats, matchId) {
//   const statsHTML = `
//     <h2>Match Statistics</h2>
//     <p>${JSON.stringify(stats)}</p>
//   `;
//   const popupName = `popup_${matchId}`;
//   let statsPopup = window.open("", popupName, "width=600,height=400");
//   if (statsPopup) {
//     statsPopup.document.write(statsHTML);
//   } else {
//     statsPopup = window.open("", popupName, "width=600,height=400");
//     statsPopup.document.write(statsHTML);
//   }

//   // Store the popup reference
//   popups[popupName] = statsPopup;
// }

async function showMatchStatistics(matchId) {
  const apiUrlStatistics = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${matchId}`;
  try {
    const response = await fetch(apiUrlStatistics, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": apiKey,
      },
    });

    const data = await response.json();
    console.log(data);

    // Ensure the response and statistics data are valid
    if (data.response && data.response.length > 0) {
      const stats = data.response;
      displayStatisticsPopup(stats, matchId);
    } else {
      console.error("Error: No statistics data available for this match.");
    }
  } catch (error) {
    console.error("Error fetching match statistics", error.message);
  }
}

function displayStatisticsPopup(stats, matchId) {
  // Create a dictionary to hold the statistics for each team
  const teamStats = {};
  stats.forEach((stat) => {
    teamStats[stat.team.name] = {
      logo: stat.team.logo,
      statistics: {},
    };
    stat.statistics.forEach((s) => {
      teamStats[stat.team.name].statistics[s.type] =
        s.value === null ? 0 : s.value;
    });
  });

  // Extract the team names
  const teamNames = Object.keys(teamStats);
  const team1 = teamNames[0];
  const team2 = teamNames[1];

  // Debugging logs
  console.log("Team 1:", teamStats[team1]);
  console.log("Team 2:", teamStats[team2]);

  // Create the HTML content for the popup
  const statsHTML = `
    <h2>Match Statistics</h2>
    <h3>${team1} - ${team2}</h3>
    <table>
      <tr>
        <th><img src="${
          teamStats[team1].logo
        }" alt="${team1} logo" height="40"></th>
        <th></th>
        <th><img src="${
          teamStats[team2].logo
        }" alt="${team2} logo" height="40"></th>
      </tr>
      ${Object.keys(teamStats[team1].statistics)
        .map(
          (statType) => `
        <tr>
          <td>${teamStats[team1].statistics[statType]}</td>
          <td>${statType}</td>
          <td>${teamStats[team2].statistics[statType]}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;

  const popupName = `popup_${matchId}`;
  let statsPopup = window.open("", popupName, "width=400,height=600");

  // Apply CSS styles and font to the popup
  if (statsPopup) {
    statsPopup.document.write(`
      <html>
      <head>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap" rel="stylesheet">
      </head>
      <body class="popUp">${statsHTML}</body>
      </html>
    `);
  } else {
    statsPopup = window.open("", popupName, "width=400,height=600");
    statsPopup.document.write(`
      <html>
      <head>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans+Narrow&display=swap" rel="stylesheet">
      </head>
      <body class="popUp">${statsHTML}</body>
      </html>
    `);
  }

  popups[popupName] = statsPopup;
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
