var utils = require("./utils");

var roleUpgrader = {
    
    //** param {Creep} creep*/
    run: function(creep) {
        if (!creep.memory.targetSourceId) {
            utils.setCreepsTargetSource(creep);
        }

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say("gotta suk")
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say("now to fuk")
        }
        if (creep.memory.upgrading) {
            var roomController = creep.room.controller;
            if (creep.upgradeController(roomController) == ERR_NOT_IN_RANGE) {
                creep.moveTo(roomController, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        else {
            var source = creep.room.find(FIND_SOURCES);
            if (creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source[0], {visualizePathStyle: {stroke: '#008000'}});
            }
        }
    }
};

module.exports = roleUpgrader;