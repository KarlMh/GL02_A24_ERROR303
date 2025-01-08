const DataMain = require('./main.js');
const data = DataMain.structuredData;

// Fonctions existantes
function verifSalle(data, salle) {
    return data.some(module => 
        module.classes.some(classEntry => classEntry.room === salle)
    );
}

function MaxCapacity(data, salle){
    let maxCapacite = 0;
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (classEntry.room === salle && classEntry.capacity > maxCapacite) {
                maxCapacite = classEntry.capacity;
            }
        }
    }
    return maxCapacite;
}

function printedMaxCapacity(data, salle) {
    salle = salle.toUpperCase();
    if (!verifSalle(data, salle)){
        console.log("Erreur : la salle n'existe pas dans la base de données.");
        return;
    }
    console.log(`La capacité maximale de la salle ${salle} est : ${MaxCapacity(data, salle)}`);
}

// Nouvelle fonction pour le filtrage par capacité
function getRoomsByMinCapacity(minCapacity) {
    if (minCapacity < 0) {
        console.log("Erreur : La capacité minimale doit être un nombre positif");
        return [];
    }

    // Map pour stocker la capacité max de chaque salle
    const roomCapacities = new Map();

    // Parcours des données pour trouver la capacité maximale de chaque salle
    for (const course of data) {
        for (const classEntry of course.classes) {
            const currentMax = roomCapacities.get(classEntry.room) || 0;
            if (classEntry.capacity > currentMax) {
                roomCapacities.set(classEntry.room, classEntry.capacity);
            }
        }
    }

    // Filtrer et trier les salles
    const filteredRooms = Array.from(roomCapacities.entries())
        .filter(([_, capacity]) => capacity >= minCapacity)
        .sort((a, b) => a[1] - b[1])
        .map(([room, capacity]) => ({ room, capacity }));

    return filteredRooms;
}

module.exports = {
    verifSalle,
    printedMaxCapacity,
    MaxCapacity,
    getRoomsByMinCapacity
};