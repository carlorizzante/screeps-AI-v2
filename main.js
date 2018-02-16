require("prototype.creep");

module.exports.loop = function() {

  // Delete from memory creeps not longer existing
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) delete Memory.creeps[name];
  }

  // Run creeps logic
  for (let name in Game.creeps) {
    Game.creeps[name].run();
  }

  // Run spawns logic
  for (let name in Game.spawns) {
    // Game.spawns[name].spawnLogic();
  }

}
