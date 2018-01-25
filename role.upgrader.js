var roleUpgrader = {

    getBody: function(energy) {
        const fullBody = [MOVE, CARRY, WORK, CARRY, WORK, WORK, WORK, WORK, MOVE];
        const minParts = 3;
        let body = [];

        for (var partID in fullBody) {
            var part = fullBody[partID];
            if (energy - BODYPART_COST[part] > 0) {
                body.push(part);
                energy -= BODYPART_COST[part];
            } else {
                return body.length > minParts
                    ? body
                    : [];
            }
        }

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });            
            if (!source) return;

            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;