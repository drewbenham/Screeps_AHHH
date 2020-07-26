

var spawner = {

    run: function() {
        //get all creeps
        var allCreeps = Game.creeps

        //get creep types
        var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == roles.HARVESTER);
        var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == roles.UPGRADER);
        var builders = _.filter(allCreeps, (creep) => creep.memory.role == roles.BUILDER);
        
        // get all cached rooms. 
        var cachedRooms = Memory.ownedRooms;

        // find the total amount of each creep role we can handle
        var totalHarvesterCapacity = 0;
        var totalUpgraderCapacity = 0;
        var totalBuilderCapacity = 1;

        for (var room in cachedRooms) {
            totalHarvesterCapacity = findNeededHarvesterAmount(Game.rooms[cachedRooms[room]]);
        }
        for (var room in cachedRooms) {
            totalUpgraderCapacity = findNeededUpgraderAmount(Game.rooms[cachedRooms[room]]);
        }

        // create each creep role that is needed.
        var startingSpawn = Game.spawns['Spawn1'];
        if (!startingSpawn.spawning) {
            if (upgraders.length < totalUpgraderCapacity) {
                var upgraderName = creepNames.UPGRADER_NAME + Game.time;
                console.log('Behold A New ' + creepNames.UPGRADER_NAME);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], upgraderName, {memory: {role: roles.UPGRADER, ticksNotMoved: 0,  upgrading: true}})
            }

            if (builders.length < totalBuilderCapacity) {
                var builderName = creepNames.BUILDER_NAME + Game.time;
                console.log('Behold A New ' + creepNames.BUILDER_NAME);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], builderName, {memory: {role: roles.BUILDER, ticksNotMoved: 0, building: true}})
            }

            var harvestersNeeded = totalHarvesterCapacity - harvesters.length;
            if (harvestersNeeded > 0) {
                var harvesterName = creepNames.HARVESTER_NAME + Game.time;
                console.log('Behold A New ' + creepNames.HARVESTER_NAME);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], harvesterName, {memory: {role: roles.HARVESTER, ticksNotMoved: 0, upgrading: true}});
            }
        }   
        /*
        get all creep types
        determine how many you need total:
            -- harvesters = # of spaces around resources?
            -- upgraders = RCL * 2 maybe
            -- builders = # of structures / # rounded up

        determine highest priority of out of creep type and how many needed
        get what type of creep to be created:
            -- get the amount of resources available.
                --based on #of resources and creep type select modules needed (strategy pattern)
        build creep;
        */
    }
}

//**@param {Room} room */
function findNeededHarvesterAmount(room) {
    var currentRoom = room;
    var resourcesInRoom = currentRoom.find(FIND_SOURCES);
    
    var totalHarvesters = resourcesInRoom.length * 2;

    return totalHarvesters;
}

//**@param {Room} room */
function findNeededUpgraderAmount(room) {
    var currentRoom = room;
    var roomControllerLevel = currentRoom.controller.level;

    return roomControllerLevel;
}

module.exports = spawner;