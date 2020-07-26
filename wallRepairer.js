const utils = require("./utils");
var roleRepairer = require("./repairer");

var roleWallRepairer = {
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
            // get just the walls to repair.
            var walls = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType == STRUCTURE_WALL)
            });

            var lowestHealthWalls = undefined;

            // find the wall that has the least amout of health.
            for (let percentage = 0.001; percentage <= 1; percentage += 0.001) {
                lowestHealthWall = creep.pos.findClosestByPath(walls, {
                    filter: (wall) => wall.hits / wall.hitsMax < percentage
                });
                if (lowestHealthWalls) {
                    break;
                }
            }

            if (lowestHealthWall) {
                if (creep.repair(lowestHealthWall) == ERR_NOT_IN_RANGE) {
                    utils.moveChoices(creep, lowestHealthWall, COLOR_YELLOW);
                }
            }
            
            else {
                roleRepairer.run(creep);
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

module.exports = roleWallRepairer;