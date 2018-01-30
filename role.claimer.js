var roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.claimRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.claimRoom), {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }

        if (creep.room.controller.owner) {            
            if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        } else {
            if (creep.memory.takeRoom && creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00'}});
            }

            else if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};

module.exports = roleClaimer;