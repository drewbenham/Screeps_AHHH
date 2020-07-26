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
                utils.moveChoices(creep, roomController, COLOR_RED);
            }
        }
        else {
            var source = Game.getObjectById(creep.memory.targetSourceId)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, source, COLOR_RED);
            }
        }
    }
};

module.exports = roleUpgrader;