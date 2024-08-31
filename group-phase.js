const groups = require("./groups.json");

function simulateMatch(team1, team2) {
  let rankDifference = team2.FIBARanking - team1.FIBARanking;

  // Poboljšavamo rezultat tima sa boljim rangom
  if (rankDifference < 0) {
    rankDifference = Math.abs(rankDifference);
  }

  let team1Points = Math.floor(Math.random() * (rankDifference + 1)) + 70;
  let team2Points = Math.floor(Math.random() * (rankDifference + 1)) + 70;

  return { team1Points, team2Points };
}

function playGroupMatches(group) {
  const results = [];
  const standings = {};

  group.forEach((team) => {
    standings[team.Team] = {
      wins: 0,
      losses: 0,
      points: 0,
      scored: 0,
      conceded: 0,
    };
  });

  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const team1 = group[i];
      const team2 = group[j];
      const { team1Points, team2Points } = simulateMatch(team1, team2);

      // Update rezultata i bodova za timove
      standings[team1.Team].scored += team1Points;
      standings[team1.Team].conceded += team2Points;
      standings[team2.Team].scored += team2Points;
      standings[team2.Team].conceded += team1Points;

      if (team1Points > team2Points) {
        standings[team1.Team].wins += 1;
        standings[team1.Team].points += 2;
        standings[team2.Team].losses += 1;
        standings[team2.Team].points += 1;
      } else {
        standings[team2.Team].wins += 1;
        standings[team2.Team].points += 2;
        standings[team1.Team].losses += 1;
        standings[team1.Team].points += 1;
      }

      results.push({
        team1: team1.Team,
        team2: team2.Team,
        score: `${team1Points}:${team2Points}`,
      });
    }
  }

  return { results, standings };
}

function rankTeamsInGroup(standings) {
  return Object.keys(standings)
    .map((team) => ({
      name: team,
      ...standings[team],
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const pointDifferenceA = a.scored - a.conceded;
      const pointDifferenceB = b.scored - b.conceded;
      return pointDifferenceB - pointDifferenceA;
    });
}

function printResults(groupResults, groupStandings) {
  console.log("Grupna faza - Rezultati:");

  // Ispisujemo rezultate po grupama
  Object.keys(groupResults).forEach((groupName) => {
    console.log(`Grupa ${groupName}:`);
    groupResults[groupName].forEach((match) => {
      console.log(`${match.team1} - ${match.team2} (${match.score})`);
    });
  });

  // Ispisujemo konačne rang liste
  console.log("\nKonačan plasman u grupama:");
  Object.keys(groupStandings).forEach((groupName) => {
    console.log(`Grupa ${groupName}:`);
    const rankedTeams = rankTeamsInGroup(groupStandings[groupName]);
    rankedTeams.forEach((team, index) => {
      console.log(
        `${index + 1}. ${team.name} - Pobede: ${team.wins}, Porazi: ${
          team.losses
        }, Bodovi: ${team.points}, Postignuti koševi: ${
          team.scored
        }, Primljeni koševi: ${team.conceded}, Koš razlika: ${
          team.scored - team.conceded
        }`
      );
    });
  });
}

function simulateGroupPhase(groups) {
  const groupResults = {};
  const groupStandings = {};

  Object.keys(groups).forEach((group) => {
    const { results, standings } = playGroupMatches(groups[group]);
    groupResults[group] = results;
    groupStandings[group] = standings;
  });

  return { groupResults, groupStandings };
}

const { groupResults, groupStandings } = simulateGroupPhase(groups);
printResults(groupResults, groupStandings);
