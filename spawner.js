var Queue = require("./spawnQueue");

var spawner = {

    run: function() {
        console.log("Entered Spawner");
        //get all creeps
        var allCreeps = Game.creeps;

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

            if (!spawnQueue) {
                console.log("creating spawnQueue");
                var neededQueue = [];
                for (let i = 0;  i <= (totalHarvesterCapacity - harvesters.length); i++) {
                    neededQueue.push(roles.HARVESTER);
                }
                for (let i = 0; i <= (totalUpgraderCapacity - upgraders.length); i++) {
                    neededQueue.push(roles.UPGRADER);
                }
                for (let i = 0; i <= (totalBuilderCapacity - builders.length); i++) {
                    neededQueue.push(roles.BUILDER);
                }
                for (let i = 0; i <= (totalRepairerCapacity - repairers.length); i++) {
                    neededQueue.push(roles.REPAIRER);
                }
                for (let i = 0; i <= (totalWallRepairerCapacity - wallRepairers.length); i++) {
                    neededQueue.push(roles.WALL_REPAIRER);
                }
    
                Memory.spawnQueue = neededQueue;
            }

            let harvesterCrit = (harvesters.length < totalHarvesterCapacity);
            let upgraderCrit = (upgraders.length < totalUpgraderCapacity);
            let builderCrit = (builders.length < totalBuilderCapacity);
            let repairerCrit = (repairers.length < totalRepairerCapacity);
            let wallRepairerCrit = (wallRepairers.length < totalWallRepairerCapacity);

            let needNewCreep = harvesterCrit || upgraderCrit || builderCrit || repairerCrit || wallRepairerCrit;
            if (needNewCreep) {
                var nextInQueue = spawnQueue[0];
                if (nextInQueue) {
                    if (!currentSpawn.spawning) {
                        var creepName = getRoleName(nextInQueue) + Game.time;
                        var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: nextInQueue, ticksNotMoved: 0,  working: true}});
                        if (spawnResult == 0) {
                            console.log("making creep");
                            spawnQueue.shift();
                            Memory.spawnQueue = spawnQueue;
                        }
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
    if (role == roles.HARVESTER) {
        roleName = creepNames.HARVESTER_NAME;
    }
    else if (role == roles.UPGRADER) {
        roleName = creepNames.UPGRADER_NAME;
    }
    else if (role == roles.BUILDER) {
        roleName = creepNames.BUILDER_NAME;
    }
    else if (role == roles.REPAIRER) {
        roleName = creepNames.REPAIRER_NAME;
    }
    else if (role == roles.WALL_REPAIRER) {
        roleName = creepNames.WALL_REPAIRER_NAME;
    }
    return roleName;
}

module.exports = spawner;