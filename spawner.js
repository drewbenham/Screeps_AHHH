var Queue = require("./spawnQueue");
const SpawnQueue = require("./spawnQueue");

var spawner = {

    run: function() {
        //get all creeps
        var allCreeps = Game.creeps

        //get creep types
        var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == roles.HARVESTER);
        var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == roles.UPGRADER);
        var builders = _.filter(allCreeps, (creep) => creep.memory.role == roles.BUILDER);
        var repairers = _.filter(allCreeps, (creep) => creep.memory.role == roles.REPAIRER);
        var wallRepairers = _.filter(allCreeps, (creep) => creep.memory.role == roles.WALL_REPAIRER);
        
        // get all cached rooms. 
        var cachedRooms = Memory.ownedRooms;

        // find the total amount of each creep role we can handle
        var totalHarvesterCapacity = 0;
        var totalUpgraderCapacity = 0;
        var totalBuilderCapacity = 0;
        var totalRepairerCapacity = 0;
        var totalWallRepairerCapacity = 0;

        for (var room in cachedRooms) {
            let currentRoom = Game.rooms[cachedRooms[room]];
            totalHarvesterCapacity = findHarvesterAmount(currentRoom);
            totalUpgraderCapacity = findUpgraderAmount(currentRoom);
            totalBuilderCapacity = findBuilderAmount(currentRoom);
            totalRepairerCapacity = findRepairerAmount(currentRoom);
            totalWallRepairerCapacity = findWallRepairerAmount(currentRoom);
        }

        for (var spawn in Game.spawns) {
            var currentSpawn = Game.spawns[spawn];
            var spawnQueue = Memory.spawnQueue;
            
            var currentQueue = new SpawnQueue(spawnQueue);
            var nextInQueue = currentQueue.peek();
            if (nextInQueue) {
                if (!currentSpawn.spawning) {
                    let harvesterCrit = (nextInQueue == roles.HARVESTER) && (harvesters.length < totalHarvesterCapacity);
                    let upgraderCrit = (nextInQueue == roles.UPGRADER) && (upgraders.length < totalUpgraderCapacity);
                    let builderCrit = (nextInQueue == roles.BUILDER) && (builders.length < totalBuilderCapacity);
                    let repairerCrit = (nextInQueue == roles.REPAIRER) && (repairers.length < totalRepairerCapacity);
                    let wallRepairerCrit = (nextInQueue == roles.WALL_REPAIRER) && (wallRepairers.length < totalWallRepairerCapacity);

                    let needNewCreep = harvesterCrit || upgraderCrit || builderCrit || repairerCrit || wallRepairerCrit;

                    if (needNewCreep) {
                        nextInQueue = currentQueue.dequeue();
                        var creepName = getRoleName(nextInQueue) + Game.time;
                        Game.spawns[currentSpawn].spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: nextInQueue, ticksNotMoved: 0,  working: true}})
                    }
                } 
            }
        }
    }
}

//**@param {Room} room */
function findHarvesterAmount(room) {
    var resourcesInRoom = room.find(FIND_SOURCES);
    
    var totalHarvesters = resourcesInRoom.length * 2;

    return totalHarvesters;
}

//**@param {Room} room */
function findUpgraderAmount(room) {
    var roomControllerLevel = room.controller.level;

    return roomControllerLevel;
}

function findBuilderAmount(room) {
    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

    return Math.ceil(constructionSites.length * 0.1);
}

function findRepairerAmount(room) {
    var structures = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.hits < struct.hitsMax) && (struct.structureType != STRUCTURE_WALL)
    });

    return Math.ceil(structures.length * 0.1);
}

function findWallRepairerAmount(room) {
    var walls = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.structureType == STRUCTURE_WALL)
    });

    return Math.ceil(walls.length * 0.1);
}

function getRoleName(role) {
    var roleName = undefined;
    for (var name in roles) {
        if (role == name) {
            roleName = name;
        }
    }
    return roleName;
}

module.exports = spawner;