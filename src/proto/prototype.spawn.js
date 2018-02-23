const config = require("config");
const utils = require("utils");

// List of active Creeps' roles
const roles = [

  // Tier 1
  "builder",
  "harvester",
  "repairer",  // LEGACY
  "upgrader",

  // Tier 2
  "hero",

  // Tier 3
  "defender"
];

/**
  Creeps Tier 1
  */
const BUILDER   = "builder";
const HARVESTER = "harvester";
const REPAIRER  = "repairer";  // LEGACY
const UPGRADER  = "upgrader";

/**
  Creeps Tier 2
  */
const HERO = "hero";

/**
  Creeps Tier 3
  */
const DEFENDER = "defender";

// Enable feedback into the console of the game
const VERBOSE = true;

StructureSpawn.prototype.logic = function() {

  // return; // Temporary block

  // Can't spawn more than one Creep at the time
  if (this.spawning) return;

  const room = this.room;
  const maxEnergy = room.energyCapacityAvailable;
  const currentEnergy = room.energyAvailable;

  // Exit if insufficient Energy
  if (currentEnergy < maxEnergy) return;

  // Fulfill pending requests
  if (Memory.board) {
    for (let entry in Memory.board) {
      entry = Memory.board[entry];

      // Skip already fulfilled requests
      if (Memory.board[entry.id].status != "fulfilled") {

        // Fulfill request
        this.spawnCreepTier3(DEFENDER, entry.room, entry.room);

        // Update entry status to "fulfilled"
        Memory.board[entry.id].status = "fulfilled";

        // Done, move to the next cicle
        return;
      }
    }
  }

  // Find all creeps in this room
  const creeps = room.find(FIND_MY_CREEPS);
  const creepCount = {}

  // Delete from memory Creeps that do not longer exist
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      if (VERBOSE) console.log("Creep", name, "deleted from memory.");
      delete Memory.creeps[name];
    }
  }

  // TO DO: Clean expired requests and tasks

  // Count Creeps in the current room
  for (let role of roles) {
    creepCount[role] = _.sum(creeps, c => c.memory.role == role);
  }

  // Print Creeps' roles and their quantity
  if (false) {
    for (let role in creepCount) {
      console.log(role, creepCount[role]);
    }
  }

  /**
    Calculate cap and threshold values for Creep type/role
    Those contansts are used to determine which types will be spawn
    */
  const HARVESTERS_CAP = config.harvesters_cap(room);
  const BUILDERS_CAP   = config.builders_cap(room);
  const UPGRADERS_CAP  = config.upgraders_cap(room);
  const REPAIRERS_CAP  = config.repairers_cap(room);
  const TIER2_ENERGY_THRESHOLD = config.tier2_energy_threshold(room);

  /**
    Spawn Creeps accordingly to rules calculated above
    */
  if (creepCount[HARVESTER] < HARVESTERS_CAP) {
    this.spawnCreepTier1(HARVESTER, this.room.name, this.room.name);

  } else if (creepCount[BUILDER] < BUILDERS_CAP) {
    this.spawnCreepTier1(BUILDER, this.room.name, this.room.name);

  } else if (creepCount[UPGRADER] < UPGRADERS_CAP) {
    this.spawnCreepTier1(UPGRADER, this.room.name, this.room.name);

  // } else if (creepCount[REPAIRER] < REPAIRERS_CAP) {
  //   this.spawnCreepTier1(REPAIRER, this.room.name, this.room.name);

  // Creeps Tier 2 allowed only if enough energyCapacityAvailable
  } else if (maxEnergy < TIER2_ENERGY_THRESHOLD) {
    return;

  // TO DO: automatic spawn of Defenders
  } else if (false) {
    this.spawnCreepTier3(DEFENDER, this.room.name, this.room.name);

  /**
    Spawn Hero units and assign them randomly to nearby rooms
    */
  } else {
    const nearbyRooms = Game.map.describeExits(this.room.name);
    let targets = [];
    for (let index in nearbyRooms) {
      targets.push(nearbyRooms[index]);
    }
    this.spawnCreepTier2("hero", this.room.name, _.sample(targets));
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnCreepTier1 = function(role, homeroom, workroom, target) {

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

  // Spawning new creep
  let name = role + energyUsed + "-" + Game.time;
  const result = Game.spawns.Spawn1.spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK && VERBOSE) {
    console.log("Spawning", name, utils.listSkills(skills), homeroom, workroom, target);
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnCreepTier2 = function(role, homeroom, workroom, target) {

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

  // Spawning new creep
  let name = role + energyUsed + "-" + Game.time;
  const result = Game.spawns.Spawn1.spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK && VERBOSE) {
    console.log("Spawning", name, utils.listSkills(skills), homeroom, workroom, target);
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnCreepTier3 = function(role, homeroom, workroom, target) {

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

  // Spawning new creep
  let name = role + energyUsed + "-" + Game.time;
  const result = Game.spawns.Spawn1.spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK && VERBOSE) {
    console.log("Spawning", name, utils.listSkills(skills), homeroom, workroom, target);
  }
}
