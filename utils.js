var enums = require("./enums");

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
        var openSources = creep.room.find(FIND_SOURCES, {
            filter: function(source) {
                return source.memory.currentNumOfWorkers < source.memory.maxWorkers;
            }
        });
        if (openSources.length > 0) {
            creep.memory.targetSourceId = openSources[0].id;
            openSources[0].memory.currentNumOfWorkers++;
        }
    },

    moveChoices: function(creep, target, pathColor) {
        if (creep.pos == creep.memory.lastPos) {
            creep.memory.numOfNotMoved++;
            if (creep.memory.numOfNotMoved == movement.NUM_OF_MOVEMENTS) {
                var direction = Math.random() * (8 - 1) + 1;
                creep.move(direction);
                creep.memory.numOfNotMoved = 0;
            }
            else {
                creep.moveTo(target, {reusePath: 50, visualizePathStyle: {stroke: pathColor}})
                creep.memory.lastPos = creep.pos;
                creep.memory.numOfNotMoved = 0;
            }
        }
    }
}

module.exports = utils;