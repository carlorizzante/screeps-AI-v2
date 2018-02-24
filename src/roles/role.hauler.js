module.exports = {

  run: creep => {

    // creep.say("H");
    // if (creep.memory.includeTowers) creep.say("HT");
    // creep.memory.includeTowers = undefined; // RESET

    /**
      If fatigued, place a marker for a road block
      */
    if (creep.fatigue) {
      creep.requestRoad();
      return;
    }

    /**
      Haulers transport energy from storages, and containers, to Spawn
      */
    if (creep.isCharged()) {

      // 50% chances the Hauler will also take care of Towers
      if (creep.memory.includeTowers === undefined) creep.memory.includeTowers = _.sample([true, false]);
      creep.rechargeStructures(creep.memory.includeTowers);

    /**
      If empty, look for the nearest fully charged storage or container
      */
    } else {

      creep.pickUpDroppedResources(10);

      const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => ((
          s.structureType == STRUCTURE_CONTAINER)
          && s.store[RESOURCE_ENERGY] >= creep.carryCapacity / 2
        )
      });

      if (storage) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
        }
      }
    }
  }
}
