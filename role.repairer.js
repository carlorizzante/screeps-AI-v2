const builder = require("role.builder");

module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.isCharged()) {

      const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: s => s.hits < (s.hitsMax * 0.8) && s.structureType != STRUCTURE_WALL
      });

      // If not structure in need to repair, see if you can help building
      if (!structure) {
        builder.run(creep);

      } else {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure);
        }
      }

    } else {
      creep.recharge(true, true);
    }
  }
}
