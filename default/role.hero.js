module.exports = {

  run: creep => {

    if (creep.recycleAt(30)) return;

    const includeSpawns     = true;
    const includeExtensions = true;
    const includeTowers     = true
    const includeStorage    = true;

    // Head for home if damaged, that may save the creep
    if (creep.hits < creep.hitsMax) creep.headForHomeroom();

    // Constanstly look out for foes nearby
    const foes = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

    // TO DO: Improve requests for Military Support

    // If so...
    if (foes.length) creep.requestMilitarySupport(foes.length);

    /**
      If fatigued, place a marker for a road block
      */
    creep.requestRoad();

    /**
      Always look up for dropped Energy
      */
    creep.lookForAndPickupResource();

    /**
      If Creep is fully charged and in workroom
      */
    if (creep.isCharged() && creep.room.name == creep.memory.workroom) {

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
      If Creep is out of charge and in Workroom
      */
    } else if (!creep.isCharged() && creep.room.name == creep.memory.workroom) {

      // getEnergy using Sources, Containers, NOT Storage
      creep.getEnergy(true, true, false);

    /**
      If Creep is out of charge and still in homeroom
      */
    } else if (!creep.isCharged() && creep.room.name == creep.memory.homeroom) {
      const exit = creep.room.findExitTo(creep.memory.workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));

    /**
      Finally, if Creep is charged and in Homeroom
      */
    } else if (creep.isCharged() && creep.room.name == creep.memory.homeroom) {

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
  }
}
