var data = {
    MAX_WALL_HITS: 50000,
    DISTRIBUTE_LIMIT: 10000,

    Rooms: {
        "W5N47": {
            SPAWN: "Spawn1",

            MIN_TRANSPORTS: 5,
            MIN_BUILDERS: 1,
            MIN_UPGRADERS: 4,
            MAX_WARRIORS: 1,
            MAX_DISTRIBUTOR: 2,

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
                { mineRoom: "W5N48", dropRoom: "W5N47", id: 2 },
                { mineRoom: "W5N48", dropRoom: "W5N47", id: 3 }
            ],

            CLAIMERS: [
                { claimRoom: "W6N47", id: 0, takeRoom: false },
                { claimRoom: "W5N48", id: 0, takeRoom: false }

                //{ claimRoom: "W8N46", id: 0, takeRoom: true }
            ]
        },

        "W8N46": {
            SPAWN: "NewHope",

            MIN_TRANSPORTS: 5,
            MIN_BUILDERS: 1,
            MIN_UPGRADERS: 4,
            MAX_DISTRIBUTOR: 0,

            MINERS: [
                { mineRoom: "W8N46", sourceIndex: 0 },
                { mineRoom: "W8N46", sourceIndex: 1 },

                { mineRoom: "W8N45", sourceIndex: 0 }
            ],

            REMOTE_TRANSPORTS: [
                { mineRoom: "W8N45", dropRoom: "W8N46", id: 0 },
                { mineRoom: "W8N45", dropRoom: "W8N46", id: 1 }
            ],

            CLAIMERS: [

            ]
        }
    }
}

module.exports = data;