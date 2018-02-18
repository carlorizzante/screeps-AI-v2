const upgrader = require("role.upgrader");

module.exports = {

  // Creep -> void
  run: creep => {

    // Switch state: charged
    if (creep.carry.energy <= 0) {
      creep.memory.charged = false;
      // creep.say("🔄 recharging");

    } else if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.charged = true;
      // creep.say("🚨 work");
    }

    // When charged, carry Energy to Spawn or storage
    if (creep.memory.charged) {

      const structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: s => s.hits < (s.hitMax * 0.8)
          && s.structureType != STRUCTURE_WALL
      });

      if (!structure) {
        upgrader.run(creep);

      } else {
        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(structure, {
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
