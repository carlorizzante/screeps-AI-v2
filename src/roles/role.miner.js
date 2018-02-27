module.exports = {

  run: creep => {

    creep.memory.locked = false;

    // TO DO: Store container and source object
    // so they don't have to be searched all over again and again

    /**
      Miners get nearby an extraction point and focus on mining,
      Resources being mined get dropped into a nearby container.
      */
    if (creep.isLocked(true, true) && creep.isCharged()) {

      // console.log(creep.memory.locked_on_energy_source_id);
      // console.log(creep.memory.locked_on_container_id);

      const container = Game.getObjectById(creep.memory.locked_on_container_id);
      creep.transfer(container, RESOURCE_ENERGY);
    }

    if (creep.isLocked(true, true) && !creep.isCharged()) {
      const energySource = Game.getObjectById(creep.memory.locked_on_energy_source_id);
      creep.harvest(energySource);
    }

    /**
      Miners need to get close to an extraction point in order to lock on it
      !! Make sure to have a container at range as well
      */
    if (!creep.isLocked(true, true)) {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
  }
}
