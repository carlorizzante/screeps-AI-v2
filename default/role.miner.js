module.exports = {

  run: creep => {

    // creep.say("M");

    /**
      Miners get nearby an extraction point and focus on mining,
      Resources being mined get dropped into a nearby container.
      */
    if (creep.isLocked() && creep.isCharged())  creep.transfer(creep.memory.container, RESOURCE_ENERGY);
    if (creep.isLocked() && !creep.isCharged()) creep.harvest(creep.memory.source);

    /**
      Miners need to get close to an extraction point in order to lock on it
      */
    if (!creep.isLocked()) {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
}
