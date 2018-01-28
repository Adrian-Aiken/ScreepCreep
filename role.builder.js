var roleDropTransport = require('role.droptransport');

var roleBuilder = {

    getBody: function(energy) {
        const fullBody = [MOVE, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE];
        const minParts = 3;
        let body = [];

        for (var partID in fullBody) {
            var part = fullBody[partID];
            if (energy - BODYPART_COST[part] > 0) {
                body.push(part);
                energy -= BODYPART_COST[part];
            } else {
                return body.length >= minParts
                    ? body
                    : [];
            }
        }

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            if (!source) {
                roleDropTransport.run(creep);
                return;
            }

            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;