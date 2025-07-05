import { ActivePlayers } from 'boardgame.io/core';
import { values, sortBy } from 'lodash';

function resetBuzzers(G) {
  console.log("help", G.queue)
  G.queue = {};
  G.incorrect = {}
}

function incorrectPlayer(G) {
  console.log("help", G.queue)
  let fastestPlayer = sortBy(values(G.queue), ['timestamp'])[0];
  G.incorrect[fastestPlayer.id] = true
  G.queue = {};
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
  setup: () => ({ queue: {}, locked: false, incorrect: {} }),
  phases: {
    play: {
      start: true,
      moves: { buzz, resetBuzzer, resetBuzzers, toggleLock, incorrectPlayer },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
  },
};
