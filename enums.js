const roles =  Object.freeze({
    HARVESTER: 'harvester',
    UPGRADER: 'upgrader',
    BUILDER: 'builder'
});

const partCosts = Object.freeze( {
    MOVE: 50,
    WORK: 100,
    CARRY: 50,
    ATTACK: 80,
    RANGED_ATTACK: 150,
    HEAL: 250,
    CLAIM: 600,
    TOUGH: 10
});