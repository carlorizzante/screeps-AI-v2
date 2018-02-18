const roles = [
  "harvester",
  "upgrader",
  "builder",
  "repairer",
  "longHarvester"
];

const settings = require("settings");

StructureSpawn.prototype.logic = function() {

  const room = this.room;

  const HARVESTERS_CAP = settings.harvesters_cap(room);
  const BUILDERS_CAP = settings.builders_cap(room);
  const UPGRADERS_CAP = settings.upgraders_cap(room);
  const REPAIRERS_CAP = settings.repairers_cap(room);

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

  for (let role in creepCount) {
    console.log(role, creepCount[role]);
  }

  if (creepCount["harvester"] < 3) {
    this.spawnCreepTier1("harvester", this.room.name);

  } else if (creepCount["builder"] < BUILDERS_CAP) {
    this.spawnCreepTier1("builder", this.room.name);

  } else if (creepCount["upgrader"] < UPGRADERS_CAP) {
    this.spawnCreepTier1("upgrader", this.room.name);

  } else if (creepCount["repairer"] < REPAIRERS_CAP) {
    this.spawnCreepTier1("repairer", this.room.name);

  // } else if (creepCount["longHarvester"] < 16) {
  } else {
    // Choosing as target one of the adjacent reooms
    const nearbyRooms = Game.map.describeExits(this.room.name);
    let targets = [];
    for (let index in nearbyRooms) {
      targets.push(nearbyRooms[index]);
    }
    this.spawnCreepTier1("longHarvester", _.sample(targets));
  }
}

// String -> void
StructureSpawn.prototype.spawnCreepTier1 = function(role, target) {

  // Delete from memory creeps not longer existing
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log(name, "deleted from memory.");
      delete Memory.creeps[name];
    }
  }

  const room = this.room;
  const home = this.room.name
  
  // Max energy capped for Creeps Tier 1
  const maxEnergy = _.min([settings.tier1_energy_cap(), room.energyCapacityAvailable]);
  let energyAvailable = maxEnergy;

  let energyUsed = 0;
  const skills = [];

  // Reserve half energy for WORK capacity
  while (energyAvailable > maxEnergy / 2) {
    skills.push(WORK);
    energyAvailable -= 100;
    energyUsed += 100;
  }

  // Distribute remaining energy among CARRY and then MOVE
  let energyBlocks = energyAvailable / 50;
  // let carry = Math.floor(energyBlocks / 2 + energyBlocks % 2);
  let move = Math.floor(energyBlocks / 2);
  let carry = energyBlocks - move;

  while (carry) {
    skills.push(CARRY);
    carry -= 1;
    energyAvailable -= 50;
    energyUsed += 50;
  }

  while (move) {
    skills.push(MOVE);
    move -= 1;
    energyAvailable -= 50;
    energyUsed += 50;
  }

  // Output specs new creep
  const specs = "["
    + _.sum(skills, s => s == WORK) + " WORK, "
    + _.sum(skills, s => s == CARRY) + " CARRY, "
    + _.sum(skills, s => s == MOVE) + " MOVE]";
  let name = role + energyUsed + "-" + Game.time;

  console.log("Spawning", name, specs, "Target:", target);

  // Spawning new creep
  const result = Game.spawns["Spawn1"].spawnCreep(skills, name, {
    memory: {
      role: role,
      home: home,
      target: target
    }
  });
}
