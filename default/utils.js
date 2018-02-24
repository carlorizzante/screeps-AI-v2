module.exports = {

  /**
    Return a count of a Creep body parts as following example
    [3 WORK, 2 CARRY, 3 MOVE]
    @param skills Array
    */
  listSkills: function(skills) {
    const countParts = {}
    let output = "[";
    for (let skill of skills) {
      countParts[skill] = countParts[skill] ? countParts[skill] + 1 : 1;
    }
    for (let part in countParts) {
      output += countParts[part] + " " + part.toUpperCase() + ", ";
    }
    return output.slice(0,-2) + "]";
  }
}
