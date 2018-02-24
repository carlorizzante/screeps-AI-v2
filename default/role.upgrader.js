module.exports = {

  run: creep => {

    if (creep.isCharged()) {

      // Try upgrade Room Controller
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {

        // If not in range, move closer
        creep.moveTo(creep.room.controller);
      }

    } else {
      // Recharge using Sources, Storage, NOT Containers
      creep.recharge(true, true, false);
    }
  }
}
