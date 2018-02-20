Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], "harvester-" + Game.time, {
  memory: { role: "harvester" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE, MOVE], "upgrader-" + Game.time, {
  memory: { role: "upgrader" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "builder600-" + Game.time, {
  memory: { role: "builder" }
});

Game.spawns["Spawn1"].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], "builder600-" + Game.time, {
  memory: { role: "longBuilder", home: "W8N3", target: "W8N3" }
});

Game.spawns["Spawn1"].spawnCreep([
  TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
  MOVE, MOVE, MOVE, MOVE,
  ATTACK, ATTACK,
  RANGED_ATTACK, RANGED_ATTACK,
  HEAL
], "defender1200-" + Game.time, {
  memory: { role: "defender", home: "W8N3", target: "W8N3" }
});
