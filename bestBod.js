

module.exports = function() {
    StructureSpawn.prototype.createBestCreep = 
        function(energy, creepOptions) {
            console.log("Finding best creep")
            var body = calculateCreep(energy, creepOptions);
            var name = creepOptions.name + Game.time;
            return this.spawnCreep(body, name, {memory: creepOptions.memory});
        };
};

function calculateCreep(energy, creepOptions) {
    var maxEnergy = energy;
    let maxBodyParts = 50;
    let body = [];
    // Change this to an option for ideal or not.
    if (creepOptions.ideal) {
        for (let bodyPart in creepOptions.body) {
            let part = bodyPart.toLowerCase();
            if (BODYPART_COST[part] > maxEnergy || maxBodyParts === 0) {
                break;
            }

            for (let i = 0; i < creepOptions.body[bodyPart]; i++) {
                if (BODYPART_COST[part] > maxEnergy || maxBodyParts === 0) {
                    maxEnergy = 0;
                    break;
                }
                //add the part to the list.
                body.push(part);
                //decrement the maxEnergy allowed for next iteration;
                maxEnergy -= BODYPART_COST[part];
                //decrement the maxBodyPart limit
                maxBodyParts--;
            }
        }
    } 
    // find the best ratio for creep type. 
    else {
        //ratio cost will tell us how much each iteration of the ratio will cost
        let ratioCost = 0;
        for (let bodyPart in creepOptions.body) {
            let part = bodyPart.toLowerCase();
            for (let i = 0; i < creepOptions.body[bodyPart]; i++) {
                ratioCost += BODYPART_COST[part];
            }
        }

        //find the max amount of each part using ratio cost.
        let maxUnits = Math.min((maxEnergy / ratioCost), 50 / _.sum(creepOptions.body), Math.floor(maxBodyParts / _.sum(creepOptions.body)));
        for (let bodyPart in creepOptions.body) {
            let part = bodyPart.toLowerCase();
            for (let i = 0; i < (maxUnits * creepOptions.body[bodyPart]); i++) {
                if (BODYPART_COST[part] > maxEnergy) break;
                body.push(part);
                maxEnergy -= BODYPART_COST[part];
            }
        }
    } 
    return body;
}

