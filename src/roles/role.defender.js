module.exports = {

  // Creep -> void
  run: creep => {

    if (!creep.isCharged()) {

      // Verify that creep is in its target room
      if (creep.room.name == creep.memory.workroom) {

        /**
          Offensive Routine
          */
        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 30);

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

        /**
          Self Healing Routine
          */
        } else if (creep.hits < creep.hitsMax) {
            creep.heal(creep);

        /**
          Friendly Healing Routine
          */
        } else {
          const friendly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
          });

          if (friendly) {
            if (creep.heal(friendly) == ERR_NOT_IN_RANGE) {
              creep.moveTo(friendly);
            }
          }
        }

      /**
        Travel to assigned/workroom if required to do so
        */
      } else {

        // Find path to target room and move towards it
        const exit = creep.room.findExitTo(creep.memory.workroom);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    }
  }
}
