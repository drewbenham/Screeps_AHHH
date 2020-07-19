

var spawner = {

    run: function() {
        //get all creeps
        var allCreeps = Game.creeps

        //get creep types
        var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == roles.HARVESTER);
        var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == roles.UPGRADER);
        var builders = _.filter(allCreeps, (creep) => creep.memory.role == roles.BUILDER);
        
        // get all cached rooms. 
        var roomsAvailable = Game.rooms;
        var cachedRooms = [];
        for (var roomName in roomsAvailable) {
            var room = roomsAvailable[roomName];
            if (room.memory.ownedRoom) {
                cachedRooms.push(room)
            }
        }

        // find the total amount of each creep role we can handle
        var totalHarvesterCapacity = 0;
        var totalUpgraderCapacity = 0;
        var totalBuilderCapacity = 1;

        for (var rc in cachedRooms) {
            totalHarvesterCapacity = findNeededHarvesterAmount(cachedRooms[rc]);
        }
        for (var rc in cachedRooms) {
            totalUpgraderCapacity = findNeededUpgraderAmount(cachedRooms[rc]);
        }

        // create each creep role that is needed.
        var harvestersNeeded = totalHarvesterCapacity - harvesters.length;
        if (harvestersNeeded > 0) {
            var harvesterName = creepNames.HARVESTER_NAME + Game.time;
            console.log('Behold A New ' + creepNames.HARVESTER_NAME);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], harvesterName, {memory: {role: roles.HARVESTER}});
        }

        if (upgraders.length < totalUpgraderCapacity) {
            var upgraderName = creepNames.UPGRADER_NAME + Game.time;
            console.log('Behold A New ' + creepNames.UPGRADER_NAME);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], upgraderName, {memory: {role: roles.UPGRADER}})
        }

        if (builders.length < totalBuilderCapacity) {
            var builderName = creepNames.BUILDER_NAME + Game.time;
            console.log('Behold A New ' + creepNames.BUILDER_NAME);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], builderName, {memory: {role: roles.BUILDER}})
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

function findNeededHarvesterAmount(rcId) {
    var currentRoom = rcId;
    var resourcesInRoom = currentRoom.find(FIND_SOURCES);
    
    var totalHarvesters = resourcesInRoom.length * 2;

    return totalHarvesters;
}

function findNeededUpgraderAmount(rcId) {
    var currentRoom = rcId;
    var roomControllerLevel = currentRoom.controller.level;

    return roomControllerLevel;
}

function findSpacesAroundResource(resourcesInRoom) {
    for (var foundSource in resourcesInRoom) {
        var sourcePos = resourcesInRoom[foundSource].pos;

        var lookAreaAroundSource = currentRoom.lookForAtArea(LOOK_TERRAIN, (sourcePos.y - 1), (sourcePos.x - 1), (sourcePos.y + 1), (sourcePos.x + 1), true);
        for (var area in lookAreaAroundSource) {
            const terrainAtArea = lookAreaAroundSource[area].terrain
            switch(terrainAtArea) {
                case 'wall':
                    break;
                case 'lava':
                    break;
                default:
                    totalHarvesters++;
            }
        }
    }
}

module.exports = spawner;