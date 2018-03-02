const config = require("config");

// List of active Creeps' roles
const roles = [

  // Tier 1 from 300 Energy
  "builder",
  "harvester",
  "upgrader",

  // Tier 2 from 800 Energy
  "hauler",
  "hero",
  "miner",

  // Tier 3
  "claimer",
  "defender",
  "guard"
];

/**
  Creeps Tier 1
  */
const BUILDER   = "builder";
const HARVESTER = "harvester";
const UPGRADER  = "upgrader";
const TIER1_ENERGY_CAP = config.tier1_energy_cap(this.room);

/**
  Creeps Tier 2
  */
const HAULER = "hauler";
const HERO   = "hero";
const MINER  = "miner";
const TIER2_ENERGY_CAP = config.tier2_energy_cap(this.room);

/**
  Creeps Tier 3
  */
const CLAIMER  = "claimer";
const DEFENDER = "defender";
const GUARD    = "guard";

const VERBOSE = true;
const DEBUG = false;

StructureSpawn.prototype.logic = function() {

  // return; // Temporary block

  // Can't spawn more than one Creep at the time
  if (this.spawning) return;

  const room = this.room;
  const maxEnergy = room.energyCapacityAvailable;
  const currentEnergy = room.energyAvailable;

  // Exit if insufficient Energy to spawn the smallest Creep
  if (currentEnergy < 300) return;

  /**
    TO DO: Requests for Military Support need to be prioritized
    */
  if (Memory.board) {
    for (let key in Memory.board) {
      entry = Memory.board[key];

      // Skip already fulfilled requests
      if (Memory.board[entry.id].status != "fulfilled") {

        // Find a Guard and send it to the room in need
        const creepsInRoom = room.find(FIND_MY_CREEPS);

        for (let index in creepsInRoom) {
          const creep = creepsInRoom[index];
          if (creep.memory.role == "guard") {
            creep.memory.workroom = entry.room;
          }
        }

        // Try sending a DEFENDER in support as well
        if (currentEnergy >= config.tier3_energy_threshold(room)
          && OK == this.spawnCustomCreep(DEFENDER, entry.room, entry.room)) {

          // If positive, set request as fulfilled
          Memory.board[entry.id].status = "fulfilled";

          // quit execution for this cicle
          return;
        }
      }
    }
  }

  // Find the adjacent rooms to the current Spawn
  const adjacentRooms = this.getAdjacentRooms();

  // Remove already owned rooms from the above list of adjacent rooms
  // TO DO: Clean up adjacent rooms - see getAdjacentRooms method

  // Find all creeps in the current room
  const creepsInRoom = room.find(FIND_MY_CREEPS);
  const creepCount = {}

  // Delete from memory Creeps that do not longer exist
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      if (VERBOSE) console.log("Creep", name, "deleted from memory.");
      delete Memory.creeps[name];
    }
  }

  // TO DO: Hijack Heros coming from other rooms
  // this.hijack(adjacentRooms, creepsInRoom);

  // TO DO: Clean expired requests and tasks

  // Count Creeps in the current room
  for (let role of roles) {
    creepCount[role] = _.sum(creepsInRoom, c => c.memory.role == role);
  }

  // Print Creeps' roles and their quantity
  if (DEBUG) {
    for (let role in creepCount) {
      console.log(role, creepCount[role]);
    }
  }

  /**
    Calculate cap and threshold values for Creep type/role
    Those contansts are used to determine which types will be spawn
    */

  // Tier 1
  const HARVESTERS_CAP = config.harvesters_cap(room, creepCount);
  const BUILDERS_CAP   = config.builders_cap(room);
  const UPGRADERS_CAP  = config.upgraders_cap(room);

  // Tier 2
  const TIER2_ENERGY_THRESHOLD = config.tier2_energy_threshold(room);
  const HAULER_CAP     = config.haulers_cap(room);
  const MINER_CAP      = config.miners_cap(room);

  // Tier 3
  const TIER3_ENERGY_THRESHOLD = config.tier3_energy_threshold(room);
  const GUARD_CAP   = config.guard_cap(room);
  const CLAIMER_CAP = 0;

  /**
    Spawn Creeps accordingly to rules calculated above
    */
  if (creepCount[HARVESTER] < HARVESTERS_CAP) {
    this.spawnCustomCreep(HARVESTER, this.room.name, this.room.name);

  } else if (creepCount[BUILDER] < BUILDERS_CAP) {
    this.spawnCustomCreep(BUILDER, this.room.name, this.room.name);

  } else if (creepCount[UPGRADER] < UPGRADERS_CAP) {
    this.spawnCustomCreep(UPGRADER, this.room.name, this.room.name);

  /**
    Creeps Tier 2 allowed only if enough energyCapacityAvailable
    */
  } else if (this.room.energyAvailable < TIER2_ENERGY_THRESHOLD) {
    return;

  } else if (creepCount[MINER] < MINER_CAP && this.room.energyAvailable >= 700) {
    // const availableEnergySources = [];
    const availableEnergySources = this.room.find(FIND_SOURCES);
    console.log("availableEnergySources:", availableEnergySources);
    const index = this.memory.miner_index % availableEnergySources.length;
    const target = availableEnergySources[index];
    this.spawnCustomCreep(MINER, this.room.name, this.room.name, target);

  } else if (creepCount[HAULER] < HAULER_CAP) {
    this.spawnCustomCreep(HAULER, this.room.name, this.room.name);

  } else if (creepCount[GUARD] < GUARD_CAP) {
    this.spawnCustomCreep(GUARD, this.room.name, this.room.name)

  /**
    TO DO: Spawn a Claimer if necessary - GCL > rooms owned
    That way more developed rooms will support less developed ones
    */
  // } else if (_.sample([true, false, false, false, false])) {
  //   let workroom = _.sample(adjacentRooms);
  //   this.spawnTier3(CLAIMER, workroom, workroom);

  /**
    Spawn Hero units and assign them randomly to nearby rooms
    */
  } else {
    this.spawnCustomCreep(HERO, this.room.name, _.sample(adjacentRooms));
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnCustomCreep = function(role, homeroom, workroom, target) {

  const maxEnergy = this.room.energyCapacityAvailable;
  let energyAvailable = maxEnergy;

  let energyUsed = 0;
  const skills = [];

  /**
    Routine for adding parts for spawning a new creep
    Modifies Array skills adding parts to it
    Returns energy used on the specific part
    Uses Array skills
    @param part BODYPART WORK, MOVE, ATTACK...
    @param cost integer cost of the BODYPART
    @param budget integer max energy available for the part
    @param skills Array [WORK, MOVE, ATTACK...]
    */
  function addParts(part, cost, budget, skills) {
    let energyUsed = 0;
    while(budget >= cost) {
      skills.push(part);
      budget -= cost;
      energyUsed += cost;
    }
    return energyUsed;
  }

  // Tier 1

  if (role == BUILDER || role == HARVESTER || role == UPGRADER) {
    // 50% WORK
    // 25% CARRY
    // 25% MOVE
    let use = _.min([TIER1_ENERGY_CAP, this.room.energyAvailable]);
    console.log(this.name, "spawning", role, "with energy", use, "available", this.room.energyAvailable);
    energyUsed += addParts(WORK, 100, Math.floor(use * 0.50), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.25), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.25), skills);
  }

  // Tier 2

  if (role == HAULER) {
    // 50% CARRY
    // 50% MOVE
    let use = _.min([TIER2_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.50), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.50), skills);
  }

  if (role == HERO) {
    // 20% WORK
    // 40% CARRY
    // 40% MOVE
    let use = _.min([TIER2_ENERGY_CAP, this.room.energyAvailable]);
    energyUsed += addParts(WORK, 100, Math.floor(use * 0.20), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(use * 0.40), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(use * 0.40), skills);
  }

  if (role == MINER) { // cost 700
    // 5 WORK
    // 2 CARRY
    // 2 MOVE
    let use = 500 + 100 + 100;
    energyUsed += addParts(WORK, 100, Math.floor(500), skills);
    energyUsed += addParts(CARRY, 50, Math.floor(100), skills);
    energyUsed += addParts(MOVE,  50, Math.floor(100), skills);
    // this.memory.miner_index = this.memory.miner_index ? this.memory.miner_index : 1;
  }

  // Tier 3

  if (role == CLAIMER) { // Cost 1400
    skills.push(CLAIM);
    skills.push(CLAIM);
    skills.push(MOVE);
    skills.push(MOVE);
    energyUsed = 2 * 600 + 2 * 50;
  }

  if (role == GUARD) {
    // 10% TOUGH
    // 60% MOVE
    // 30% ATTACK
    let use = energyAvailable;
    energyUsed += addParts(TOUGH,  10, Math.floor(use * 0.1), skills);
    energyUsed += addParts(MOVE,   50, Math.floor(use * 0.6), skills);
    energyUsed += addParts(ATTACK, 80, Math.floor(use * 0.3), skills);
  }

  if (role == DEFENDER) {
    // 10% TOUGH
    // 60% MOVE
    // 30% RANGED_ATTACK
    // + HEAL
    let use = energyAvailable - 250; // HEAL cost
    energyUsed += addParts(TOUGH,          10, Math.floor(use * 0.1), skills);
    energyUsed += addParts(MOVE,           50, Math.floor(use * 0.6), skills);
    energyUsed += addParts(RANGED_ATTACK, 150, Math.floor(use * 0.3), skills);
    skills.push(HEAL);
  }

  // Spawn new creep
  let name = role + energyUsed + "-" + Game.time + "-" + homeroom;
  const result = Game.spawns[this.name].spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK) {
    const key = role + "_index";
    this.memory[key] = this.memory[key] ? this.memory[key] + 1 : 1;
    console.log(this.name, "this.memory."+role+"_index:", this.memory[key]);
    if (VERBOSE) console.log(this.name, "is spawning", name, listSkills(skills), homeroom, workroom, target);

  } else if (VERBOSE) {
    console.log(this.name, "is spawning", role, "failed:", result);
  }
}

