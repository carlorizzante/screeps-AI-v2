module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.isCharged()) {

      // Verify that creep is in its native room
      if (creep.room.name == creep.memory.home) {

        // const containers = creep.pos.findInRange(FIND_STRUCTURES, 10, {filter: {structureType: STRUCTURE_CONTAINER}});
        // console.log("containers:", containers);

        creep.transferEnergyToStructure();

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
      creep.longRecharge(true);
    }
  }
}
