module.exports = {

  run: creep => {

    // 50% chances the Hauler will also take care of Towers
    if (creep.memory.includeTowers === undefined) creep.memory.includeTowers = _.sample([true, false]);

    const rechargeSpawns     = true;
    const rechargeExtensions = true;
    const rechargeTowers     = creep.memory.includeTowers;
    const rechargeStorage    = true;

    if (creep.recycleAt(20)) return;

    /**
      If fatigued, place a marker for a road block
      */
    creep.requestRoad();

    /**
      Haulers transport energy from storages, and containers, to Spawn
      */
    if (creep.isCharged()) {

      if (creep.memory.target_id) {
        structure = Game.getObjectById(creep.memory.target_id);
      } else {
        structure = creep.findStructure(rechargeSpawns, rechargeExtensions, rechargeTowers, rechargeStorage);
      }

      if (structure) {
        creep.rechargeStructure(structure);
      } else {
        delete creep.memory.target_id;
      }

    /**
      If empty, look for the nearest fully charged storage or container
      */
    } else {

      creep.lookForAndPickupResource();

      // getEnergy using NOT Sources, Containers, NOT Storage
      creep.getEnergy(false, true, false);
    }
  }
}
