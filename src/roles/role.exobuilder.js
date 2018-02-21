const exoharvester = require("role.exoharvester");

module.exports = {

  // Creep -> void
  run: creep => {

    if (this.hits < this.hitsMax) {
      // TO DO: Request Military Support
    }

    if (creep.isCharged()) {

      // Verify that creep is in its workroom room
      if (creep.room.name == creep.memory.workroom) {

        // const containers = creep.pos.findInRange(FIND_STRUCTURES, 10, {filter: {structureType: STRUCTURE_CONTAINER}});
        // console.log("containers:", containers);

        /**
          Prioritize repair over construction
          */
        const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: s => s.hits < (s.hitsMax * 0.5) && s.structureType != STRUCTURE_WALL
        });

        if (structure) {
          if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
          }

          // Stay on duty - repair before construct
          return;
        }

        /**
          Otherwise, if no maintenance needed, proceed to construct
          */
        const constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (constructionSite) {
          if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite);
          }

        /**
          Finally, if no construction or repairment needed,
          switch into Long Range Harvesting mode
          */
        } else {
          // Hopefully Creep will also move toward home room
          return exoharvester.run(creep);
        }

      // Otherwise, creep has to move towards its native room
      } else {

        // Find path to workroom room and move towards it
        const exit = creep.room.findExitTo(creep.memory.workroom);
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
