const roles = [
  "harvester",
  "upgrader",
  "builder",
  "repairer",
  "longHarvester"
];

StructureSpawn.prototype.logic = function() {

  const room = this.room;

  // Find all creeps in this room
  const creeps = room.find(FIND_MY_CREEPS);
  const creepCount = {}

  const maxEnergy = room.energyCapacityAvailable;
  const currentEnergy = room.energyAvailable;

  // Spawn only the best creeps available
  if (currentEnergy < maxEnergy) return;

  for (let role of roles) {
    creepCount[role] = _.sum(creeps, c => c.memory.role == role);
  }

  if (creepCount["harvester"] < 4) {
    this.spawnCreepTier1("harvester", this.room.name);

  } else if (creepCount["longHarvester"] < 16) {
    // Choosing as target one of the adjacent reooms
    const nearbyRooms = Game.map.describeExits(this.room.name);
    let targets = [];
    for (let index in nearbyRooms) {
      targets.push(nearbyRooms[index]);
    }
    this.spawnCreepTier1("longHarvester", _.sample(targets));

  } else if (creepCount["upgrader"] < 3) {
    this.spawnCreepTier1("upgrader", this.room.name);

  } else if (creepCount["builder"] < 3) {
    this.spawnCreepTier1("builder", this.room.name);

  } else if (creepCount["repairer"] < 1) {
    this.spawnCreepTier1("repairer", this.room.name);
  }
}

// String -> void
StructureSpawn.prototype.spawnCreepTier1 = function(role, target) {

  // Delete from memory creeps not longer existing
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log(name, "deleted from memory.");
      delete Memory.creeps[name];
    }
  }

  const room = this.room;
  const home = this.room.name
  const maxEnergy = room.energyCapacityAvailable;
  let energyAvailable = room.energyAvailable;
  let energyUsed = 0;
  const skills = [];

  // Reserve half energy for WORK capacity
  while (energyAvailable > maxEnergy / 2) {
    skills.push(WORK);
    energyAvailable -= 100;
    energyUsed += 100;
  }

  // Distribute remaining energy among CARRY and then MOVE
  let energyBlocks = energyAvailable / 50;
  // let carry = Math.floor(energyBlocks / 2 + energyBlocks % 2);
  let move = Math.floor(energyBlocks / 2);
  let carry = energyBlocks - move;

  while (carry) {
    skills.push(CARRY);
    carry -= 1;
    energyAvailable -= 50;
    energyUsed += 50;
  }

  while (move) {
    skills.push(MOVE);
    move -= 1;
    energyAvailable -= 50;
    energyUsed += 50;
  }

  // Output specs new creep
  const specs = "["
    + _.sum(skills, s => s == WORK) + " WORK, "
    + _.sum(skills, s => s == CARRY) + " CARRY, "
    + _.sum(skills, s => s == MOVE) + " MOVE]";
  let name = role + energyUsed + "-" + Game.time;

  console.log("Spawning", name, specs, "Target:", target);

  // Spawning new creep
  const result = Game.spawns["Spawn1"].spawnCreep(skills, name, {
    memory: {
      role: role,
      home: home,
      target: target
    }
  });
}
