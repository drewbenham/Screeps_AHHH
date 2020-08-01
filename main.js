var roleHarvester = require("./harvester");
var roleUpgrader = require("./upgrader");
var roleBuilder = require("./builder");
var roleRepairer = require("./repairer");
var roleWallRepairer = require("./wallRepairer");

var spawner = require("./spawner");
var towerStruct = require("./tower");

var enums = require("./enums");
var utils = require("./utils");
var persistentMemory = require("./setupPersistentMemory");

Object.defineProperty(Source.prototype, 'memory', {
    get: function() {
        if(_.isUndefined(this.room.memory.sources)) {
            this.room.memory.sources = {};
        }
        if (!_.isObject(this.room.memory.sources)) {
            return undefined;
        }
        return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {};
    },
    set: function(value) {
        if (_.isUndefined(this.room.memory.sources)) {
            Memory.sources = {};
        }
        if (!_.isObject(this.room.memory.sources)) {
            throw new Error('Could not set source memory');
        }
        this.room.memory.sources[this.id] = value;
    }
})

//get an array of my rooms.
persistentMemory.setOwnedRooms();
//set num of workers that can work at each source.
persistentMemory.setWorkersPerSource();
Memory.checkSpawnQueue = true;

module.exports.loop = function() {
    // remove dead creeps and handle their memory.
    utils.cleanUpMemory();

    spawner.run();
    
    // run tower roles.
    var towers = _.filter(Game.structures, struct => struct.structureType == STRUCTURE_TOWER);
    for (var tower in towers) {
        var currentTower = towers[tower];
        towerStruct.run(currentTower);
    }
    
    // run creep roles
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var creepRole = creep.memory.role;

        if (creepRole == roles.HARVESTER) {
            roleHarvester.run(creep);
        }
        if (creepRole == roles.UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creepRole == roles.BUILDER) {
            roleBuilder.run(creep);
        }
        if (creepRole == roles.REPAIRER) {
            roleRepairer.run(creep);
        }
        if (creepRole == roles.WALL_REPAIRER) {
            roleWallRepairer.run(creep);
        }
    }
};
