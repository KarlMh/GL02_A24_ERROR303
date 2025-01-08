const SPEC_3 = require('./SPEC-3');
/**
 * Fonction qui affiche les salles libres à un créneau donné
 * Exemple de donnée : "L", "10:00", "12:00"
 *
 * @param {string} day le jour où on veut le créneau
 * @param {string} startTime l'heure de début du créneau
 * @param {string} endTime l'heure de fin du créneau
 * @returns {void} Cette fonction ne retourne rien, mais affiche les salles libre au créneau voulu.
 */
function findFreeRooms(day, startTime, endTime) {
    // Collecte toutes les salles de tous les cours

    day = day.toUpperCase();

    const allRooms = new Set();
    data.forEach(course => {
        course.classes.forEach(classe => {
            allRooms.add(classe.room); // Ajoute les salles uniques
        });
    });

    // Convertir les heures demandées en minutes
    const reqStartTime = SPEC_3.timeToMinutes(startTime);
    const reqEndTime = SPEC_3.timeToMinutes(endTime);

    // Trouver les salles occupées pour le créneau horaire spécifié
    const occupiedRooms = new Set();
    data.forEach(course => {
        course.classes.forEach(classe => {
            // Vérifier si la classe a lieu le jour spécifié
            if (classe.day !== day) return;

            // Convertir les horaires de la classe en minutes
            const classStartTime = SPEC_3.timeToMinutes(classe.start);
            const classEndTime = SPEC_3.timeToMinutes(classe.end);

            // Vérifier si les horaires se chevauchent
            const isOverlapping = (reqStartTime < classEndTime && reqEndTime > classStartTime);

            if (isOverlapping) {
                occupiedRooms.add(classe.room);
            }
        });
    });

    // Trouver les salles libres en soustrayant les salles occupées des salles totales
    const freeRooms = [...allRooms].filter(room => !occupiedRooms.has(room));

    // Afficher les résultats
    console.log(`Salles libres ${day} entre ${startTime} et ${endTime} :`);
    if (freeRooms.length === 0) {
        console.log('  Pas de salles libres à ce créneau.');
    } else {
        freeRooms.forEach(room => {
            console.log(`  ${room}`);
        });
    }

    return freeRooms;
}

module.exports = {findFreeRooms};
