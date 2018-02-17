const roles = [
  "harvester",
  "upgrader",
  "builder",
  "repairer"
];

StructureSpawn.prototype.logic = function() {

  const room = this.room;

  // Find all creeps in this room
  const creeps = room.find(FIND_MY_CREEPS);
  const creepCount = {}

  const maxEnergy = room.energyCapacityAvailable;
  const currentEnergy = room.energyAvailable;

  // Spawn only the best creeps available
  if (currentEnergy < maxEnergy) return;

  for (let role of roles) {
    creepCount[role] = _.sum(creeps, c => c.memory.role == role);
  }

  if (creepCount["harvester"] < 4) {
    this.spawnCreepTier1("harvester");

  } else if (creepCount["upgrader"] < 5) {
    this.spawnCreepTier1("upgrader");

  } else if (creepCount["builder"] < 4) {
    this.spawnCreepTier1("builder");

  } else if (creepCount["repairer"] < 2) {
    this.spawnCreepTier1("repairer");
  }
}

// String -> void
StructureSpawn.prototype.spawnCreepTier1 = function(role) {
  console.log("Spawning", role);
  Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], role + Game.time, {
    memory: { role: role }
  });
}
