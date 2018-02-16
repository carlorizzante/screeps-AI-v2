module.exports = {

  // Creep -> void
  run: creep => {

    // Switch state: charged
    if (creep.carry.energy <= 0) {
      creep.memory.charged = false;
      // creep.say("🔄 recharging");

    } else if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.charged = true;
      // creep.say("🚨 work");
    }

    // When charged, carry Energy to Spawn or storage
    if (creep.memory.charged) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // if not in range, move closer
        creep.moveTo(creep.room.controller, {
        visualizePathStyle: { stroke: '#ffffff' }
        });
      }

    } else { // Go recharging
      creep.recharge(true, false);
    }
  }
}
