module.exports = {

  run: creep => {

    creep.say("M");

    /**
      Miners get nearby an extraction point and focus on mining,
      Resources being mined get dropped into a nearby container.
      */
    if (creep.isCharged()) {
      creep.dropIntoContainer();

    } else {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
}
