var roleHarvester = require("./roles/harvester")

module.exports.loop function() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name]

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep)
        }
    }
};
