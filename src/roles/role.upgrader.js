module.exports = {

  run: creep => {

    if (creep.recycleAt()) return;

    if (creep.isCharged()) {

      // Try upgrade Room Controller
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {

        // If not in range, move closer
        creep.moveTo(creep.room.controller);
      }

    } else {
      creep.lookForAndPickupResource();

      // getEnergy using Sources, NOT Containers, Storage
      creep.getEnergy(true, false, true);
    }
  }
}
