
var roleWarrior = {
    /** @param {Creep} creep **/
    run: function(creep) { 

        // HEAL FIRST
        if (creep.hits < (creep.hitsMax / 4)) creep.memory.isHurt = true;
        if (creep.hits == creep.hitsMax) creep.memory.isHurt = false;
        if (creep.memory.isHurt) { creep.heal(creep); return; }

        // Go to room, if not in correct room
        if (creep.memory.defendRoom != creep.room.name) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.defendRoom));
            return;
        }

        // Find target
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS); 
        if (!target) target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
        // No targets - go to center of room
        if (!target) { 
            if (creep.hits < creep.hitsMax) { creep.heal(creep); return;}
        } 

        // Attack target
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
    }
};

module.exports = roleWarrior;