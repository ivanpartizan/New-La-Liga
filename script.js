// const urlMatch = `https://api.football-data.org/v4/competitions/PD/matches?status=FINISHED`;

// const scroll = new SmoothScroll('a[href*="#"]');

const urlMatches =
  "https://api.football-data.org/v2/competitions/2014/matches?status=SCHEDULED";

const urlStandings =
  "https://api.football-data.org/v2/competitions/2014/standings?standingType=TOTAL";

const urlResults =
  "https://api.football-data.org/v2/competitions/2014/matches?status=FINISHED";

const urlScorers = "https://api.football-data.org/v2/competitions/2014/scorers";

async function getMatches() {
  const response = await fetch(urlMatches, {
    method: "GET",
    headers: {
      "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e",
    },
  });
  const data = await response.json();
  console.log(data);

  document.getElementById(
    "schedule"
  ).innerHTML = `<h1 class='title'>Next in LA LIGA</h1><table class='table matches'><tr>
  ${data.matches
    .slice(0, 10)
    .map(
      (match) => `<td>${match.utcDate.slice(
        0,
        10
      )}</td> <td>${match.utcDate.slice(11, 16)} GMT</td><td>
    ${match.homeTeam.name}</td><td>${match.awayTeam.name}</td></tr>`
    )
    .join("")}</table>
  `;
}

async function getStandings() {
  const response = await fetch(urlStandings, {
    method: "GET",
    headers: {
      "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e",
    },
  });
  const data = await response.json();
  console.log(data);

  document.getElementById(
    "standings"
  ).innerHTML = `<h1 class='title'>STANDINGS</h1><table class='table'>
  <tr class='tableHeading'><td></td><td></td><td></td><td>P</td><td>W</td><td>D</td><td>L</td><td>GF</td><td>GA</td><td>GD</td></tr>
  <tr>
  ${data.standings[0].table
    .map(
      (team) => `

    <td>${team.position}</td><td><img src=${team.team.crestUrl} height='20'></td><td>${team.team.name}</td><td class='points'>${team.points}</td><td>${team.won}</td><td>${team.draw}</td><td>${team.lost}</td><td>${team.goalsFor}</td><td>${team.goalsAgainst}</td><td>${team.goalDifference}</td>
    </tr>`
    )
    .join("")}</table>
  `;

  // document.getElementById(
  //   "standingsHome"
  // ).innerHTML = `<h1 class='title'>HOME</h1><table class='table'>
  // <tr class='tableHeading'><td></td><td></td><td></td><td>P</td><td>W</td><td>D</td><td>L</td><td>GF</td><td>GA</td><td>GD</td></tr>
  // <tr>
  // ${data.standings[1].table
  //   .map(
  //     (team) => `

  //   <td>${team.position}</td><td><img src=${team.team.crestUrl} height='20'></td><td>${team.team.name}</td><td class='points'>${team.points}</td><td>${team.won}</td><td>${team.draw}</td><td>${team.lost}</td><td>${team.goalsFor}</td><td>${team.goalsAgainst}</td><td>${team.goalDifference}</td>
  //   </tr>`
  //   )
  //   .join("")}</table>
  // `;

  // document.getElementById(
  //   "standingsHome"
  // ).style.backgroundImage = `<img src="silhouette1.svg">`;

  // document.getElementById(
  //   "standingsAway"
  // ).innerHTML = `<h1 class='title'>AWAY</h1><table class='table'>
  // <tr class='tableHeading'><td></td><td></td><td></td><td>P</td><td>W</td><td>D</td><td>L</td><td>GF</td><td>GA</td><td>GD</td></tr>
  // <tr>
  // ${data.standings[2].table
  //   .map(
  //     (team) => `

  //   <td>${team.position}</td><td><img src=${team.team.crestUrl} height='20'></td><td>${team.team.name}</td><td class='points'>${team.points}</td><td>${team.won}</td><td>${team.draw}</td><td>${team.lost}</td><td>${team.goalsFor}</td><td>${team.goalsAgainst}</td><td>${team.goalDifference}</td>
  //   </tr>`
  //   )
  //   .join("")}</table>
  // `;
}

async function getResults() {
  const response = await fetch(urlResults, {
    method: "GET",
    headers: {
      "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e",
    },
  });
  const data = await response.json();
  console.log(data);

  document.getElementById(
    "results"
  ).innerHTML = `<h1 class='title'>RESULTS</h1><table class='table matches'><tr>
  ${data.matches
    .map(
      (match) =>
        `<td>Round ${match.matchday}</td><td class='${
          match.score.winner == "HOME_TEAM" ? "winner" : "loser"
        }'>${match.homeTeam.name}</td> <td>vs</td> <td class='${
          match.score.winner == "AWAY_TEAM" ? "winner" : "loser"
        }'>${match.awayTeam.name}</td>
        <td>${match.score.fullTime.homeTeam} - ${
          match.score.fullTime.awayTeam
        }</td>
        <td>(${match.score.halfTime.homeTeam} - ${
          match.score.halfTime.awayTeam
        })</td></tr>`
    )
    .join("")}</table>
  `;
}

async function getScorers() {
  const response = await fetch(urlScorers, {
    method: "GET",
    headers: {
      "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e",
    },
  });
  const data = await response.json();
  console.log(data);

  document.getElementById(
    "goalscorers"
  ).innerHTML = `<h1 class='title'>TOP 10 GOALSCORERS</h1><table class='table scorers'><tr class='tableHeading'><td>Name<td><td>Team<td><td>Country<td><td>Goals<td></tr><tr>
  ${data.scorers
    .map(
      (player) => `<td>
    ${player.player.name}<td><td>${player.team.name}<td><td>${player.player.nationality}<td><td>${player.numberOfGoals}<td></tr>`
    )
    .join("")}</table>
  `;
}

getMatches();
getStandings();
getResults();
getScorers();

let menuBtn = document.querySelector(".fa-bars");
let navbar = document.querySelector(".navbar");
// console.log(navMenu);

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("fa-times");
  navbar.classList.toggle("active");
});
