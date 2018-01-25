var DATA = require('const');

var buildingTower = {

    run: function(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        } else {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    //if (structure.structureType == STRUCTURE_ROAD) return false;
                    if (structure.structureType == STRUCTURE_WALL) return structure.hits < DATA.MAX_WALL_HITS;
                    if (structure.structureType == STRUCTURE_RAMPART) return structure.hits < DATA.MAX_WALL_HITS;
                    return structure.hits < structure.hitsMax;
                }
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
}

module.exports = buildingTower;