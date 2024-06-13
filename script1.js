const apiKey = "63c5a6bf56f958b121ecd6b7ae6307f0";
const apiUrl =
  "https://v3.football.api-sports.io/standings?league=140&season=2023"; //

async function getStandings() {
  try {
    const response = await fetch(apiUrl, {
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

getStandings();
