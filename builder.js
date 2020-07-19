

var roleBuilder = {

    //** param {Creep} creep */
    run: function(creep) {
        var isBuilding = Game.getObjectById(creep.memory.building);

        if (isBuilding && creep.store[RESOURCE_ENERGY] == 0) {
            isBuilding = false;
            creep.say("gotta suk");
        }
        if (!isBuilding && creep.store.getFreeCapacity() == 0) {
            isBuilding = true;
            creep.say("build it");
        }

        if (isBuilding) {
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#008000'}});
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
}

module.exports = roleBuilder;