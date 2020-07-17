

var spawner = {

    run: function() {
        //get all creeps
        var allCreeps = Game.creeps

        //get creep types
        var harvesters = _.filter(allCreeps, (creep) => creep.memory.role == roles.HARVESTER);
        var upgraders = _.filter(allCreeps, (creep) => creep.memory.role == roles.UPGRADER);

        /*
        get all creep types
        determine how many you need total:
            -- harvesters = # of spaces around resources?
            -- upgraders = RCL * 2 maybe
            -- builders = # of structures / # rounded up

        determine highest priority of out of creep type and how many needed
        get what type of creep to be created:
            -- get the amount of resources available.
                --based on #of resources and creep type select modules needed (strategy pattern)
        build creep;
        */
    }
}