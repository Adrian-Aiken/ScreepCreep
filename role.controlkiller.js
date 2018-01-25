
var roleControlKiller = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.killRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.killRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        var result = creep.attackController(creep.room.controller);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00'}});
        }
    }
};

module.exports = roleControlKiller;