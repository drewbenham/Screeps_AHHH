var towerStruct = {

    //**param {StructureTower} towerStruct */
    run: function(tower) {
        // get the lowest health structure
        //TODO: only repair close by
        // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // });
        // get any hostile creeps.
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (closestHostile) {
            tower.attack(closestHostile);
        }

        // heal the closest damaged struct
        // if (closestDamagedStructure) {
        //     tower.repair(closestDamagedStructure);
        // }
    }
}

module.exports = towerStruct;