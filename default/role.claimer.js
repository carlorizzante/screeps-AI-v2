module.exports = {

  run: creep => {
    creep.say("C");

    if (creep.hits < creep.hitsMax) {

      // Watch out for foes nearby
      const foes = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 20);

      // If so...
      if (foes.length) {
        // TO DO: Request Military Support
        creep.say("help!");
        creep.requestMilitarySupport(foes.length);
      }
    }

    /**
      If Creep is in workroom, better do what it's supposed to
      */
    if (creep.room.name == creep.memory.workroom) {
      creep.say("2");
      creep.goClaimController();

    /**
      Else, move toward workroom
      */
    } else {

      // Find path to Workroom and move towards it
      const exit = creep.room.findExitTo(creep.memory.workroom);
      creep.moveTo(creep.pos.findClosestByPath(exit));
    }
  }
}
