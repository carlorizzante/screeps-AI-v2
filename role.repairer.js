const config = require("config");
const builder = require("role.builder");

const REPAIR_THESHOLD = config.repair_threshold();

module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.isCharged()) {

      // Repairer do not repair walls or rampats, too expensive!
      const structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: s => s.hits < (s.hitsMax * REPAIR_THESHOLD)
        && s.structureType != STRUCTURE_WALL
        && s.structureType != STRUCTURE_RAMPART
      });

      // If not structure in need of repair, switch to builder
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
