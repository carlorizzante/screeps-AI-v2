const longHarvester = require("role.longHarvester");

module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.isCharged()) {

      // Verify that creep is in its target room
      if (creep.room.name == creep.memory.target) {

        // const containers = creep.pos.findInRange(FIND_STRUCTURES, 10, {filter: {structureType: STRUCTURE_CONTAINER}});
        // console.log("containers:", containers);

        const constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (!constructionSite) {
          longHarvester.run(creep);

        } else {
          if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite);
          }
        }

      // Otherwise, creep has to move towards its native room
      } else {

        // Find path to target room and move towards it
        const exit = creep.room.findExitTo(creep.memory.target);
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
