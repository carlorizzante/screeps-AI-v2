const config = require("config");
const utils = require("utils");

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

/**
  Creeps Tier 2
  */
const HAULER = "hauler";
const HERO   = "hero";
const MINER  = "miner";

/**
  Creeps Tier 3
  */
const CLAIMER  = "claimer";
const DEFENDER = "defender";
const GUARD    = "guard";

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
          && OK == this.spawnTier3(DEFENDER, entry.room, entry.room)) {

          // If positive, set request as fulfilled
          Memory.board[entry.id].status = "fulfilled";

          // quit execution for this cicle
          return;
        }
      }
    }
  }

  // Emergency settings - Manual spawning of Defender
  // if (true) this.spawnTier3(DEFENDER, this.room.name, this.room.name);

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
  this.hijack(adjacentRooms, creepsInRoom);

  // TO DO: Clean expired requests and tasks

  // Count Creeps in the current room
  for (let role of roles) {
    creepCount[role] = _.sum(creepsInRoom, c => c.memory.role == role);
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
    this.spawnTier1(HARVESTER, this.room.name, this.room.name);

  } else if (creepCount[BUILDER] < BUILDERS_CAP) {
    this.spawnTier1(BUILDER, this.room.name, this.room.name);

  } else if (creepCount[UPGRADER] < UPGRADERS_CAP) {
    this.spawnTier1(UPGRADER, this.room.name, this.room.name);

  // Creeps Tier 2 allowed only if enough energyCapacityAvailable
  } else if (maxEnergy < TIER2_ENERGY_THRESHOLD) {
    return;


  } else if (creepCount[MINER] < MINER_CAP) {
    this.spawnTier2(MINER, this.room.name, this.room.name);

  } else if (creepCount[HAULER] < HAULER_CAP) {
    this.spawnTier2(HAULER, this.room.name, this.room.name);

  } else if (creepCount[GUARD] < GUARD_CAP) {
    this.spawnTier3(GUARD, this.room.name, this.room.name)

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
    this.spawnTier2(HERO, this.room.name, _.sample(adjacentRooms));
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnTier1 = function(role, homeroom, workroom, target) {

  const TIER1_ENERGY_CAP = config.tier1_energy_cap(this.room);

  // Max energy capped for Creeps Tier 1
  const maxEnergy = _.min([TIER1_ENERGY_CAP, this.room.energyCapacityAvailable]);
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

  // Spawn new creep
  let name = role + energyUsed + "-" + Game.time + "-" + homeroom;
  const result = Game.spawns[this.name].spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK && VERBOSE) {
    console.log(this.name, "is spawning", name, utils.listSkills(skills), homeroom, workroom, target);
  } else if (VERBOSE) {
    console.log(this.name, "is spawning failed:", result);
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnTier2 = function(role, homeroom, workroom, target) {

  const maxEnergy     = this.room.energyCapacityAvailable;
  let energyAvailable = this.room.energyCapacityAvailable;

  let energyUsed = 0;
  const skills = [];

  /**
    Miners are all about WORK parts
    Heros need a more balance setup, 25% WORK parts
    */
  let use;
  if (role == HAULER) use = 0;   // Haulers do not need WORK parts
  if (role == HERO)   use = energyAvailable / 4 + 1;
  if (role == MINER)  use = energyAvailable - 250;

  // Add WORK parts accordingly to role
  while (energyUsed < use) {
    skills.push(WORK);
    energyUsed += 100;
  }

  // Update energy still available
  energyAvailable -= energyUsed;

  // Distribute remaining energy among CARRY and then MOVE
  let energyBlocks = energyAvailable / 50;
  let move = Math.floor(energyBlocks / 2);
  let carry = energyBlocks - move; // Prioritize CARRY over MOVE

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

  // Spawn new creep
  let name = role + energyUsed + "-" + Game.time + "-" + homeroom;
  const result = Game.spawns[this.name].spawnCreep(skills, name, {
    memory: {
      role: role,
      homeroom: homeroom,
      workroom: workroom
    }
  });

  if (result == OK && VERBOSE) {
    console.log(this.name, "is spawning", name, utils.listSkills(skills), homeroom, workroom, target);
  } else if (VERBOSE) {
    console.log(this.name, "is spawning failed:", result);
  }
}

/**
  @param role String
  @param homeroom String
  @param workroom String
  @param target null
  */
StructureSpawn.prototype.spawnTier3 = function(role, homeroom, workroom, target) {

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

  // Cost 1400
  if (role == CLAIMER) {
    skills.push(CLAIM);
    skills.push(CLAIM);
    skills.push(MOVE);
    skills.push(MOVE);
    energyUsed = 2 * 600 + 2 * 50;
  }

  // TO DO: automatic skills set for Defender
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

  // Cost 1000
  if (false && role == DEFENDER) {
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

  if (result == OK && VERBOSE) {
    console.log(this.name, "is spawning", name, utils.listSkills(skills), homeroom, workroom, target);
  } else if (VERBOSE) {
    console.log(this.name, "is spawning failed:", result);
  }
}

/**
  Returns an array with the name of the adjacent rooms
  */
StructureSpawn.prototype.getAdjacentRooms = function() {
  const adjacentRooms = Game.map.describeExits(this.room.name);
  const result = [];
  for (let key in adjacentRooms) {
    result.push(adjacentRooms[key]);
  }
  // Owned room, for later use
  const myRooms = [];
  for (let key in Game.spawns) {
    myRooms.push(Game.spawns[key].room.name);
  }
  return result; // filter this by owned rooms
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

    // If the creep is an Hero unit and its workroom is where the Spawn is...
    if (creep.memory.role == "hero" && creep.memory.workroom == this.room.name) {
      const new_workroom = _.sample(adjacentRooms);
      console.log("Hijacking", creep.name, "new workroom:", new_workroom);
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
