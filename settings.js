module.exports = {

  /**
    Global settings,
    applied to the entire Empire
    */
  global: function() {
    return {}
  },

  /**
    Harvesters are spawn in presence of active energy sources
    Range [4, 12]
    */
  harvesters_cap: function(room) {
    // const maxEnergy = room.energyCapacityAvailable;
    const sources = room.find(FIND_SOURCES_ACTIVE);
    if (sources.length) return 12;
    return 4;
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
    Range [2, 8]
    */
  upgraders_cap: function(room) {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return _.max([2, 8 - constructionSites.length]);
  },

  /**
    Repairers are spawn in a fixed amount of 2
    */
  repairers_cap: function(room) {
    return 2;
  }
}
