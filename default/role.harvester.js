module.exports = {

  run: creep => {

    /**
      If fatigued, place a marker for a road block
      */
    if (creep.fatigue) {
      creep.requestRoad();
      return;
    }

    /**
      If charged, transfer Energy to Structures
      */
    if (creep.isCharged()) {

      // 25% chances the Hauler will also take care of Towers
      if (creep.memory.includeTowers === undefined) creep.memory.includeTowers = _.sample([true, false, false, false]);
      creep.rechargeStructures(creep.memory.includeTowers);

    /**
      Else, go recharging
      */
    } else {
      creep.recharge(true, false);
    }
  }
}
