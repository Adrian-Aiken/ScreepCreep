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

var colony = {
    run: function(roomName, creeps) {
        var room = Game.rooms[roomName];

        var template = DATA.Rooms[roomName];   
        var energy = room.energyAvailable;
        var spawn = Game.spawns[template.SPAWN];

        var storage = room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_STORAGE});
        const canDistribute = (storage.length > 0 && storage[0].store[RESOURCE_ENERGY] > DATA.DISTRIBUTE_LIMIT);        

        // MANAGE TOWERS
        var towers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        for (var n in towers) {
            buildingTower.run(towers[n]);
        }


        // SPAWNING
        if (!spawn.spawning && energy >= 200) {

            // MINER
            if (template.MINERS.length > _.sum(creeps, c => c.memory.role === 'miner')) {
                for (var minerTemplate in template.MINERS) {
                    var t = template.MINERS[minerTemplate];
                    if (!creeps['Miner' + t.mineRoom + t.sourceIndex]) {
                        var body = roleMiner.getBody(energy);
                        if (body.length > 0) {
                            spawn.spawnCreep(body, 'Miner' + t.mineRoom + t.sourceIndex,
                            {
                                memory: { 
                                    base: roomName,
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
                            base: roomName,
                            role: 'warrior',
                            isHurt: false
                        }
                    });
                console.log('[' + roomName + '] Spawning Warrior');
            }

            // TRANSPORT
            else if (template.MIN_TRANSPORTS > _.sum(creeps, c => c.memory.role == 'droptransport')) {
                var body = roleDropTransport.getBody(energy);
                if (body.length > 0) {
                    spawn.spawnCreep(body, 'DTransport' + Game.time,
                        {
                            memory: {
                                base: roomName,
                                role: 'droptransport',
                                full: false
                            }
                        });
                    console.log('[' + roomName + '] Spawning Transport');
                }
            }

            // DISTRIBUTOR
            else if (canDistribute && (template.MAX_DISTRIBUTOR > _.sum(creeps, c => c.memory.role == 'distributor'))) {
                spawn.spawnCreep([MOVE, CARRY, CARRY, CARRY, CARRY, MOVE], 'Distributor' + Game.time,
                    {
                        memory: {
                            base: roomName,
                            role: 'distributor',
                            full: false
                        }
                    });
                console.log('[' + roomName + '] Spawning Distributor');
            }
            
            // REMOTE TRANSPORT
            else if (template.REMOTE_TRANSPORTS.length > _.sum(creeps, c => c.memory.role == 'remoteminetransport')) {
                for (var rmTemp in template.REMOTE_TRANSPORTS) {
                    var t = template.REMOTE_TRANSPORTS[rmTemp];
                    if (!creeps['RMTransport' + t.mineRoom + t.dropRoom + t.id]) {
                        spawn.spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'RMTransport' + t.mineRoom + t.dropRoom + t.id,
                            {
                                memory: {
                                    base: roomName,
                                    role: 'remoteminetransport',
                                    mineRoom: t.mineRoom,
                                    dropRoom: t.dropRoom
                                }
                            });
                        console.log('[' + roomName + '] Spawning transport: ' + t.mineRoom + ' to ' + t.dropRoom);
                        break;
                    }
                }
            }

            // BUILDERS
            else if (template.MIN_BUILDERS > _.sum(creeps, c => c.memory.role == 'builder')) {
                var body = roleBuilder.getBody(energy);
                if (body.length > 0) {
                    spawn.spawnCreep(body, 'Builder' + Game.time,
                        {
                            memory: {
                                base: roomName,
                                role: 'builder',
                                building: false
                            }
                        });
                    console.log('[' + roomName + '] Spawning Builder');
                }
            }

            // CLAIMERS
            else if (template.CLAIMERS.length > _.sum(creeps, c => c.memory.role == 'claimer') && e >= 1300) {
                for (var cTemp in template.CLAIMERS) {
                    var t = template.CLAIMERS[cTemp];
                    if (!creeps['Claimer' + t.claimRoom + t.id]) {
                        spawn.spawnCreep([MOVE, MOVE, CLAIM, CLAIM], 'Claimer' + t.claimRoom + t.id,
                            {
                                memory: {
                                    base: roomName,
                                    role: 'claimer',
                                    claimRoom: t.claimRoom,
                                    id: t.id
                                }
                            });
                        console.log('[' + roomName + '] Spawning claimer for room ' + t.claimRoom + " (" + t.id + ")");
                        break;
                    }
                }
            }

            // UPGRADERS
            else if (template.MIN_UPGRADERS > _.sum(creeps, c => c.memory.role == 'upgrader')) {
                var body = roleUpgrader.getBody(energy);
                if (body.length > 0) {
                    spawn.spawnCreep(body, 'Upgrader' + Game.time, 
                        {
                            memory: {
                                base: roomName,
                                role: 'upgrader'
                            }
                        });
                    console.log('[' + roomName + '] Spawning Upgrader');
                }
            }            
        }

    }
}

module.exports = colony;