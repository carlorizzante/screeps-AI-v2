module.exports = {

  // Creep -> void
  run: creep => {

    // Switch state: charged
    if (creep.carry.energy <= 0) {
      creep.memory.charged = false;

    } else if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.charged = true;
    }

    // When charged, carry Energy to Spawn or storage
    if (creep.memory.charged) {

      let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // Filter results by appropriate structure type, as follow
        filter: structure => ((
          structure.structureType == STRUCTURE_SPAWN
          || structure.structureType == STRUCTURE_EXTENSION
          || structure.structureType == STRUCTURE_TOWER)
          && structure.energy < structure.energyCapacity
        ) // structure low in energy
      });

      // Backup to storage if all other structure are fully charged
      if (!structure) structure = creep.room.storage;

      // If structure found, go transfer energy to it
      if (structure) {
        // try transfer energy to it
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // if not in range, move closer
          creep.moveTo(structure);
        }
      }

    // Go recharging
    } else {
      creep.recharge(true, false);
    }
  }
}
