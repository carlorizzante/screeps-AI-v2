module.exports = {

  // Creep -> void
  run: creep => {

    // Switch state: charged
    if (creep.carry.energy <= 0) {
      creep.memory.charged = false;
      // creep.say("🔄 recharging");

    } else if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.charged = true;
      // creep.say("🚨 work");
    }

    // When charged, carry Energy to Spawn or storage
    if (creep.memory.charged) {
      const structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        // Filter results by appropriate structure type, as follow
        filter: structure => ((
          structure.structureType == STRUCTURE_SPAWN
          || structure.structureType == STRUCTURE_EXTENSION
          || structure.structureType == STRUCTURE_TOWER)
          && structure.energy < structure.energyCapacity) // structure low in energy
        });

      if (structure) {
        // try transfer energy to it
        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // if not in range, move closer
          creep.moveTo(structure, {
          visualizePathStyle: { stroke: '#ffffff' }
          });
        }
      }

    } else { // Go recharging
      creep.recharge(true, false);
    }
  }
}
