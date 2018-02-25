require("prototype.creep");
require("prototype.spawn");
require("prototype.tower");

module.exports.loop = function() {
  "use strict";

  // Make sure we have a Board
  if (!Memory.board) Memory.board = {}

  // Delete entries in Memory.board older than 300 ticks
  for (let key in Memory.board) {
    let now = Game.time
    let then = Memory.board[key].time;
    if (now - then > 300) delete Memory.board[key];
  }

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
