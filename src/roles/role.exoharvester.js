module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.hits < creep.hitsMax) {

      // Watch out for foes nearby
      const foes = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

      // If so...
      if (foes.length) {
        // TO DO: Request Military Support
      }
    }

    if (creep.isCharged()) {

      // Verify that creep is in its native room
      if (creep.room.name == creep.memory.homeroom) {

        // const containers = creep.pos.findInRange(FIND_STRUCTURES, 10, {filter: {structureType: STRUCTURE_CONTAINER}});
        // console.log("containers:", containers);

        creep.transferEnergyToStructure();

      // Otherwise, creep has to move towards its native room
      } else {

        // Find path to home room and move towards it
        const exit = creep.room.findExitTo(creep.memory.homeroom);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }

    /**
      Otherwise go recharging
      */
    } else {
      creep.longRecharge(true);
    }
  }
}
