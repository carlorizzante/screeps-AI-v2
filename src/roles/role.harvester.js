module.exports = {

  run: creep => {

    creep.memory.homeroom = "W8N3";
    delete creep.memory.source_id;
    delete creep.memory.structure_id;

    if (creep.recycleAt()) return;

    // 50% chances the Hauler will also take care of Towers
    if (creep.memory.includeTowers === undefined) creep.memory.includeTowers = _.sample([true, false]);

    const rechargeSpawns     = true;
    const rechargeExtensions = true;
    const rechargeTowers     = creep.memory.includeTowers;
    const rechargeStorage    = true;

    // TO DO: Better escape routine

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

      // Reset Workroom is no Active Source found
      // if (!source) creep.resetWorkroom();

    /**
      if charged and not in Homeroom
      */
    } else if (creep.isCharged() && creep.room.name != creep.memory.homeroom) {
      const exit = creep.room.findExitTo(creep.memory.homeroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));

    /**
      If charged and in Homeroom
      */
    } else if (creep.isCharged() && creep.room.name == creep.memory.homeroom) {

      if (creep.recycleAt(20)) return;

      structure = creep.findStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeStorage);
      if (structure) creep.rechargeStructure(structure);
    }

  }
}
