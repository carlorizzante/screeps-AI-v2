const roles = {
  harvester: require("role.harvester"),
  upgrader: require("role.upgrader"),
  builder: require("role.builder"),
  repairer: require("role.repairer"),
  longHarvester: require("role.longHarvester")
}

Creep.prototype.logic = function() {
  roles[this.memory.role].run(this);
  // roles["harvester"].run(this);
}

// Boolean Boolean -> void
Creep.prototype.recharge = function(useSource, useStorage) {

  let storage; // undefined so far

  // Use storage logic
  if (useStorage) {
    storage = this.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => ((
        structure == this.room.storage
        || structure.structureType == STRUCTURE_CONTAINER
        || structure.structureType == STRUCTURE_STORAGE)
        && structure.store[RESOURCE_ENERGY] > 0
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
