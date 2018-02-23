require("prototype.creep");
require("prototype.spawn");
require("prototype.tower");

module.exports.loop = function() {
  "use strict";

  // Make sure we have a Board
  if (!Memory.board) Memory.board = {}

  // Make sure we have a Queue
  if (!Memory.queue) Memory.queue = [];

  // Register new requests into queue
  addToQueue(Memory.board);

  // TO DO: Delete old requests after some time

  /**
    Run Creeps
    */
  for (let name in Game.creeps) {
    Game.creeps[name].logic();
  }

  /**
    Run Spawns
    */
  for (let name in Game.spawns) {
    Game.spawns[name].logic();
  }

  /**
    Run Towers
    */
  const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (let tower of towers) {
    tower.logic();
  }
}

const addToQueue = (requests) => {

  // FOR YOUR CONVENIENCE
  // const request = {
  //   id: id,
  //   type: type,
  //   priority: foesLength,
  //   time: Game.time,
  //   room: room,
  //   status: "sent"
  // }

  for (let id in requests) {
    let r = requests[id];

    // If request has just been sent, put it in queue
    if (r.status == "sent") {
      r.status = "pending";
      Memory.queue.push(r);
      // Keep them sorted by priority
      Memory.queue.sort((r1, r2) => r1.priority < r2.priority);
    }
  }
}
