module.exports = {

  // Creep -> void
  run: creep => {

    if (!creep.isCharged()) {

      // Verify that creep is in its target room
      if (creep.room.name == creep.memory.target) {

        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

        if (targets.length) {
          const target = creep.pos.findClosestByRange(targets);

          // Try close range ATTACK
          if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            // Then try Ranged ATTACK
            if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
              // If none succeed, move closer to the target
              creep.moveTo(target);
            }
          }

        } else {
          if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
          }
        }

      // Otherwise, creep has to move towards its native room
      } else {

        // Find path to target room and move towards it
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }

    /**
      Otherwise go recharging
      */
    } else {
      creep.recharge(true);
    }
  }
}
