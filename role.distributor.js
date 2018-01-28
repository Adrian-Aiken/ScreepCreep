var roleDistributor = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if (!creep.memory.full) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_STORAGE});
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.memory.full = true;
            }
        }
        else
        {            
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
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
                    if (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN || 
                        structure.structureType == STRUCTURE_TOWER)
                    {
                        return structure.energy < structure.energyCapacity;
                    }
                }
            });

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }        
            if (creep.carry.energy == 0) creep.memory.full = false;
        }
    }
};

module.exports = roleDistributor;