const roles = {
  harvester: require("role.harvester")
}

Creep.prototype.run = function() {
  // roles[this.memory.role].run(this);
  roles["harvester"].run(this);
}

Creep.prototype.recharge = function(useSource, useStorage) {

  let storage; // undefined so far

  // Use storage logic
  if (useStorage) {

  }

  // Use Energy sources logic
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
