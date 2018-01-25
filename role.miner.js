// Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE], undefined, {memory: {role: 'miner', sourceIndex: N}});

var roleMiner = {

    getBody: function(energy) {
        const fullBody = [MOVE, WORK, WORK, WORK, WORK, WORK, MOVE];
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
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        var room = Game.rooms[creep.memory.mineRoom];
        if (!room) {
            creep.moveTo(new RoomPosition(15, 15, creep.memory.mineRoom), {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }

        var source = Game.rooms[creep.memory.mineRoom].find(FIND_SOURCES)[creep.memory.sourceIndex]; 
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports = roleMiner;