module.exports = {

  // Creep -> void
  run: creep => {

    if (creep.isCharged()) {
      creep.transferEnergyToStructure();

    } else {
      creep.recharge(true, false);
    }
  }
}
