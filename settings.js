module.exports = {

  /**
    Global settings,
    applied to the entire Empire
    */
  global: function() {
    return {}
  },

  /**
    Max energy available for Creeps Tier 1
    capped to 600
    */
  tier1_energy_cap: function() {
    return 600;
  },

  /**
    Harvesters are spawn in presence of active energy sources
    Range [6, 12]
    */
  harvesters_cap: function(room) {
    // const maxEnergy = room.energyCapacityAvailable;
    const sources = room.find(FIND_SOURCES_ACTIVE);
    if (sources.length > 1) return 12;
    return 6;
  },

  /**
    Builders are spawn only if required
    Range [2, 5]
    */
  builders_cap: function(room) {
    // const maxEnergy = room.energyCapacityAvailable;
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.min([5, 2 + constructionSites.length]);
  },

  /**
    Upgraders are spawn in a max of 8,
    reduced in number if any building is required
    Range [2, 4]
    */
  upgraders_cap: function(room) {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.max([2, 4 - constructionSites.length]);
  },

  /**
    Repairers are spawn in a fixed amount of 2
    */
  repairers_cap: function(room) {
    return 2;
  }
}
