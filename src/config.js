/**
  Creeps Tier 1
  */
const BUILDER   = "builder";
const HARVESTER = "harvester";
const UPGRADER  = "upgrader";

/**
  Creeps Tier 2
  */
const HAULER = "hauler";
const HERO   = "hero";
const MINER  = "miner";

/**
  Creeps Tier 3
  */
const CLAIMER  = "claimer";
const DEFENDER = "defender";
const GUARD    = "guard";

module.exports = {

  /**
    Global settings,
    applied to the entire Empire.
    */
  global: function() {
    return {}
  },

  /**
    Max energy available for Creeps Tier 1.
    capped to 800
    */
  tier1_energy_cap: function() {
    return 800;
  },

  /**
    Max energy available for Creeps Tier 2.
    capped to 1500
    */
  tier2_energy_cap: function() {
    return 1500;
  },

  /**
    Creeps Tier 2 allowed only at 1000 energy max capacity for current room.
    */
  tier2_energy_threshold: function() {
    return 800;
  },

  /**
    Creeps Tier 3 allowed only at 1500 energy max capacity for current room.
    */
  tier3_energy_threshold: function() {
    return 1500;
  },

  /**
    Harvesters are spawn in presence of active energy sources.
    Range [0, 8]
    @param room ROOM
    @param creepsCount Object, key/value count of creeps in the current room
    */
  harvesters_cap: function(room, creepsCount) {
    const tier2 = creepsCount[HAULER] + creepsCount[MINER] * 2;
    const sources = room.find(FIND_SOURCES_ACTIVE);
    if (sources.length > 1) return 8 - tier2;
    return 4 - tier2;
  },

  /**
    Builders are spawn only if required.
    Range [0, 5]
    */
  builders_cap: function(room) {
    // const maxEnergy = room.energyCapacityAvailable;
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.min([constructionSites.length, 4]);
  },

  /**
    Upgraders are spawn in a max of 8,
    reduced in number if any building is required.
    Range [2, 4]
    */
  upgraders_cap: function(room) {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.max([2, 4 - this.builders_cap(room)]);
  },

  /**
    Haulers capped to Miners * 2
    */
  haulers_cap: function(room) {
    return this.miners_cap(room) * 2;
  },

  /**
    Miners capped to number of Energy Sources in the room
    */
  miners_cap: function(room) {
    return room.find(FIND_SOURCES).length;
  },

  /**
    Guard capped at 1 per room
    */
  guard_cap: function() {
    return 0;
  },

  /**
    Repair or maintenance on structures required
    only below a specific limit of sustained damage.
    */
  repair_threshold: function() {
    return 0.5; // 50%
  },

  /**
    Improvement, repair or maintenance on walls and ramparts
    required only up to a specific limit of hit points.
    */
  wall_threshold: function() {
    return 10000; // up 50.000 hit points
  },
  rampart_threshold: function() {
    return 10000; // up 50.000 hit points
  }
}
