const upgrader = require("role.upgrader");

module.exports = {

  // Creep -> void
  run: creep => {

    // Switch state: charged
    if (creep.carry.energy <= 0) {
      creep.memory.charged = false;

    } else if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.charged = true;
    }

    // When charged, carry Energy to Spawn or storage
    if (creep.memory.charged) {

      const constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

      if (!constructionSite) {
        upgrader.run(creep);

      } else {
        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite, {
            visualizePathStyle: { stroke: '#ffffff' }
          });
        }
      }

    // Go recharging
    } else {
      creep.recharge(true, true);
    }
  }
}
