const upgrader = require("role.upgrader");

module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.isCharged()) {
      const constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

      if (!constructionSite) {
        upgrader.run(creep);

      } else {
        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSite);
        }
      }

    } else {
      creep.recharge(true, true);
    }
  }
}
