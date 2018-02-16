Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], "harvester" + Game.time, {
  memory: { role: "harvester" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE, MOVE], "upgrader" + Game.time, {
  memory: { role: "upgrader" }
});
