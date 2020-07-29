
var spawner = {

    run: function() {
        for (var spawn in Game.spawns) {
            var currentSpawn = Game.spawns[spawn];
            var currentRoom = currentSpawn.room;

            if (!currentSpawn.spawning) { 

                //get all creeps
                var allCreeps = Game.creeps;

                //get creep types
                var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == roles.HARVESTER);
                var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == roles.UPGRADER);
                var builders = _.filter(allCreeps, (creep) => creep.memory.role == roles.BUILDER);
                var repairers = _.filter(allCreeps, (creep) => creep.memory.role == roles.REPAIRER);
                var wallRepairers = _.filter(allCreeps, (creep) => creep.memory.role == roles.WALL_REPAIRER);

                var harvestersNeeded = 0;
                var upgradersNeeded = 0;
                var buildersNeeded = 0;
                var repairersNeeded = 0;
                var wallRepairersNeeded = 0;

                harvestersNeeded = findHarvesterAmount(currentRoom, harvesters);
                upgradersNeeded = findUpgraderAmount(currentRoom, upgraders);
                buildersNeeded = findBuilderAmount(currentRoom, builders);
                repairersNeeded = findRepairerAmount(currentRoom);
                wallRepairersNeeded = findWallRepairerAmount(currentRoom);

                if (harvestersNeeded > 0) {
                    var creepName = creepNames.HARVESTER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: nextInQueue, ticksNotMoved: 0,  working: true}});
                }
                else if (upgradersNeeded > 0) {
                    var creepName = creepNames.UPGRADER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: nextInQueue, ticksNotMoved: 0,  working: true}});
                }
            }
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
function findHarvesterAmount(room, harvesters) {
    var resourcesInRoom = room.memory.sources.length;
    return resourcesInRoom - harvesters.length;
}

//**@param {Room} room */
function findUpgraderAmount(room, upgraders) {
    var roomControllerLevel = Math.ceil(room.controller.level / 2);
    return roomControllerLevel - upgraders.length;
}

function findBuilderAmount(room, builders) {
    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    let buildersNeeded = 0;
    if (!constructionSites) {
        break;
    }
    else if (constructionSites.length < 10) {
        buildersNeeded = 1;
    }
    else {
        buildersNeeded = Math.floor(constructionSites / 10);
    }

    return buildersNeeded;
}

function findRepairerAmount(room) {
    var structures = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.hits < struct.hitsMax) && (struct.structureType != STRUCTURE_WALL)
    });
    let repairersNeeded = 0;
    if (!structures) {
        break;
    }
    else if (structures.length < 10) {
        repairersNeeded = 1;
    }
    else {
        repairersNeeded = Math.floor(structures.length / 10);
    }

    return repairersNeeded;
}

function findWallRepairerAmount(room) {
    var walls = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.structureType == STRUCTURE_WALL)
    });
    let wallRepairersNeeded = 0;
    if (!walls) {
        break;
    }
    else if (walls.length < 10) {
        repairersNeeded = 1;
    }
    else {
        repairersNeeded = Math.floor(walls.length / 10);
    }

    return wallRepairersNeeded;
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