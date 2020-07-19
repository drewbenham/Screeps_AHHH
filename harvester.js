//const { runInContext } = require("lodash")
var roleUpgrader = require("./upgrader")

var roleHarvester = {

    //**@param {Creep} creep */
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var source = creep.room.find(FIND_SOURCES);
            if (creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source[0], {visualizePathStyle: {stroke: '#008000'}});
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
                    creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else {
                roleUpgrader.run(creep)
            }
        }
    }
};

module.exports = roleHarvester;