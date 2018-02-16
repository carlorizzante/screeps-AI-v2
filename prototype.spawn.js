const roles = [
  "harvester",
  "upgrader"
];

StructureSpawn.prototype.logic = function() {

  const room = this.room;

  // Find all creeps in this room
  const creeps = room.find(FIND_MY_CREEPS);
  const creepCount = {}

  const maxEnergy = room.energyCapacityAvailable;
  const currentEnergy = room.energyAvailable;

  for (let role of roles) {
    creepCount[role] = _.sum(creeps, c => c.memory.role == role);
  }

  if (currentEnergy < maxEnergy) return;

  if (creepCount["harvester"] < 3) {
    this.spawnCreepTier1("harvester");

  } else if (creepCount["upgrader"] < 3) {
    this.spawnCreepTier1("upgrader");
  }
}

// String -> void
StructureSpawn.prototype.spawnHarvester = function(role) {
  console.log("Spawning", role);
  Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], role + Game.time, {
    memory: { role: role }
  });
}
