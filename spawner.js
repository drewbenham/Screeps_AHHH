var constants = require('constants')

var spawner = {

    run: function() {
        //get all creeps
        var allCreeps = Game.creeps

        //get creep types
        var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == 'upgrader');
    }
}