var roleHarvester = require("./harvester")
var spawner = require("./spawner");

module.exports.loop = function() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    console.log(creepNames.HARVESTER_NAME)

    spawner.run();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == roles.HARVESTER) {
            roleHarvester.run(creep);
        }
    }
};
