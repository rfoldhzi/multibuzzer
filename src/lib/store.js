import { ActivePlayers } from 'boardgame.io/core';
import { values, sortBy } from 'lodash';

function resetBuzzers(G) {
  console.log("help", G.queue)
  G.queue = {};
  G.incorrect = {}
}

function incorrectPlayer(G) {
  console.log("help", G.queue)
  console.log("hel2p", G)
  let fastestPlayer = sortBy(values(G.queue), ['timestamp'])[0];
  G.incorrect[fastestPlayer.id] = true
  G.queue = {};
}

function changeTeam(G, ctx, id) {
  let teams = ["Red", "Blue", "Green", "White"]
  if (!G.teams[id]) {
    G.teams[id] = teams[0]
  } else {
    let i = teams.indexOf(G.teams[id])
    i = (i + 1) % teams.length
    G.teams[id] = teams[i]
  }

}

function resetBuzzer(G, ctx, id) {
  const newQueue = { ...G.queue };
  delete newQueue[id];
  G.queue = newQueue;
}

function toggleLock(G) {
  G.locked = !G.locked;
}

function buzz(G, ctx, id) {
  const newQueue = {
    ...G.queue,
  };
  if (!newQueue[id] && !G.incorrect[id]) {
    // buzz on server will overwrite the client provided timestamp
    newQueue[id] = { id, timestamp: new Date().getTime() };
  }
  G.queue = newQueue;
}

export const Buzzer = {
  name: 'buzzer',
  minPlayers: 2,
  maxPlayers: 200,
  setup: () => ({ queue: {}, locked: false, incorrect: {}, teams: {} }),
  phases: {
    play: {
      start: true,
      moves: { buzz, resetBuzzer, resetBuzzers, toggleLock, incorrectPlayer, changeTeam },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
  },
};
