StructureTower.prototype.logic = function() {
  const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (target) {
    this.attack(target);
  }
}
