// const upgrader = require("role.upgrader");

const roles = {

  // Tier 1
  builder: require("role.builder"),
  harvester: require("role.harvester"),
  upgrader: require("role.upgrader"),

  // Tier 2
  hauler: require("role.hauler"),
  hero: require("role.hero"),
  miner: require("role.miner"),

  // Tier 3
  claimer: require("role.claimer"),
  defender: require("role.defender"),
  guard: require("role.guard")
};

const COMICS = true;
const VERBOSE = true;
const DEBUG = false;

/**
  Main AI for Creeps
  */
Creep.prototype.logic = function() {
  roles[this.memory.role].run(this);
}

/**
  Returns true if the Creep is fully charged, false otherwise
  */
Creep.prototype.isCharged = function() {

  // Change internal status when appropriate
  if (this.carry.energy <= 0) {
    this.memory.charged = false;

  } else if (this.carry.energy == this.carryCapacity) {
    this.memory.charged = true;
  }

  // Return true/false accordingly
  return this.memory.charged;
}

/**
  Returns true if conditions are met, false otherwise
  Used by Miners to lock up onto Energy Sources and the adjacent Container
  @param ifNearbyEnergySource Boolean default: true
  @param ifNearbyContainer Boolean
  */
Creep.prototype.isLocked = function(ifNearbyEnergySource, ifNearbyContainer) {

  ifNearbyEnergySource = ifNearbyEnergySource ? ifNearbyEnergySource : false;

  let energySourceFound;
  let containerFound;
  let locked = true;

  // Stay locked is conditions have previously successfully met
  if (this.memory.locked) {
    return true;
  }

  if (ifNearbyEnergySource) {
    energySourceFound = this.pos.findInRange(FIND_SOURCES, 1);
  }

  if (ifNearbyContainer) {
    containerFound = this.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: s => s.structureType == STRUCTURE_CONTAINER
    });
  }

  if (ifNearbyEnergySource) locked = locked && energySourceFound.length;
  if (ifNearbyContainer)    locked = locked && containerFound.length;

  if (locked) {
    this.memory.locked = true;
    if (ifNearbyEnergySource) this.memory.locked_on_energy_source_id = energySourceFound[0].id;
    if (ifNearbyContainer) this.memory.locked_on_container_id = containerFound[0].id;
  }

  return locked;
}

/**
  @param useSource Boolean
  @param useContainers Boolean
  @param useStorage Boolean
  */
Creep.prototype.getEnergy = function(useSource, useContainers, useStorage) {

  // TO DO: store source_id and storage_id
  delete this.memory.source_id;
  delete this.memory.storage_id;
  delete this.memory.structure_id;

  let source;  // Energy Sources require harvest()
  let storage; // Containers and Storage require withdraw()

  // Use first Containers and Storage
  if (this.memory.storage_id) {
    // this.say("1");
    storage = Game.getObjectById(this.memory.storage_id);
    if (storage.store[RESOURCE_ENERGY] <= 0) delete this.memory.storage_id;

  } else if (useContainers || useStorage) {
    delete this.memory.storage_id;
    storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => ((
        (useContainers && s.structureType == STRUCTURE_CONTAINER)
        || (useStorage && s.structureType == STRUCTURE_STORAGE))
        && s.store[RESOURCE_ENERGY] > this.carryCapacity / 2
      )
    });
    if (storage) this.memory.storage_id = storage.id;
  }

  // If no Containers or Storage nearly available, use Energy Sources
  if (!storage && useSource && this.memory.source_id) {
    source = Game.getObjectById(this.memory.source_id);

  } else if (useSource) {
    delete this.memory.source_id;
    source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
      filter: s => s.energy >= 0 // Only if Source has somehow enough to harvest
    });
    if (source) this.memory.source_id = source.id;
  }

  // Prioritize Containers and Storage over Sources
  if (storage && this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    this.moveTo(storage);

  } else if (source && this.harvest(source) == ERR_NOT_IN_RANGE) {
    this.moveTo(source);
  }

  // Return true if anything found, false otherwise
  return (useSource && source) || ((useContainers || useStorage) && storage);
}

/**
  Finds a suitable structure and returns it to be used as target
  @param includeSpawns Boolean
  @param includeExtensions Boolean
  @param includeTowers Boolean
  @param includeStorage Boolean
  */
Creep.prototype.findStructure = function(includeSpawns, includeExtensions, includeTowers, includeStorage) {

  delete this.memory.source_id;
  delete this.memory.storage_id;
  delete this.memory.structure_id;

  if (this.memory.structure_id) return Game.getObjectById(this.memory.structure_id);

  delete this.memory.structure_id;

  let structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: s => (includeSpawns && s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
      || (includeExtensions && s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity)
      || (includeTowers && s.structureType == STRUCTURE_TOWER         && s.energy < s.energyCapacity * 0.7)
      || (includeStorage && s.structureType == STRUCTURE_STORAGE      && s.store[RESOURCE_ENERGY] < s.storeCapacity)
  });

  if (structure) this.memory.structure_id = structure.id;
  return structure;
}

