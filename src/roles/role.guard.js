module.exports = {

  run: creep => {

    if (creep.recycleAt()) return;

    // Constanstly look out for foes nearby
    const foes = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

    // If so...
    if (foes.length) creep.requestMilitarySupport(foes.length);

    /**
      Travel to assigned/workroom
      */
    if (creep.room.name != creep.memory.workroom) {
      const exit = creep.room.findExitTo(creep.memory.workroom);
      creep.moveTo(creep.pos.findClosestByRange(exit));

    /**
      Offensive Routine
      */
    } else {
      const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 30);
      if (targets.length) {
        const target = creep.pos.findClosestByRange(targets);
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  }
}
