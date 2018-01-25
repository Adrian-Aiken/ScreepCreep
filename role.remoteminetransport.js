//Game.spawns['Spawn1'].spawnCreep([MOVE, CARRY, MOVE, CARRY, MOVE, CARRY], 'TestTransport', {memory: {role: 'droptransport', full: false}});

var roleRemoteMineTransport = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.full) {
            if (creep.room.name != creep.memory.mineRoom) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.mineRoom));
            } else {
                var targets = creep.room.find(FIND_DROPPED_RESOURCES);
                if (targets.length > 0) {
                    var err = creep.pickup(targets[0]);
                    if (err == ERR_NOT_IN_RANGE) creep.moveTo(targets[0]);
                    else if (err == ERR_FULL) creep.memory.full = true;
                }
            }
        }
        else
        {
            if (creep.room.name != creep.memory.dropRoom) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.dropRoom));
                return;
            } else {  
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        if (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER)
                        {
                            return structure.energy < structure.energyCapacity;
                        }

                        if (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE)
                        {
                            return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                        }
                    }
                });

                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#f0f0f0'}});
                    }
                }        
                if (creep.carry.energy == 0) creep.memory.full = false;
            }
        }
    }
};

module.exports = roleRemoteMineTransport;