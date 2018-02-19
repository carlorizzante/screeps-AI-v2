const upgrader = require("role.upgrader");

module.exports = {

  // Creep -> void
  run: creep => {

    /**
      Change state: charged / not charged
      */
    if (creep.carry.energy <= 0) {
      creep.memory.charged = false;

    } else if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.charged = true;
    }

    /**
      If charged, go on duty
      */
    if (creep.memory.charged) {
      // Verify that creep is in its native room
      if (creep.room.name == creep.memory.home) {

        // const containers = creep.pos.findInRange(FIND_STRUCTURES, 10, {filter: {structureType: STRUCTURE_CONTAINER}});
        // console.log("containers:", containers);

        // If creep not on duty, find something to do
        let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            // Filter results by appropriate structure type, as follow
            filter: structure => ((
              // structure = creep.room.storage
              structure.structureType == STRUCTURE_STORAGE
              || structure.structureType == STRUCTURE_SPAWN
              || structure.structureType == STRUCTURE_EXTENSION
              || structure.structureType == STRUCTURE_TOWER)
              && structure.energy < structure.energyCapacity
            ) // structure low in energy
          });

        // If no structure found, try find a storage unit
        if (!structure) {
          structure = creep.room.storage;
          creep.say("Storage!");
        }

        // If found a valid structure, transfer energy to it
        if (structure) {
          // try transfer energy to it
          if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // if not in range, move closer
            creep.moveTo(structure, {
            visualizePathStyle: { stroke: '#7fffd4' } // aquamarine
            });
          }
        }

        // If not target available, try to upgrade controller
        if (!structure) {
          upgrader.run(creep);
        }

      // Otherwise, creep has to move towards its native room
      } else {

        // Find path to native room, and move towards it
        const exit = creep.room.findExitTo(creep.memory.home);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }

    /**
      Otherwise go recharging
      */
    } else {
      // Release creep from duty
      creep.memory.onduty = false;

      if (creep.room.name == creep.memory.target) {
        // const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        const source = creep.room.find(FIND_SOURCES)[1];

        // Try harvesting from source
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          // Otherwise get closer to source
          creep.moveTo(source, {
            visualizePathStyle: { stroke: '#7fffd4' } // aquamarine
          });
        }

      // If not in target room, find exit and move towards it
      } else {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByPath(exit));
      }
    }
  }
}
