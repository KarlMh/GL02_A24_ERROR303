const SPEC_3 = require('./SPEC-3');
/**
 * Fonction qui affiche les salles et les créneaux où il y a un chevauchement.
 *
 * @param {Array<Object>} data - Les données des cours
 * @returns {void} Cette fonction ne retourne rien, mais affiche les salles et les créneaux où il y a un chevauchement.
 */
function checkOverlaps(data) {
    console.log("Données reçues :", JSON.stringify(data, null, 2));

    const classesByRoom = {};
    let overlapsDetected = false;

    // Collecte des classes par salle
    data.forEach(course => {
        course.classes.forEach((classe) => {
            if (!classesByRoom[classe.room]) {
                classesByRoom[classe.room] = [];
            }

            // Vérification des chevauchements avec les autres classes enregistrées
            for (let existingClass of classesByRoom[classe.room]) {
                if (
                    classe.day === existingClass.day &&
                    areOverlapping(classe.start, classe.end, existingClass.start, existingClass.end)
                ) {
                    console.log(`Chevauchement détecté dans la salle ${classe.room} : (${existingClass.day} ${existingClass.start}-${existingClass.end}) avec (${classe.start}-${classe.end}).`);
                    overlapsDetected = true;

                    // Résolution des conflits : ajustement ou réattribution
                    const resolved = resolveConflict(classe, existingClass, data);

                    if (!resolved) {
                        console.log(`Impossible de résoudre le conflit pour la salle ${classe.room}.`);
                    }
                }
            }

            classesByRoom[classe.room].push(classe);
        });
    });

    if (overlapsDetected) {
        console.log("Mise à jour des données après résolution des conflits...");
        updateDatabase(data);
    } else {
        console.log("Pas de chevauchement détecté.");
    }
}

function areOverlapping(start1, end1, start2, end2) {
    const start1Time = timeToMinutes(start1);
    const end1Time = timeToMinutes(end1);
    const start2Time = timeToMinutes(start2);
    const end2Time = timeToMinutes(end2);

    return start1Time < end2Time && start2Time < end1Time;
}

function resolveConflict(classe1, classe2, data) {
    const availableRooms = findAvailableRooms(classe1.day, classe1.start, classe1.end, data);

    if (availableRooms.length > 0) {
        console.log(`Réassignation de la classe (${classe1.start}-${classe1.end}) à la salle ${availableRooms[0]}.`);
        classe1.room = availableRooms[0];
        return true;
    } else {
        const adjustedTime = adjustClassTime(classe1, classe2);
        if (adjustedTime) {
            console.log(`Ajustement des horaires : (${classe1.start}-${classe1.end}) devient (${adjustedTime.start}-${adjustedTime.end}).`);
            classe1.start = adjustedTime.start;
            classe1.end = adjustedTime.end;
            return true;
        }
    }
    return false;
}

function findAvailableRooms(day, start, end, data) {
    const occupiedRooms = new Set();

    data.forEach(course => {
        course.classes.forEach(classe => {
            if (
                classe.day === day &&
                areOverlapping(classe.start, classe.end, start, end)
            ) {
                occupiedRooms.add(classe.room);
            }
        });
    });

    const allRooms = Array.from(new Set(data.flatMap(course => course.classes.map(classe => classe.room))));

    return allRooms.filter(room => !occupiedRooms.has(room));
}

function adjustClassTime(classe1, classe2) {
    const class1Start = timeToMinutes(classe1.start);
    const class1End = timeToMinutes(classe1.end);
    const class2Start = timeToMinutes(classe2.start);
    const class2End = timeToMinutes(classe2.end);

    if (class1End <= class2Start - 30) {
        return { start: formatTime(class1Start), end: formatTime(class2Start - 30) };
    } else if (class2End + 30 <= class1Start) {
        return { start: formatTime(class2End + 30), end: formatTime(class1End) };
    }
    return null;
}

function updateDatabase(data) {
    // Fonction pour mettre à jour la base de données ou le système
    console.log("Mise à jour des données... (simulation)");
    // Ajoutez ici la logique pour sauvegarder les données dans un fichier ou une base de données
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

module.exports = { checkOverlaps };
