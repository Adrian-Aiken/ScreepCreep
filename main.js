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

var colony = require('colony');

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

    // COLONY CODE
    var creepsByColony = _.groupBy(Game.creeps, 'memory.base');
    for (var colonyName in creepsByColony) {
        if (colonyName === 'undefined' ||
            colonyName === 'roomName') continue;
        colony.run(colonyName, creepsByColony[colonyName]);
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