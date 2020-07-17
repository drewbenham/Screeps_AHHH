

var spawner = {

    run: function() {
        //get all creeps
        var allCreeps = Game.creeps

        //get creep types
        var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == roles.HARVESTER);
        var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == roles.UPGRADER);
        var builders = _.filter(allCreeps, (creep) => creep.memory.role == roles.BUILDER);
        
        cachedRooms = []
        if (Memory.ownedRooms) {
            cachedRooms = Memory.ownedRooms;
        } 
        else {
            cachedRooms = getOwnedRooms();
        }

        var totalHarvesterCapacity = 0;

        for (var rc in ownedRooms) {
            totalHarvesterCapacity = findNeededHarvesterAmount(ownedRooms[rc]);
        }

        var harvestersNeeded = totalHarvesterCapacity - harvesters.length;
        if (harvestersNeeded > 0) {
            var harvesterName = creepNames.HARVESTER_NAME + Game.time;
            console.log('Behold A New ' + creepNames.HARVESTER_NAME);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], harvesterName, {memory: {role: roles.HARVESTER}});
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

function getOwnedRooms() {
    var availableRooms = Game.rooms;
    var ownedRooms = [];
    
    for (var seenRoom in availableRooms) {
        if (availableRooms[seenRoom].controller.my) {
            ownedRooms.push(availableRooms[seenRoom]);
        }
    }

    Memory.ownedRooms = ownedRooms;
    return ownedRooms;
}

function findNeededHarvesterAmount(rcId) {
    var currentRoom = rcId;
    var resourcesInRoom = currentRoom.find(FIND_SOURCES);
    
    var totalHarvesters = resourcesInRoom.length * 2;

    return totalHarvesters;
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