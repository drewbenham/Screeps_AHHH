var roleHarvester = require("./harvester");
var roleUpgrader = require("./upgrader");
var roleBuilder = require("./builder");

var spawner = require("./spawner");
var enums = require("./enums");
var utils = require("./utils")

// set all my rooms so i can use them later.
// ONLY CALL THIS WHEN GETTING A NEW ROOM.
function setOwnedRooms() {
    Memory.ownedRooms = [];

    // go through all available rooms.
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        if (room.controller.my) {
            Memory.ownedRooms.push(room.name);
        }
    }
}

Object.defineProperty(Source.prototype, 'memory', {
    get: function() {
        if(_.isUndefined(this.room.memory.sources)) {
            this.room.memory.sources = {};
        }
        if (!_.isObject(this.room.memory.sources)) {
            return undefined;
        }
        return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {};
    },
    set: function(value) {
        if (_.isUndefined(this.room.memory.sources)) {
            Memory.sources = {};
        }
        if (!_.isObject(this.room.memory.sources)) {
            throw new Error('Could not set source memory');
        }
        this.room.memory.sources[this.id] = value;
    }
})

//ONLY CALL THIS ONCE PER ROOM AND WHEN BUILDING A NEW ROAD.
function setWorkersPerSource() {
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
}

/*
how to use the above.
var source = creep.pos.findClosest(FIND_SOURCES, {
    filter: function(source){
        return source.memory.workers < 2; //Access this sources memory and if this source has less then 2 workers return this source
    }
});
if(source){ //If a source was found
    creep.moveTo(source);
    creep.harvest(source);

    * You should also increment the sources workers amount somehow, 
     * so the code above will know that another worker is working here. 
     * Be aware of the fact that it should only be increased once!
     *
}
*/

/*
get all sources in our room. (from above)
find how many creeps can be at each source (see spawner code)
store that number in sources memory.

Use this number to decide which source to move to for creeps?
*/

//get an array of my rooms.
setOwnedRooms();
//set num of workers that can work at each source.
setWorkersPerSource();

module.exports.loop = function() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            // get the creep from memory
            var creepToClean = Memory.creeps[name];
            //get the creeps source
            var creepsSource = Game.getObjectById(creepToClean.targetSourceId);
            //decrement the num of worker counter.
            creepsSource.memory.currentNumOfWorkers--;
            delete Memory.creeps[name];
        }
    }

    spawner.run();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var creepRole = creep.memory.role;

        if (creepRole == roles.HARVESTER) {
            roleHarvester.run(creep);
        }
        if (creepRole == roles.UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creepRole == roles.BUILDER) {
            roleBuilder.run(creep);
        }
    }
};
