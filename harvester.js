//const { runInContext } = require("lodash")
var roleUpgrader = require("./upgrader")
var utils = require("./utils");

var roleHarvester = {

    //**@param {Creep} creep */
    run: function(creep) {
        if (!creep.memory.targetSourceId) {
            utils.setCreepsTargetSource(creep);
        }

        if (creep.store.getFreeCapacity() > 0) {
            var source = Game.getObjectById(creep.memory.targetSourceId)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, source, COLOR_RED);
            }
        }

        else {
            var target = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target.length > 0) {
                if (creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    utils.moveChoices(creep, target[0], COLOR_GREEN);
                }
            }
            else {
                roleUpgrader.run(creep)
            }
        }
    }
};

module.exports = roleHarvester;