/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder');
 * mod.thing == 'a thing'; // true
 */
var utils = require("./utils");
var enums = require("./enums");

var roleBuilder = {

    //** param {Creep} creep */
    run: function(creep) {
        if (!creep.memory.targetSourceId) {
            utils.setCreepsTargetSource(creep);
        }

        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say("gotta suk");
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
            creep.say("build it");
        }

        if (creep.memory.working) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    utils.moveChoices(creep, targets[0], coolColors.GREEN);
                }
            }
        }
        else {
            var sources = Game.getObjectById(creep.memory.targetSourceId)
            if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                utils.moveChoices(creep, sources, coolColors.ORANGE);
            }
        }
    }
}

module.exports = roleBuilder;