/**
  Returns an array with the name of the adjacent rooms
  */
StructureSpawn.prototype.getAdjacentRooms = function() {
  const adjacentRooms = Game.map.describeExits(this.room.name);
  const ownedRooms = Memory.spawns;
  let rooms = [];
  for (let key in adjacentRooms) {
    rooms.push(adjacentRooms[key]);
  }
  rooms = rooms.filter(r => ownedRooms.indexOf(r) < 0);
  return rooms;
}

/**
  Hijack a Hero unit passing by any already owned room (having a Spawn)
  @param adjacentRooms Array list of rooms the current room has exit to
  @param creepsInRoom Array list of creeps currently in sight of the Spawn
  */
StructureSpawn.prototype.hijack = function(adjacentRooms, creepsInRoom) {

  // Hijack Heros coming from other rooms,
  // and reset their homeroom/workroom, ultimately sending them to outher borders
  for (let name in creepsInRoom) {
    const creep = creepsInRoom[name];

    // For every Creep, if their Workroom is in this room, hijack it
    if (creep.memory.workroom == this.room.name) {
      const new_workroom = _.sample(adjacentRooms);

      if (VERBOSE) console.log(this.name, "is hijacking", creep.name, "new workroom:", new_workroom);

      // Reset homeroom and workroom (sending it to the border)
      creep.memory.homeroom = this.room.name;
      creep.memory.workroom = new_workroom;

      // Unless the creep has already mined enough energy, then transfer it first
      if (creep.carry.energy >= Math.floor(creep.carryCapacity / 3)) {
        creep.memory.charged = true;
      }
    }
  }
}

/**
  UTILITIES
  */

/**
  Return a count of a Creep body parts as following example
  [3 WORK, 2 CARRY, 3 MOVE]
  @param skills Array
  */
function listSkills(skills) {
  const countParts = {}
  let output = "[";
  for (let skill of skills) {
    countParts[skill] = countParts[skill] ? countParts[skill] + 1 : 1;
  }
  for (let part in countParts) {
    output += countParts[part] + " " + part.toUpperCase() + ", ";
  }
  return output.slice(0,-2) + "]";
}
