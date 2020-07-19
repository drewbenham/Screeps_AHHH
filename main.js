var roleHarvester = require("./harvester");
var roleUpgrader = require("./upgrader");
var roleBuilder = require("./builder");

var spawner = require("./spawner");
var enums = require("./enums");

// set all my rooms so i can use them later.
var isNewRooms = true;
function setOwnedRooms() {
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        if (!room.memory.ownedRoom) {
            room.memory.ownedRoom = {};
        }
        if (room.controller.my) {
            room.memory.ownedRoom = true;
        }
    }
    isNewRooms = false;
}

module.exports.loop = function() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // set memory for owned rooms.
    if (isNewRooms) {
        setOwnedRooms();
    }

    spawner.run();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        var creepRole = Game.getObjectById(creep.memory.role);

        if (creepRole == roles.HARVESTER) {
            roleHarvester.run(creep);
        }
        if (creepRole == roles.UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creepRole == roles.BUILDER) {
            roleBuilder.run(creep);
        }
    }
};
