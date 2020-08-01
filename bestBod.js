

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
        //totalCostNeeded is the total cost of the ideal ratio of parts.
        let totalCostNeeded = 0;
        //go through each body part
        for (let bodyPart in creepOptions.body) {
            //get the word for the part since js is dumb and
            //for some reason "work" is the same as the constant
            //used for WORK.
            let part = bodyPart.toLowerCase();
            for (let i = 0; i < creepOptions.body[bodyPart]; i++) {
                //sum up the cost.
                totalCostNeeded += BODYPART_COST[part];
            }
        }

        //go through the parts again. 
        //TODO: (maybe i can put this in the other loop)?
        for (let bodyPart in creepOptions.body) {
            let part = bodyPart.toLowerCase();
            //number of parts needed for the ratio
            let numOfPart = creepOptions.body[bodyPart];
            //get the total cost of that part for the whole.
            let costRatio = numOfPart * BODYPART_COST[part];
            //get the cost percentage of the whole for that part.
            let partRatio = costRatio / totalCostNeeded;

            //get the number of part ratio for that part.
            let optimalParts = Math.floor((partRatio * energy) / BODYPART_COST[part]);
            // make sure we add at least one of each part.
            if (optimalParts < 1) optimalParts = 1;
            for (let i = 0; i < optimalParts; i++) {
                body.push(part);
            }
        }
    } 
    console.log(body);
    return body;
}

