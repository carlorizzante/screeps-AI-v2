module.exports = {

  run: creep => {

    if (creep.suicideAt(30)) return;

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
      creep.lookForAndPickupResource();
      creep.recharge(true, false);
    }
  }
}
