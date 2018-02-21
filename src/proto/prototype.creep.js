const roles = {
  builder: require("role.builder"),
  defender: require("role.defender"),
  harvester: require("role.harvester"),
  longBuilder: require("role.longBuilder"),
  longHarvester: require("role.longHarvester"),
  repairer: require("role.repairer"),
  upgrader: require("role.upgrader")
}

Creep.prototype.logic = function() {

  // Take a break and save us some CPU
  if (this.fatigue) return;

  // TO DO: Call for help
  if (this.hits < this.hitsMax) {
    this.say("Help!");
  }

  // Get to work!
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

    // Scan for any dropped resources nearby
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
