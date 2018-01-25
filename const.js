var data = {
    MAX_WALL_HITS: 50000,
    DISTRIBUTE_LIMIT: 10000,

    Rooms: {
        "W5N47": {
            SPAWN: "Spawn1",

            MIN_TRANSPORTS: 6,
            MIN_BUILDERS: 1,
            MIN_UPGRADERS: 4,
            MAX_DISTRIBUTOR: 0,

            MINERS: [
                { mineRoom: "W5N47", sourceIndex: 0 },
                { mineRoom: "W5N47", sourceIndex: 1 },
            
                { mineRoom: "W6N47", sourceIndex: 1 },
                
                { mineRoom: "W5N48", sourceIndex: 0 }
            ],

            REMOTE_TRANSPORTS: [
                { mineRoom: "W6N47", dropRoom: "W5N47", id: 0 },
                { mineRoom: "W6N47", dropRoom: "W5N47", id: 1 },
                { mineRoom: "W6N47", dropRoom: "W5N47", id: 2 },
                
                { mineRoom: "W5N48", dropRoom: "W5N47", id: 0 },
                { mineRoom: "W5N48", dropRoom: "W5N47", id: 1 },
                { mineRoom: "W5N48", dropRoom: "W5N47", id: 2 }
            ],

            CLAIMERS: [
                { claimRoom: "W6N47", id: 0 },
                { claimRoom: "W5N48", id: 0 }
            ]
        }
    }
}

module.exports = data;