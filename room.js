var DATA = require('const');

var buildingTower = require('building.tower');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleDropTransport = require('role.droptransport');
var roleRemoteMineTransport = require('role.remoteminetransport');
var roleClaimer = require('role.claimer');
var roleWarrior = require('role.warrior');
var roleControllerKiller = require('role.controlkiller');
var roleDisributor = require('role.distributor');

var roomCode = {
    run: function(roomName, creeps) {
        var room = Game.rooms[roomName];

        var template = DATA.Rooms[roomName];   
        var energy = room.energyAvailable;
        var spawn = Game.spawns[template.SPAWN];

        // SPAWNING
        if (!spawn.spawning && energy >= 200) {

            // MINER
            if (template.MINERS.length > _.sum(creeps, c => c.memory.role === 'miner')) {
                for (var minerTemplate in template.MINERS) {
                    var t = template.MINERS[minerTemplate];
                    if (!Game.creeps['Miner' + t.mineRoom + t.sourceIndex]) {
                        var body = roleMiner.getBody(e);
                        if (body.length > 0) {
                            spawn.spawnCreep(body, 'Miner' + t.mineRoom + t.sourceIndex,
                            {
                                memory: { 
                                    base: 'roomName',
                                    role: 'miner', 
                                    mineRoom: t.mineRoom, 
                                    sourceIndex: t.sourceIndex, 
                                    full: false 
                                }
                            });                    
                            console.log('[' + roomName + '] Spawning Miner: ' + t.mineRoom + ' ' + t.sourceIndex);
                        }
                        break;
                    }
                }
            }
            
            // WARRIOR
            else if (template.NUM_WARRIORS > _.sum(creeps, c => c.memory.role == 'warrior')) {
                spawn.spawnCreep(WARRIOR_BODY, 'Warrior' + Game.time,
                    {
                        memory: {
                            base: 'roomName',
                            role: 'warrior',
                            isHurt: false
                        }
                    });
                console.log('[' + roomName + '] Spawning Warrior');
            }

            // TRANSPORT
            else if (template.MIN_TRANSPORTS > _.sum(creeps, c => c.memory.role == 'droptransport')) {
                var body = roleDropTransport.getBody(e);
                if (body.length > 0) {
                    Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], 'DTransport' + Game.time, {memory: {role: 'droptransport', full: false}});
                    console.log('[' + roomName + '] Spawning Transport');
                }
            }
            else if (canDistribute && (MAX_DISTRIBUTOR > _.sum(Game.creeps, c => c.memory.role == 'distributor'))) {
                Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], 'Distributor' + Game.time, {memory: {role: 'distributor', full: false}});
                console.log('[' + roomName + '] Spawning Distributor');
            }      
            else if (REMOTE_TRANSPORTS.length > _.sum(Game.creeps, c => c.memory.role == 'remoteminetransport')) {
                for (var rmTemp in REMOTE_TRANSPORTS) {
                    var t = REMOTE_TRANSPORTS[rmTemp];
                    if (!Game.creeps['RMTransport' + t.mineRoom + t.dropRoom + t.id]) {
                        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'RMTransport' + t.mineRoom + t.dropRoom + t.id, {memory: { role: 'remoteminetransport', mineRoom: t.mineRoom, dropRoom: t.dropRoom}});
                        console.log('[' + roomName + '] Spawning transport: ' + t.mineRoom + ' to ' + t.dropRoom);
                        break;
                    }
                }
            }
            else if (MIN_BUILDERS > _.sum(Game.creeps, c => c.memory.role == 'builder')) {
                var body = roleBuilder.getBody(e);
                console.log(JSON.stringify(e))
                if (body.length > 0) {
                    Game.spawns['Spawn1'].spawnCreep(body, 'Builder' + Game.time, {memory: {role: 'builder', building: false}});
                    console.log('[' + roomName + '] Spawning Builder');
                }
            }
            else if (CLAIMERS.length > _.sum(Game.creeps, c => c.memory.role == 'claimer') && e >= 1300) {
                for (var cTemp in CLAIMERS) {
                    var t = CLAIMERS[cTemp];
                    if (!Game.creeps['Claimer' + t.claimRoom + t.id]) {
                        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CLAIM, CLAIM], 'Claimer' + t.claimRoom + t.id, {memory: {role: 'claimer', claimRoom: t.claimRoom, id: t.id}});
                        console.log('[' + roomName + '] Spawning claimer for room ' + t.claimRoom + " (" + t.id + ")");
                        break;
                    }
                }
            }
            else if (MIN_UPGRADERS > _.sum(Game.creeps, c => c.memory.role == 'upgrader')) {
                var body = roleUpgrader.getBody(e);
                if (body.length > 0) {
                    Game.spawns['Spawn1'].spawnCreep(body, 'Upgrader' + Game.time, {memory: {role: 'upgrader'}});
                    console.log('[' + roomName + '] Spawning Upgrader');
                }
            }
            
        }

        var towers = Game.rooms["W5N47"].find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        for (var n in towers) {
            buildingTower.run(towers[n]);
        }

    }
}

module.exports = roomCode;