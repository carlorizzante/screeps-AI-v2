require("prototype.creep");
require("prototype.spawn");
require("prototype.tower");

module.exports.loop = function() {

  // Delete from memory creeps not longer existing
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) delete Memory.creeps[name];
  }

  // Run creeps logic
  for (let name in Game.creeps) {
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
