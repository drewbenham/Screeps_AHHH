var SpawnQueue = require("./spawnQueue");

var persistentMemory = {


    // set all my rooms so i can use them later.
    // ONLY CALL THIS WHEN GETTING A NEW ROOM.
    setOwnedRooms: function() {
        Memory.ownedRooms = [];

        // go through all available rooms.
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            if (room.controller.my) {
                Memory.ownedRooms.push(room.name);
            }
        }
    },

    //ONLY CALL THIS ONCE PER ROOM AND WHEN BUILDING A NEW ROAD.
    setWorkersPerSource: function() {
        // loop through all rooms your creeps/structures are in.
        var cachedRooms = Memory.ownedRooms
        for (var roomName in cachedRooms) {
            var room = Game.rooms[cachedRooms[roomName]];
            //if this room has no sources in memory yet.
            if (!room.memory.sources) {
                //get all sources in this room.
                var sources = room.find(FIND_SOURCES);
                for (var i in sources) {
                    var source = sources[i];
                    // set the max num of workers for this source.
                    source.memory.maxWorkers = utils.findSpacesAroundResource(source, room);
                    // initialize the num of workers to 0.
                    source.memory.currentNumOfWorkers = 0;
                    //TODO: This is saving an entire object not sure if that is too much
                    // set the path from the spawn to this source.
                    var spawners = room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN);
                        }
                    });
                    const path = room.findPath(spawners[0].pos, source.pos);
                    source.memory.pathFromSpawn = path;
                }
            }   
        }
    },

    setSpawnQueue: function() {
        var spawnQueue = Memory.spawnQueue;
        
        if (!spawnQueue) {
            Memory.spawnQueue = new SpawnQueue();
        }
    }
}

module.exports = persistentMemory;