const roles = [
  "builder",
  "defender",
  "harvester",
  "longBuilder",
  "longHarvester",
  "repairer",
  "upgrader"
];

const config = require("config");

StructureSpawn.prototype.logic = function() {

  // return; // Temporary block

  const room = this.room;
  const home = this.room.name;

  const HARVESTERS_CAP = config.harvesters_cap(room);
  const BUILDERS_CAP = config.builders_cap(room);
  const UPGRADERS_CAP = config.upgraders_cap(room);
  const REPAIRERS_CAP = config.repairers_cap(room);
  const TIER2_ENERGY_THRESHOLD = config.tier2_energy_threshold(room);

  // Find all creeps in this room
  const creeps = room.find(FIND_MY_CREEPS);
  const creepCount = {}

  const maxEnergy = room.energyCapacityAvailable;
  const currentEnergy = room.energyAvailable;

  // Spawn only the best creeps available
  if (currentEnergy < maxEnergy) return;

  // Delete from memory creeps not longer existing
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log(name, "deleted from memory.");
      delete Memory.creeps[name];
    }
  }

  for (let role of roles) {
    creepCount[role] = _.sum(creeps, c => c.memory.role == role);
  }

  for (let role in creepCount) {
    console.log(role, creepCount[role]);
  }

  if (creepCount["harvester"] < HARVESTERS_CAP) {
    this.spawnCreepTier1("harvester", this.room.name);

  } else if (creepCount["builder"] < BUILDERS_CAP) {
    this.spawnCreepTier1("builder", this.room.name);

  } else if (creepCount["upgrader"] < UPGRADERS_CAP) {
    this.spawnCreepTier1("upgrader", this.room.name);

  } else if (creepCount["repairer"] < REPAIRERS_CAP) {
    this.spawnCreepTier1("repairer", this.room.name);

  // Creeps Tier 2 allowed only if enough energyCapacityAvailable
  } else if (maxEnergy < TIER2_ENERGY_THRESHOLD) {
    return;

  // TO DO: automatic spawn of Defenders
  } else if (false) {
    this.spawnCreepTier3("defender", home, home);

  // Currently give 50/50 % to spawn a LR Builder or LR Harvester
} else if (_.sample([true, false, false, false])) { // 25% ExoBuilders
    const nearbyRooms = Game.map.describeExits(this.room.name);
    let targets = [];
    for (let index in nearbyRooms) {
      targets.push(nearbyRooms[index]);
    }
    this.spawnCreepTier2("longBuilder", home, _.sample(targets));

  } else {
    const nearbyRooms = Game.map.describeExits(this.room.name);
    let targets = [];
    for (let index in nearbyRooms) {
      targets.push(nearbyRooms[index]);
    }
    this.spawnCreepTier2("longHarvester", home, _.sample(targets));
  }
}

// String -> void
StructureSpawn.prototype.spawnCreepTier1 = function(role, target) {

  const room = this.room;
  const home = this.room.name

  // Max energy capped for Creeps Tier 1
  const maxEnergy = _.min([config.tier1_energy_cap(), room.energyCapacityAvailable]);
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

// String -> void
StructureSpawn.prototype.spawnCreepTier2 = function(role, home, target) {

  const room = this.room;
  const maxEnergy = room.energyCapacityAvailable;
  let energyAvailable = maxEnergy;

  let energyUsed = 0;
  const skills = [];

  // Use 300 for WORK modules
  for (let i = 0; i < 3; i++) {
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

// String -> void
StructureSpawn.prototype.spawnCreepTier3 = function(role, home, target) {

  const room = this.room;
  const maxEnergy = room.energyCapacityAvailable;
  let energyAvailable = maxEnergy;

  let energyUsed = 0;
  const skills = [];

  // TO DO: automatic skills set

  for (let i = 0; i < 9; i++) {
    skills.push(TOUGH);
    energyAvailable -= 10;
    energyUsed += 10;
  }

  for (let i = 0; i < 4; i++) {
    skills.push(MOVE);
    energyAvailable -= 50;
    energyUsed += 50;
  }

  for (let i = 0; i < 2; i++) {
    skills.push(ATTACK);
    energyAvailable -= 80;
    energyUsed += 80;
  }

  for (let i = 0; i < 2; i++) {
    skills.push(RANGED_ATTACK);
    energyAvailable -= 150;
    energyUsed += 150;
  }

  for (let i = 0; i < 1; i++) {
    skills.push(HEAL);
    energyAvailable -= 250;
    energyUsed += 250;
  }

  // Output specs new creep
  const specs = "["
    + _.sum(skills, s => s == TOUGH) + " TOUGH, "
    + _.sum(skills, s => s == MOVE) + " MOVE, "
    + _.sum(skills, s => s == ATTACK) + " ATTACK, "
    + _.sum(skills, s => s == RANGED_ATTACK) + " RANGED_ATTACK, "
    + _.sum(skills, s => s == HEAL) + " HEAL" + "]";
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
