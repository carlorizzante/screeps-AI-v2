const config = require("config");
const upgrader = require("role.upgrader");

module.exports = {

  run: creep => {

    if (creep.recycleAt(20)) return;

    const REPAIR_THESHOLD = config.repair_threshold();

    if (creep.isCharged()) {

      /**
        Look for nearby structure to repair
        */
      const structures = creep.pos.findInRange(FIND_STRUCTURES, 6, {
        filter: s => s.hits < (s.hitsMax * REPAIR_THESHOLD)
        && s.structureType != STRUCTURE_WALL     // Not walls
        && s.structureType != STRUCTURE_RAMPART  // Not ramparts
      });

      if (structures.length) {
        creep.say("Repair!");
        if (creep.repair(structures[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structures[0]);
        }
        return;
      }

      /**
        Alternatively, look for marker where to build structures
        */
      const constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

      if (constructionSite) {
        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
        return;
      }

      /**
        If nothing found, switch to Upgrader
        */
      upgrader.run(creep);

    /**
      If depleted, go recharging
      */
    } else {
      creep.lookForAndPickupResource();

      // Recharge using Sources, NOT Containers, Storage
      creep.recharge(true, false, true);
    }
  }
}
