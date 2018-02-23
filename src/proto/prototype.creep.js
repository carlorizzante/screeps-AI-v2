const roles = {

  // Tier 1
  builder: require("role.builder"),
  harvester: require("role.harvester"),
  repairer: require("role.repairer"),
  upgrader: require("role.upgrader"),

  // Tier 2
  hero: require("role.hero"),
  exobuilder: require("role.exobuilder"),
  exoharvester: require("role.exoharvester"),

  // LEGACY Tier 2
  longBuilder: require("role.longBuilder"),
  longHarvester: require("role.longHarvester"),

  // Tier 3
  defender: require("role.defender")
}

/**
  Main AI for Creeps
  */
Creep.prototype.logic = function() {

  // TO DO: For some reason, some creep loses their role and all system crash
  if (this.memory.role == undefined) {
    this.say("☠☠☠");
    console.log("Creep with no role, body:", this.body.toString());
    // this.suicide();
    return;
  }

  // LEGACY
  if (!this.memory.homeroom) this.memory.homeroom = this.memory.home;
  if (!this.memory.workroom) this.memory.workroom = this.memory.target;

  // If it's all good, get to work!
  roles[this.memory.role].run(this);
}

// Returns true if the Creep is ready for work, false otherwise
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

// Boolean Boolean -> void
Creep.prototype.recharge = function(useSource, useStorage) {

  let storage; // undefined so far

  // Use storage logic
  if (useStorage) {
    storage = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => ((
        s == this.room.storage
        || s.structureType == STRUCTURE_CONTAINER
        || s.structureType == STRUCTURE_STORAGE)
        && s.store[RESOURCE_ENERGY] > 0
      )
    })

    // If storage found, try using it
    if (storage) {
      if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(storage);
      }
    }
  }

  // Otherwise, use Energy sources logic
  if (!storage && useSource) {

    // Find closest source
    const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    // Try recharge
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      // Otherwise get closer
      this.moveTo(source);
    }
  }
}

// @param pickUpDroppedResources Boolean
Creep.prototype.longRecharge = function(pickUpDroppedResources) {

  if (pickUpDroppedResources) {

    // Scan for any dropped resources nearby, within a short range
    const dropped_resources = this.pos.findInRange(FIND_DROPPED_RESOURCES, 10);

    // If found any
    if (dropped_resources.length) {

      // Find closest one
      let dropped_resource = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

      // Go get it!
      if (this.pickup(dropped_resource) == ERR_NOT_IN_RANGE) {
        this.moveTo(dropped_resource);

        // Do not go for harvesting energy sources
        return;
      }
    }
  }

  // If Creep is in workroom room
  if (this.room.name == this.memory.workroom) {

    // Find active source
    const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    // Try harvesting from source
    if (this.harvest(source) == ERR_NOT_IN_RANGE) {
      // Otherwise get closer to source
      this.moveTo(source);
    }

  // If not in workroom room, find exit and move towards it
  } else {
    const exit = this.room.findExitTo(this.memory.workroom);
    this.moveTo(this.pos.findClosestByPath(exit));
  }
}

Creep.prototype.transferEnergyToStructure = function() {

  let structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    // Filter results by appropriate structure type, as follow
    filter: s => ((
      s.structureType == STRUCTURE_SPAWN
      || s.structureType == STRUCTURE_EXTENSION
      || s.structureType == STRUCTURE_TOWER)
      && s.energy < s.energyCapacity
    )
  });

  // Backup to storage if all other structure are fully charged
  if (!structure) structure = this.room.storage;

  // If structure found, go transfer energy to it
  if (structure) {

    // try transfer energy to it
    if (this.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

      // if not in range, move closer
      this.moveTo(structure);
    }

  // If any target available, try to upgrade controller
  } else {
    upgrader.run(creep);
  }
}

/**
  Send a call to all spawns to send military units in room under attack
  @param foesLength Integer
  */
Creep.prototype.requestMilitarySupport = function(foesLength) {

  const type = "military_support";
  const room = this.room.name
  const id = room + "_" + type;

  // Do not duplicate or override an already sent request
  for (let r_id in Memory.board.requests) {
    if (r_id == id) return;
  }
  console.log("New request:", id, "Priority:", foesLength);
  // All good, you're free to make a New Request buddy
  const request = {
    id: id,
    type: type,
    priority: foesLength, // array.length
    time: Game.time,
    room: room,
    status: "sent" // new requests are handled by main.js
  }

  Memory.board[id] = request;
}

/**
  Place a marker for construction: STRUCTURE_ROAD
  */
Creep.prototype.requestRoad = function() {
  this.say("Road!!");
  this.pos.createConstructionSite(STRUCTURE_ROAD);
}

/**
  Returns Creep's details as follow
  ID [BODY PARTS] homeroom workroom
  */
Creep.prototype.details = function() {
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
