//Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY], 'TestTransport', {memory: {role: 'droptransport', full: false}});

var roleDropTransport = {

    getBody: function(energy) {
        const fullBody = [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE];

        const minParts = 2;
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

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        if (!creep.memory.full) {
            var targets = creep.room.find(FIND_DROPPED_RESOURCES);
            if (targets.length > 0) {
                var err = creep.pickup(targets[0]);
                if (err == ERR_NOT_IN_RANGE) creep.moveTo(targets[0]);
                else if (err == ERR_FULL) creep.memory.full = true;
            }
        }

        if (creep.memory.full && !creep.memory.target) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN || 
                        structure.structureType == STRUCTURE_TOWER)
                    {
                        return structure.energy < structure.energyCapacity;
                    }
                }
            });

            if (!target)
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_CONTAINER)
                    {
                        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }

                    return false;
                }
            });

            if (!target)
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType == STRUCTURE_STORAGE)
                    {
                        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }

                    return false;
                }
            });

            if (target) creep.memory.target = target.id;
        }

        if (creep.memory.full && creep.memory.target) {
            const target = Game.getObjectById(creep.memory.target)
            const result = creep.transfer(target, RESOURCE_ENERGY);

            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else if (result == ERR_INVALID_TARGET || result == ERR_FULL) {
                delete creep.memory.target;
            }

            if (creep.carry.energy == 0) {
                creep.memory.full = false;
                delete creep.memory.target;
            }
        }
    }
}

module.exports = roleDropTransport;