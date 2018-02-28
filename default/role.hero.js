module.exports = {

  run: creep => {

    const includeSpawns     = true;
    const includeExtensions = true;
    const includeTowers     = false
    const includeStorage    = false;

    if (creep.hits < creep.hitsMax) {

      // Watch out for foes nearby
      const foes = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

      // If so...
      if (foes.length) {
        // TO DO: Improve requests for Military Support
        creep.say("help!");
        creep.requestMilitarySupport(foes.length);
        creep.headForHomeroom();
      }
    }

    /**
      If fatigued, place a marker for a road block
      */
    creep.requestRoad();

    /**
      If Creep is fully charged and in workroom
      */
    if (creep.isCharged()) {

      /**
        If Creep is in workroom, perform chores
        */
      if (creep.room.name == creep.memory.workroom) {

        /**
          Prioritize repair over construction
          This is setup to repair over time only structures that are actually used
          Repair acts on a 3 squares range
          */
        const structures = creep.pos.findInRange(FIND_STRUCTURES, 3, {
          filter: s => s.hits < (s.hitsMax * 0.3) && s.structureType != STRUCTURE_WALL
        });

        if (structures.length) {
          if (creep.repair(structures[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structures[0]);
          }
          return; // Stay on duty - repair before construct
        }

        /**
          Otherwise, look for costruction sites
          */
        const constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if (constructionSite) {
          if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite);
          }
          return; // Stay on duty, go building stuffs
        }

        /**
          Else, if nothing left to do in workroom,
          move back to homeroom
          */
        const exit = creep.room.findExitTo(creep.memory.homeroom);
        creep.moveTo(creep.pos.findClosestByPath(exit));

      /**
        Else, creep should be in homeroom
        */
      } else {

        if (creep.memory.target_id) {
          structure = Game.getObjectById(creep.memory.target_id);
        } else {
          structure = creep.findStructure(includeSpawns, includeExtensions, includeTowers, includeStorage);
        }

        if (structure) {
          creep.rechargeStructure(structure);
        } else {
          delete creep.memory.target_id;
        }
      }

    /**
      Else, Creep is out of charge, so go recharging
      this includes moving toward Workroom
      */
    } else {
      creep.lookForAndPickupResource();
      creep.longRecharge(true);
    }
  }
}
