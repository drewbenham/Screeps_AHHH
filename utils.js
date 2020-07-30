var enums = require("./enums");

function posCompare(pos1, pos2) {
    if ((pos1.x == pos2.x) && (pos1.y == pos2.y)) {
        return true;
    }
    return false;
}

var utils = {

    findSpacesAroundResource: function(resourceObject, room) {
        var sourcePos = resourceObject.pos;
        var numOfSpaces = 0;

        var lookAreaAroundSource = room.lookForAtArea(LOOK_TERRAIN, (sourcePos.y - 1), (sourcePos.x - 1), (sourcePos.y + 1), (sourcePos.x + 1), true);
        for (var area in lookAreaAroundSource) {
            const terrainAtArea = lookAreaAroundSource[area].terrain
            switch(terrainAtArea) {
                case 'wall':
                    break;
                case 'lava':
                    break;
                default:
                    numOfSpaces++;
            }
        }

        return numOfSpaces;
    },

    setCreepsTargetSource: function(creep) {
        var allSources = creep.room.find(FIND_SOURCES);
        var openSources = _.filter(allSources, (source) => source.memory.currentNumOfWorkers < source.memory.maxWorkers);
        var leastNumOfWorkers = _.min(allSources, (source) => source.memory.currentNumOfWorkers);
        if (openSources.length > 0) {
            creep.memory.targetSourceId = openSources[0].id;
            openSources[0].memory.currentNumOfWorkers++;
        }
        else {
            creep.memory.targetSourceId = leastNumOfWorkers.id;
            leastNumOfWorkers.memory.currentNumOfWorkers++;
        }
    },

    moveChoices: function(creep, target, pathColor) {
        const NUM_OF_MOVEMENTS = 2;

        if (!creep.memory.lastPos) {
            creep.memory.lastPos = creep.pos;
        }

        if ((posCompare(creep.pos, creep.memory.lastPos)) && (creep.fatigue == 0)) {
            creep.memory.ticksNotMoved++;
            if (creep.memory.ticksNotMoved == NUM_OF_MOVEMENTS) {
                var direction = Math.floor(Math.random() * (8 - 1) + 1);
                creep.move(direction);
                creep.memory.lastPos = creep.pos;
                creep.memory.ticksNotMoved = 0;
            }
        }
        else {
            if (creep.fatigue == 0) {
                creep.memory.lastPos = creep.pos;
                creep.moveTo(target, {reusePath: 50, visualizePathStyle: {stroke: pathColor}});
                creep.memory.ticksNotMoved = 0;
            }
        }
    },

    //TODO: write another move function that moves by path.

    cleanUpMemory: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                // get the creep from memory
                var creepToClean = Memory.creeps[name];
                //get the creeps source
                if (creepToClean.targetSourceId) {
                    var creepsSource = Game.getObjectById(creepToClean.targetSourceId);
                    //decrement the num of worker counter.
                    creepsSource.memory.currentNumOfWorkers--;
                }

                delete Memory.creeps[name];
            }
        }
    }
}

module.exports = utils;