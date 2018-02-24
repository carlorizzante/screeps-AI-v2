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
      
      // Include Towers
      creep.rechargeStructures(true);

    /**
      Else, go recharging
      */
    } else {
      creep.recharge(true, false);
    }
  }
}
