module.exports = {

  run: creep => {

    // creep.say("M");

    // TO DO: Store container and source object
    // so they don't have to be searched all over again and again

    /**
      Miners get nearby an extraction point and focus on mining,
      Resources being mined get dropped into a nearby container.
      */
    if (creep.isLocked() && creep.isCharged()) {
      creep.memory.container = creep.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType == STRUCTURE_CONTAINER
      })[0];
      creep.transfer(creep.memory.container, RESOURCE_ENERGY)
    }
    if (creep.isLocked() && !creep.isCharged()) {
      // console.log(creep.pos.findInRange(FIND_SOURCES, 1), creep.pos.findClosestByRange(FIND_SOURCES));
      creep.memory.source = creep.pos.findClosestByRange(FIND_SOURCES);
      creep.harvest(creep.memory.source);
    }

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
