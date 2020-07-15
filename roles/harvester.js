const { runInContext } = require("lodash")
var upgrader = require("./upgrader")

module.exports.loop function() {

    //**@param {Creep} creep */
    run: function(creep) {
        if (creep.getFreeCapacity() > 0) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#008000'}});
            }
        }

        else {
            var target = creep.pos.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN || 
                        structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.getFreeCapacity > 0
                }
            });
            if (target.length > 0) {
                if (creep.transfer(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else {
                roleUpgrader.run(creep)
            }
        }
    }
};