/////////////// TODO ///////////
// Better transport code
// Make room-centric code
// Move spawning logic to individual roles
// Generic creep code
//    - Movement when not in right room
//    - Make creeps more state-based
// Recycle and pre-death regeneration
// Warrior & Defense
// Get link mining set up

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

var MIN_TRANSPORTS = 6;
var MIN_BUILDERS = 1;
var MIN_UPGRADERS = 4;
var MIN_WALLBUILDER = 0;

var MAX_DISTRIBUTOR = 0;

var NUM_WARRIORS = 0;
var WARRIOR_BODY = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                    HEAL, HEAL];

let MINERS = [
    { mineRoom: "W5N47", sourceIndex: 0 },
    { mineRoom: "W5N47", sourceIndex: 1 },

    { mineRoom: "W6N47", sourceIndex: 1 },
    
    { mineRoom: "W5N48", sourceIndex: 0 }
];

let REMOTE_TRANSPORTS = [
    { mineRoom: "W6N47", dropRoom: "W5N47", id: 0 },
    { mineRoom: "W6N47", dropRoom: "W5N47", id: 1 },
    { mineRoom: "W6N47", dropRoom: "W5N47", id: 2 },
    
    { mineRoom: "W5N48", dropRoom: "W5N47", id: 0 },
    { mineRoom: "W5N48", dropRoom: "W5N47", id: 1 },
    { mineRoom: "W5N48", dropRoom: "W5N47", id: 2 }
];

let CLAIMERS = [
    { claimRoom: "W6N47", id: 0 },
    { claimRoom: "W5N48", id: 0 }
];



module.exports.loop = function () {

    // CLEAR DEAD
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // DETERMINE DISTRIBUTORS
    var storage = Game.getObjectById('5a5306cb87026a40d573f199');
    const canDistribute = (storage && storage.store[RESOURCE_ENERGY] > DATA.DISTRIBUTE_LIMIT);

    // SPAWN TYPES - TODO refactor
    var e = Game.rooms['W5N47'].energyAvailable;
    if (!Game.spawns['Spawn1'].spawning && e >= 200) {
        if (MINERS.length > _.sum(Game.creeps, c => c.memory.role === 'miner')) {
            for (var minerTemplate in MINERS) {
                var t = MINERS[minerTemplate];
                if (!Game.creeps['Miner' + t.mineRoom + t.sourceIndex]) {
                    var body = roleMiner.getBody(e);
                    if (body.length > 0) {
                        Game.spawns['Spawn1'].spawnCreep(body, 'Miner' + t.mineRoom + t.sourceIndex, {memory: { role: 'miner', mineRoom: t.mineRoom, sourceIndex: t.sourceIndex, full: false }});                    
                        console.log('Spawning Miner: ' + t.mineRoom + ' ' + t.sourceIndex);
                    }
                    break;
                }
            }
        }
        else if (NUM_WARRIORS > _.sum(Game.creeps, c => c.memory.role == 'warrior')) {
            Game.spawns['Spawn1'].spawnCreep(WARRIOR_BODY, 'Warrior' + Game.time, {memory: {role: 'warrior', isHurt: false}});
            console.log('Spawning Warrior');
        }
        else if (MIN_TRANSPORTS > _.sum(Game.creeps, c => c.memory.role == 'droptransport')) {
            var body = roleDropTransport.getBody(e);
            if (body.length > 0) {
                Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], 'DTransport' + Game.time, {memory: {role: 'droptransport', full: false}});
                console.log('Spawning Transport');
            }
        }
        else if (canDistribute && (MAX_DISTRIBUTOR > _.sum(Game.creeps, c => c.memory.role == 'distributor'))) {
            Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], 'Distributor' + Game.time, {memory: {role: 'distributor', full: false}});
            console.log('Spawning Distributor');
        }      
        else if (REMOTE_TRANSPORTS.length > _.sum(Game.creeps, c => c.memory.role == 'remoteminetransport')) {
            for (var rmTemp in REMOTE_TRANSPORTS) {
                var t = REMOTE_TRANSPORTS[rmTemp];
                if (!Game.creeps['RMTransport' + t.mineRoom + t.dropRoom + t.id]) {
                    Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'RMTransport' + t.mineRoom + t.dropRoom + t.id, {memory: { role: 'remoteminetransport', mineRoom: t.mineRoom, dropRoom: t.dropRoom}});
                    console.log('Spawning transport: ' + t.mineRoom + ' to ' + t.dropRoom);
                    break;
                }
            }
        }
        else if (MIN_BUILDERS > _.sum(Game.creeps, c => c.memory.role == 'builder')) {
            var body = roleBuilder.getBody(e);
            console.log(JSON.stringify(e))
            if (body.length > 0) {
                Game.spawns['Spawn1'].spawnCreep(body, 'Builder' + Game.time, {memory: {role: 'builder', building: false}});
                console.log('Spawning Builder');
            }
        }
        else if (CLAIMERS.length > _.sum(Game.creeps, c => c.memory.role == 'claimer') && e >= 1300) {
            for (var cTemp in CLAIMERS) {
                var t = CLAIMERS[cTemp];
                if (!Game.creeps['Claimer' + t.claimRoom + t.id]) {
                    Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, CLAIM, CLAIM], 'Claimer' + t.claimRoom + t.id, {memory: {role: 'claimer', claimRoom: t.claimRoom, id: t.id}});
                    console.log('Spawning claimer for room ' + t.claimRoom + " (" + t.id + ")");
                    break;
                }
            }
        }
        else if (MIN_UPGRADERS > _.sum(Game.creeps, c => c.memory.role == 'upgrader')) {
            var body = roleUpgrader.getBody(e);
            if (body.length > 0) {
                Game.spawns['Spawn1'].spawnCreep(body, 'Upgrader' + Game.time, {memory: {role: 'upgrader'}});
                console.log('Spawning Upgrader');
            }
        }
        
    }

    var towers = Game.rooms["W5N47"].find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
    for (var n in towers) {
        buildingTower.run(towers[n]);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        // Warrior check
        if (creep.hits < creep.hitsMax && (_.sum(Game.creeps, c => c.memory.role == 'warrior') < 1)) {
            Game.spawns['Spawn1'].spawnCreep(WARRIOR_BODY, 'Warrior' + Game.time, {memory: {role: 'warrior', isHurt: false, defendRoom: creep.room.name}});
            console.log('Spawning Warrior for ' + name);
        }

        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep); break;
            case 'upgrader':
                roleUpgrader.run(creep); break;
            case 'builder':
                roleBuilder.run(creep); break;
            case 'miner':
                roleMiner.run(creep); break;
            case 'droptransport':
                roleDropTransport.run(creep); break;
            case 'remoteminetransport':
                roleRemoteMineTransport.run(creep); break;
            case 'claimer':
                roleClaimer.run(creep); break;
            case 'warrior':
                roleWarrior.run(creep); break;
            case 'controllerkiller':
                roleControllerKiller.run(creep); break;
            case 'distributor':
                roleDisributor.run(creep); break;
        }
    }
}