const nearbyRooms = [
  "W8N2",
  "W7N3"
];

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
      // Verify that creep is in its native room
      if (creep.room.name == creep.memory.home) {

        // const containers = creep.pos.findInRange(FIND_STRUCTURES, 10, {filter: {structureType: STRUCTURE_CONTAINER}});
        // console.log("containers:", containers);

        let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          // Filter results by appropriate structure type, as follow
          filter: structure => ((
            structure.structureType == STRUCTURE_STORAGE
            || structure.structureType == STRUCTURE_SPAWN
            || structure.structureType == STRUCTURE_EXTENSION
            || structure.structureType == STRUCTURE_TOWER)
            && structure.energy < structure.energyCapacity) // structure low in energy
          });

        // Backup to storage if all other structure are fully charged
        if (!structure) structure = creep.room.storage;

        // If structure found, go transfer energy to it
        if (structure) {
          // try transfer energy to it
          if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            // if not in range, move closer
            creep.moveTo(structure, {
            visualizePathStyle: { stroke: '#ffffff' }
            });
          }
        }

      // Otherwise, creep has to move towards its native room
      } else {

        // Find path to native room, and move towards it
        const exit = creep.room.findExitTo(creep.memory.home);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }

    // Go recharging to the target room
    } else {
      // creep.say("Exit...");
      if (creep.memory.target == creep.memory.home) {
        creep.say("No target");
        creep.memory.target = nearbyRooms[Math.round(Math.random())];
      }

      if (creep.room.name == creep.memory.target) {
        // const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        const source = creep.room.find(FIND_SOURCES)[0];

        // Try harvesting from source
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          // Otherwise get closer to source
          creep.moveTo(source, {
            visualizePathStyle: { stroke: '#ffffff' }
          });
        }

      // If not in target room, find exit and move towards it
      } else {
        const exit = creep.room.findExitTo(creep.memory.target);
        creep.moveTo(creep.pos.findClosestByRange(exit));
      }
    }
  }
}
