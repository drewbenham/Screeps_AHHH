
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

                harvestersNeeded = findHarvesterAmount(currentRoom, harvesters.length);
                upgradersNeeded = findUpgraderAmount(currentRoom, upgraders.length);
                buildersNeeded = findBuilderAmount(currentRoom, builders.length);
                repairersNeeded = findRepairerAmount(currentRoom, repairers.length);
                wallRepairersNeeded = findWallRepairerAmount(currentRoom, wallRepairers.length);
                console.log(harvestersNeeded + " " + upgradersNeeded + " " + buildersNeeded + " " + repairersNeeded + " " + wallRepairersNeeded);

                if (harvestersNeeded > 0) {
                    var creepName = creepNames.HARVESTER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: roles.HARVESTER, ticksNotMoved: 0,  working: true}});
                }
                else if (buildersNeeded > 0) {
                    var creepName = creepNames.BUILDER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: roles.BUILDER, ticksNotMoved: 0,  working: true}});
                }
                else if (repairersNeeded > 0) {
                    var creepName = creepNames.REPAIRER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: roles.REPAIRER, ticksNotMoved: 0,  working: true}});
                }
                else if (wallRepairersNeeded > 0) {
                    var creepName = creepNames.WALL_REPAIRER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: roles.WALL_REPAIRER, ticksNotMoved: 0,  working: true}});
                }
                else if (upgradersNeeded > 0) {
                    var creepName = creepNames.UPGRADER_NAME + Game.time;
                    var spawnResult = currentSpawn.spawnCreep([WORK, CARRY, MOVE], creepName, {memory: {role: roles.UPGRADER, ticksNotMoved: 0,  working: true}});
                }
            }
        }
    }
}

//**@param {Room} room */
function findHarvesterAmount(room, currentHarvesters) {
    var resourcesInRoom = Object.keys(room.memory.sources).length;
    var needed = resourcesInRoom - currentHarvesters;
    return (needed >= 0 ? needed : 0);
}

//**@param {Room} room */
function findUpgraderAmount(room, currentUpgraders) {
    var roomControllerLevel = Math.ceil(room.controller.level / 2.0);
    var needed = roomControllerLevel - currentUpgraders;
    return (needed >= 0 ? needed : 0);
}

function findBuilderAmount(room, currentUpgraders) {
    var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    let buildersNeeded = 0;
    if (!constructionSites) {
        return buildersNeeded;
    }
    else if (constructionSites.length < 10) {
        buildersNeeded = 1;
    }
    else {
        buildersNeeded = Math.floor(constructionSites / 10);
    }

    var needed = buildersNeeded - currentUpgraders
    return (needed >= 0 ? needed : 0);
}

function findRepairerAmount(room, currentRepairers) {
    var structures = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.hits < struct.hitsMax) && (struct.structureType != STRUCTURE_WALL)
    });
    let repairersNeeded = 0;
    if (!structures) {
        return repairersNeeded;
    }
    else if (structures.length < 10) {
        repairersNeeded = 1;
    }
    else {
        repairersNeeded = Math.floor(structures.length / 10);
    }
    var needed = repairersNeeded - currentRepairers 
    return (needed >= 0 ? needed : 0);
}

function findWallRepairerAmount(room, currentWallRepairers) {
    var walls = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.structureType == STRUCTURE_WALL)
    });
    let wallRepairersNeeded = 0;
    if (!walls) {
        return wallRepairersNeeded;
    }
    else if (walls.length < 10) {
        wallRepairersNeeded = 1;
    }
    else {
        wallRepairersNeeded = Math.floor(walls.length / 10);
    }

    var needed = wallRepairersNeeded - currentWallRepairers;
    return (needed >= 0 ? needed : 0);
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