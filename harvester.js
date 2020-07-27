//const { runInContext } = require("lodash")
var roleUpgrader = require("./upgrader")
var utils = require("./utils");

var roleHarvester = {

    //**@param {Creep} creep */
    run: function(creep) {
        if (!creep.memory.targetSourceId) {
            utils.setCreepsTargetSource(creep);
        }

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (!target) {
            roleUpgrader.run(creep);
        }

        if ((creep.store.getFreeCapacity() > 0) && target) {
            var source = Game.getObjectById(creep.memory.targetSourceId)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, source, COLOR_RED);
            }
        }

        else {
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    utils.moveChoices(creep, target, COLOR_GREEN);
                }
            }
        }
    }
};

module.exports = roleHarvester;