/**
  @param structure STRUCTURE_*
  */
Creep.prototype.rechargeStructure = function(structure) {
  if (structure) {
    let result = this.transfer(structure, RESOURCE_ENERGY);
    if (result == ERR_NOT_IN_RANGE) result = this.moveTo(structure);
    if (result == ERR_FULL || result == ERR_NO_PATH) delete this.memory.structure_id;
    return result;
  }
}

/**
  Allows the Creep to look for resources dropped nearby
  @param range Integer range to scan for resource been dropped
  */
Creep.prototype.lookForAndPickupResource = function(range = 6) {
  const droppedResources = this.pos.findInRange(FIND_DROPPED_RESOURCES, range);
  if (droppedResources.length) {
    const pickup = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: r => r.resourceType == RESOURCE_ENERGY
    });
    if (this.pickup(pickup) == ERR_NOT_IN_RANGE) this.moveTo(pickup);
    return;
  }
}

/**
  Register a request into board, calling for military support in the sender room
  @param foesLength Integer
  */
Creep.prototype.requestMilitarySupport = function(foesLength) {

  const type = "military_support";
  const room = this.room.name;
  const id = room + "_" + type;

  // Do not duplicate or override an already sent request
  for (let entry in Memory.board) {
    if (entry == id) {
      Memory.board[id].priority = foesLength;
      // console.log("Updating request:", id, "Room:", room, "Priority:", foesLength);
      return
    }
  }

  if (VERBOSE) console.log("Making new request:", id, "Room:", room, "Priority:", foesLength);

  // Record not found, make a new one buddy!
  const request = {
    id: id,
    type: type,
    priority: foesLength, // array.length
    time: Game.time,
    room: room,
    status: "pending"
  }

  Memory.board[id] = request;
}

/**
  Places a marker for construction: STRUCTURE_ROAD
  First veryfies that there has been a similar request before
  @param fatigue Interger threshold for placing a road marker
  */
Creep.prototype.requestRoad = function(fatigue) {
  threshold = fatigue ? fatigue : 2
  if (this.fatigue > threshold) {
    if (COMICS) this.say("Road!");
    this.pos.createConstructionSite(STRUCTURE_ROAD);
    return;
  }
}

/**
  Perform actions related to claming a foreign claimController
  */
Creep.prototype.goClaimController = function() {
  if (this.room.controller) {
    if (COMICS) this.say("Claim");
    if (DEBUG) console.log(this.room.controller, this.claimController(this.room.controller));
    if (this.claimController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
}

/**
  Forces a Creep to return to homeroom
  */
Creep.prototype.headForHomeroom = function() {
  if (COMICS) this.say(">>>");
  this.memory.workroom = this.memory.homeroom; // Temporary solution
}

/**
  Returns Creep's details as follow
  ID [BODY PARTS] homeroom workroom
  */
Creep.prototype.getDetails = function() {
  const body = {};
  let specs = " [";
  for (let part of this.body) {
    body[part.type] = body[part.type] ? body[part.type] + 1 : 1;
  }
  for (let part in body) {
    specs += body[part] + " " + part.toUpperCase() + ", ";
  }
  specs = specs.slice(0,-2) + "] ";
  return this.name + specs + this.memory.homeroom + " " + this.memory.workroom;
}

/**
  Move towards the Spawn then life expectancy is below the given amount of ticks
  @param terminalTicks Integer ticks left to live
  */
Creep.prototype.recycleAt = function(terminalTicks) {
  terminalTicks = terminalTicks ? terminalTicks : 30;
  // this.say(this.ticksToLive);
  if (this.ticksToLive <= terminalTicks) {
    if (COMICS) this.say("#@$");
    // if (COMICS) this.say("☠☠☠");

    if (this.room.name != this.memory.homeroom) {
      const exit = this.room.findExitTo(this.memory.homeroom);
      this.moveTo(this.pos.findClosestByPath(exit));
      return
    }

    const spawn = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_SPAWN
    });
    if (spawn && this.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE || spawn.recycleCreep(this) == ERR_NOT_IN_RANGE) {
      this.moveTo(spawn);
    } else {
      if (VERBOSE) console.log(this.name + " has been recycled");
    }
    return true;
  }
  return false;
}

/**
  Returns true if the Creep's Workroom memory property has been successfully updated
  Modifies creep.memory.workroom
  @param roomname String the name of the room to use as Workroom
  */
Creep.prototype.resetWorkroom = function(roomname) {

  if (roomname) {
    this.memory.workroom = roomname;
    return this.memory.workroom == roomname;
  }

  const adjacentRooms = Game.map.describeExits(this.room.name);
  const ownedRooms = Memory.spawns;
  let rooms = [];
  for (let key in adjacentRooms) {
    rooms.push(adjacentRooms[key]);
  }

  rooms = rooms.filter(r => ownedRooms.indexOf(r) < 0);
  const newWorkroom = _.sample(rooms);

  if (COMICS) this.say(newWorkroom);

  this.memory.workroom = newWorkroom;
  return this.memory == newWorkroom;
}
