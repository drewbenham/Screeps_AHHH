require("./bestBod")();

var spawner = {

    run: function() {
        if (!Memory.spawnQueue) {
            Memory.spawnQueue = [];
        }
        var spawnQueue = Memory.spawnQueue;
        // spawn queue is empty so check what we need to make.
        if (spawnQueue.length === 0 && Memory.checkSpawnQueue) {
            console.log("rebuilding spawnQueue")
            var cachedRooms = Memory.ownedRooms;
            for (var room in cachedRooms) {
                var currentRoom = Game.rooms[cachedRooms[room]];
                var currentEnergy = currentRoom.energyAvailable;

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

                // find the number of creeps we need for the queue.
                harvestersNeeded = findHarvesterAmount(currentRoom, harvesters.length);
                upgradersNeeded = findUpgraderAmount(currentRoom, upgraders.length);
                buildersNeeded = findBuilderAmount(currentRoom, builders.length);
                repairersNeeded = findRepairerAmount(currentRoom, repairers.length);
                wallRepairersNeeded = findWallRepairerAmount(currentRoom, wallRepairers.length);

                var exact = true;
                // create the spawnQueue
                for (let i = 0; i < harvestersNeeded; i++) {

                    var idealHarvester = {ideal: exact, name: creepNames.HARVESTER_NAME, 
                        body: {WORK: 5, CARRY: 2, MOVE: 3},
                        memory: {role: roles.HARVESTER, ticksNotMoved: 0,  working: true}};
                    
                    if (findIdealCost(idealHarvester) > currentEnergy) {
                        idealHarvester.ideal = false;
                    }
                    
                    spawnQueue.push(idealHarvester);
                }
                for (let i = 0; i < buildersNeeded; i++) {
                    var idealBuilder = {ideal: exact, name: creepNames.BUILDER_NAME, 
                        body: {WORK: 5, CARRY: 5, MOVE: 8},
                        memory: {role: roles.BUILDER, ticksNotMoved: 0,  working: true}};

                    if (findIdealCost(idealBuilder) > currentEnergy) {
                        idealBuilder.ideal = false;
                    }

                    spawnQueue.push(idealBuilder);
                }
                for (let i = 0; i < repairersNeeded; i++) {
                    var idealRepairer = {ideal: exact, name: creepNames.REPAIRER_NAME, 
                        body: {WORK: 3, CARRY: 5, MOVE: 7},
                        memory: {role: roles.REPAIRER, ticksNotMoved: 0,  working: true}};

                    if (findIdealCost(idealRepairer) > currentEnergy) {
                        idealRepairer.ideal = false;
                    }

                    spawnQueue.push(idealRepairer);
                }
                for (let i = 0; i < wallRepairersNeeded; i++) {

                    var idealWallRepairer = {ideal: exact, name: creepNames.WALL_REPAIRER_NAME, 
                        body: {WORK: 3, CARRY: 4, MOVE: 4},
                        memory: {role: roles.WALL_REPAIRER, ticksNotMoved: 0,  working: true}};

                    if (findIdealCost(idealWallRepairer) > currentEnergy) {
                        idealWallRepairer.ideal = false;
                    }

                    spawnQueue.push(idealWallRepairer);
                }
                for (let i = 0; i < upgradersNeeded; i++) {

                    var idealUpgrader = {ideal: exact, name: creepNames.UPGRADER_NAME, 
                        body: {WORK: 1, CARRY: 4, MOVE: 2},
                        memory: {role: roles.UPGRADER, ticksNotMoved: 0,  working: true}};

                    if (findIdealCost(idealWallRepairer) > currentEnergy) {
                        idealWallRepairer.ideal = false;
                    }

                    spawnQueue.push(idealUpgrader);
                }
            }

            Memory.spawnQueue = spawnQueue;
            Memory.checkSpawnQueue = false;
        }
        else {
            var nextInQueue = spawnQueue[0];
            if (nextInQueue) {
                for (var spawn in Game.spawns) {
                    var currentSpawn = Game.spawns[spawn];
                    var currentRoom = currentSpawn.room;

                    var currentEnergy = currentRoom.energyAvailable;
                    if (!currentSpawn.spawning && currentEnergy >= 300) {
                        var spawnResult = currentSpawn.createBestCreep(currentEnergy, nextInQueue);
                        console.log(spawnResult);

                        if (!spawnResult) {
                            _.pullAt(spawnQueue, [0]);
                        }
                    }
                }
            }
        }
    }
}

function findIdealCost(creepOptions) {
    var totalCostNeeded = 0;
    for (let bodyPart in creepOptions.body) {
        //get the word for the part since js is dumb and
        //for some reason "work" is the same as the constant
        //used for WORK.
        let part = bodyPart.toLowerCase();
        for (let i = 0; i < creepOptions.body[bodyPart]; i++) {
            //sum up the cost.
            totalCostNeeded += BODYPART_COST[part];
        }
    }
    return totalCostNeeded;
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
    var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    let buildersNeeded = 0;
    if (constructionSites.length === 0) {
        return buildersNeeded;
    }
    else if (constructionSites.length < 10) {
        buildersNeeded = 1;
    }
    else {
        buildersNeeded = Math.floor(constructionSites.length / 10.0);
    }

    var needed = buildersNeeded - currentUpgraders
    return (needed >= 0 ? needed : 0);
}

function findRepairerAmount(room, currentRepairers) {
    var structures = room.find(FIND_STRUCTURES, {
        filter: (struct) => (struct.hits < struct.hitsMax) && (struct.structureType != STRUCTURE_WALL)
    });
    let repairersNeeded = 0;
    if (structures.length === 0) {
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
    if (walls.length === 0) {
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

module.exports = spawner;