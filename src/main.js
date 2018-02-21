require("prototype.creep");
require("prototype.spawn");
require("prototype.tower");

module.exports.loop = function() {
  "use strict";
  
  // Run creeps logic
  for (let name in Game.creeps) {
    // console.log(Game.creeps[name], Game.creeps[name].memory.role);
    Game.creeps[name].logic();
  }

  // Run spawns logic
  for (let name in Game.spawns) {
    Game.spawns[name].logic();
  }

  // Run towers logic
  const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
  for (let tower of towers) {
    tower.logic();
  }
}
