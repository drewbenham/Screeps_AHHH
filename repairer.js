var utils = require("./utils");
var roleBuilder = require("./builder");

var roleRepairer = {
    //** param {Creep} creep */
    run: function(creep) {
        if (!creep.memory.targetSourceId) {
            utils.setCreepsTargetSource(creep);
        }

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say("require material");
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say("life is pain");
        }

        if (creep.memory.working) {
            // get all structures that need repair except walls. those will be repaired by
            // the wall repairers since walls have too much health.
            var needsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (struct) => (struct.hits < struct.hitsMax) && (struct.structureType != STRUCTURE_WALL)
            });

            if (needsRepair) {
                if (creep.repair(needsRepair) == ERR_NOT_IN_RANGE) {
                    utils.moveChoices(creep, needsRepair, COLOR_PURPLE);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
        else {
            var sources = Game.getObjectById(creep.memory.targetSourceId)
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, sources, COLOR_RED);
            }
        }
    }
}

module.exports = roleRepairer;