var roleUpgrader = {
    
    //** param {Creep} creep*/
    run: function(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say(":eggplant gotta suk")
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say(":hundred-points now i can fuk")
        }
        if (creep.memory.upgrading) {
            var controller = creep.room.roomController
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#008000'}});
            }
        }
    }
};

module.exports = roleUpgrader;