var utils = require("./utils");
var enums = require("./enums");

var roleUpgrader = {
    
    //** param {Creep} creep*/
    run: function(creep) {
        if (!creep.memory.targetSourceId) {
            utils.setCreepsTargetSource(creep);
        }

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say("gotta suk")
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say("now to fuk")
        }
        if (creep.memory.working) {
            var roomController = creep.room.controller;
            if (creep.upgradeController(roomController) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, roomController, coolColors.ORANGE);
            }
        }
        else {
            var source = Game.getObjectById(creep.memory.targetSourceId)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, source, coolColors.GREEN);
            }
        }
    }
};

module.exports = roleUpgrader;