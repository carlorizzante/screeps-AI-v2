module.exports = {

  run: creep => {

    const rechargeSpawns     = true;
    const rechargeExtensions = true;
    const rechargeTowers     = false;
    const rechargeStorage    = true;

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

    if (creep.room.name == creep.memory.homeroom && creep.recycleAt()) return;
    if (creep.room.name == creep.memory.workroom && creep.recycleAt(100)) return;

    /**
      If out of charge and not in Workroom
      */
    if (!creep.isCharged() && creep.room.name != creep.memory.workroom) {
      const exit = creep.room.findExitTo(creep.memory.workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));

    /**
      If out of charge and in Workroom
      */
    } else if (!creep.isCharged() && creep.room.name == creep.memory.workroom) {

      // getEnergy using Sources, NOT Containers, NOT Storage
      const source = creep.getEnergy(true, false, false);

      // If no source found, try another room
      if (!source) creep.resetWorkroom();

    /**
      if charged and not in Homeroom
      */
    } else if (creep.isCharged() && creep.room.name != creep.memory.homeroom) {

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
        Finally, move to Homeroom
        */
      const exit = creep.room.findExitTo(creep.memory.homeroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));

    /**
      If charged and in Homeroom
      */
    } else if (creep.isCharged() && creep.room.name == creep.memory.homeroom) {
      let result;
      structure = creep.findStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeStorage);
      if (structure) result = creep.rechargeStructure(structure);
      if (result == OK && creep.carry.energy <= 50) {
        creep.resetWorkroom();
        creep.say(creep.memory.workroom);
      }
    }

  }
}
