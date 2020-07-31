
module.exports = function() {
    StructureSpawn.prototype.createBestCreep = 
        function(energy, roleName) {
            console.log("Finding best creep")
            var totalEnergy = energy;
            var body = [];
            var name = undefined;

            if (roleName == roles.MINER) {
                let workRatio = 0.84;
                let moveRatio = 0.16;

                name = getRoleName(roleName);
                body = findNumOfParts(totalEnergy, workRatio, moveRatio);
            }
            else if (roleName == roles.HARVESTER) {
                let workRatio = 0.38;
                let moveRatio = 0.31;
                let carryRatio = 0.31;
                
                name = getRoleName(roleName);
                body = findNumOfParts(totalEnergy, workRatio, moveRatio, carryRatio);
            }
            else if (roleName == roles.BUILDER) {
                let workRatio = 0.28;
                let moveRatio = 0.28;
                let carryRatio = 0.44;

                name = getRoleName(roleName);
                body = findNumOfParts(totalEnergy, workRatio, moveRatio, carryRatio);
            }
            else if (roleName == roles.REPAIRER) {
                let workRatio = 0.2;
                let moveRatio = 0.33;
                let carryRatio = 0.47;

                name = getRoleName(roleName);
                body = findNumOfParts(totalEnergy, workRatio, moveRatio, carryRatio);
            }
            else if (roleName == roles.WALL_REPAIRER) {
                let workRatio = 0.2;
                let moveRatio = 0.33;
                let carryRatio = 0.47;

                name = getRoleName(roleName);
                body = findNumOfParts(totalEnergy, workRatio, moveRatio, carryRatio);
            }
            else if (roleName == roles.UPGRADER) {
                let workRatio = 0.33;
                let moveRatio = 0.22;
                let carryRatio = 0.45;

                name = getRoleName(roleName);
                body = findNumOfParts(totalEnergy, workRatio, moveRatio, carryRatio);
            }

            return this.spawnCreep(body, name, {memory: {role: roleName, ticksNotMoved: 0,  working: true}});
        };
};

function findNumOfParts(totalEnergy, workR = 0, moveR = 0, carryR = 0, attackR = 0, rangedR = 0, healR = 0, claimR = 0, toughR = 0) {
    var numOfWorkParts = Math.floor((workR * totalEnergy) / BODYPART_COST[WORK]);
    var numOfMoveParts = Math.floor((moveR * totalEnergy) / BODYPART_COST[MOVE]);
    var numOfCarryParts = Math.floor((carryR * totalEnergy) / BODYPART_COST[CARRY]);
    var numOfAttackParts = Math.floor((attackR * totalEnergy) / BODYPART_COST[ATTACK]);
    var numOfRangedParts = Math.floor((rangedR * totalEnergy) / BODYPART_COST[RANGED_ATTACK]);
    var numOfHealParts = Math.floor((healR * totalEnergy) / BODYPART_COST[HEAL]);
    var numOfClaimParts = Math.floor((claimR * totalEnergy) / BODYPART_COST[CLAIM]);
    var numOfToughParts = Math.floor((toughR * totalEnergy) / BODYPART_COST[TOUGH]);

    return fillBodyParts(numOfWorkParts, numOfMoveParts, numOfCarryParts, numOfAttackParts, 
        numOfRangedParts, numOfHealParts, numOfClaimParts, numOfToughParts);
}

function fillBodyParts(workNum = 0, moveNum = 0, carryNum = 0, attackNum = 0, rangedNum = 0, healNum = 0, claimNum = 0, toughNum = 0) {
    var bodyParts = [];

    for (var i = 0; i < workNum; i++) {
        bodyParts.push(WORK);
    }
    for (var i = 0; i < moveNum; i++) {
        bodyParts.push(MOVE);
    }
    for (var i = 0; i < carryNum; i++) {
        bodyParts.push(CARRY);
    }
    for (var i = 0; i < attackNum; i++) {
        bodyParts.push(ATTACK);
    }
    for (var i = 0; i < rangedNum; i++) {
        bodyParts.push(RANGED_ATTACK);
    }
    for (var i = 0; i < healNum; i++) {
        bodyParts.push(HEAL);
    }
    for (var i = 0; i < claimNum; i++) {
        bodyParts.push(CLAIM);
    }
    for (var i = 0; i < toughNum; i++) {
        bodyParts.push(TOUGH);
    }
    console.log(bodyParts);
    return bodyParts;
}

function getRoleName(role) {
    var roleName = undefined;
    if (role == roles.HARVESTER) {
        roleName = creepNames.HARVESTER_NAME;
    }
    else if (role == roles.UPGRADER) {
        roleName = creepNames.UPGRADER_NAME;
    }
    else if (role == roles.BUILDER) {
        roleName = creepNames.BUILDER_NAME;
    }
    else if (role == roles.REPAIRER) {
        roleName = creepNames.REPAIRER_NAME;
    }
    else if (role == roles.WALL_REPAIRER) {
        roleName = creepNames.WALL_REPAIRER_NAME;
    }
    return roleName + Game.time;
}

