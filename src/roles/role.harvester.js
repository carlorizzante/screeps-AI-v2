module.exports = {

  run: creep => {

    // At spawning Harvesters have 25% chances to be assigned to Towers too
    creep.memory.includeTowers = creep.memory.includeTowers ? creep.memory.includeTowers : _.sample([true, false, false]);

    const includeSpawns     = true;
    const includeExtensions = true;
    const includeTowers     = creep.memory.includeTowers;
    const includeStorage    = false;

    /**
      If fatigued, place a marker for a road block
      */
    creep.requestRoad();

    /**
      If charged, transfer Energy to Structures
      */
    if (creep.isCharged()) {

      // 25% chances the Hauler will also take care of Towers
      // if (creep.memory.includeTowers === undefined) creep.memory.includeTowers = _.sample([true, false, false, false]);
      // creep.rechargeStructures_2(creep.memory.includeTowers);

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

    /**
      Else, go recharging
      */
    } else {
      creep.recharge(true, false);
    }
  }
}
