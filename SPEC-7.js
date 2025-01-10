const SPEC_3 = require('./SPEC-3');

/**
 * Fonction qui affiche les salles et les créneaux où il y a un chevauchement.
 *
 * @param {Array<Object>} data - Les données des cours, chaque cours ayant des classes avec des horaires, salles, et jours.
 * @returns {void} Cette fonction ne retourne rien, mais affiche les salles et les créneaux où il y a un chevauchement.
 */
function checkOverlaps(data) {
    console.log("Données reçues :", JSON.stringify(data, null, 2)); // Affiche les données reçues pour diagnostic

    const classesByRoom = {}; // Stocke les classes regroupées par salle
    let overlapsDetected = false; // Indique si des chevauchements ont été détectés

    // Parcourt les cours et leurs classes pour regrouper par salle
    data.forEach(course => {
        course.classes.forEach((classe) => {
            if (!classesByRoom[classe.room]) {
                classesByRoom[classe.room] = []; // Initialise la liste des classes pour cette salle si elle n'existe pas
            }

            // Vérifie les chevauchements avec les classes déjà enregistrées dans la même salle
            for (let existingClass of classesByRoom[classe.room]) {
                if (
                    classe.day === existingClass.day &&
                    areOverlapping(classe.start, classe.end, existingClass.start, existingClass.end)
                ) {
                    console.log(`Chevauchement détecté dans la salle ${classe.room} : (${existingClass.day} ${existingClass.start}-${existingClass.end}) avec (${classe.start}-${classe.end}).`);
                    overlapsDetected = true;

                    // Tente de résoudre le conflit détecté
                    const resolved = resolveConflict(classe, existingClass, data);

                    if (!resolved) {
                        console.log(`Impossible de résoudre le conflit pour la salle ${classe.room}.`);
                    }
                }
            }

            classesByRoom[classe.room].push(classe); // Ajoute la classe actuelle dans la liste pour cette salle
        });
    });

    if (overlapsDetected) {
        console.log("Mise à jour des données après résolution des conflits...");
        updateDatabase(data); // Simule la mise à jour de la base de données
    } else {
        console.log("Pas de chevauchement détecté.");
    }
}

/**
 * Vérifie si deux intervalles horaires se chevauchent.
 *
 * @param {string} start1 - Heure de début de la première classe (format HH:MM).
 * @param {string} end1 - Heure de fin de la première classe (format HH:MM).
 * @param {string} start2 - Heure de début de la deuxième classe (format HH:MM).
 * @param {string} end2 - Heure de fin de la deuxième classe (format HH:MM).
 * @returns {boolean} Retourne vrai si les deux horaires se chevauchent, faux sinon.
 */
function areOverlapping(start1, end1, start2, end2) {
    const start1Time = timeToMinutes(start1);
    const end1Time = timeToMinutes(end1);
    const start2Time = timeToMinutes(start2);
    const end2Time = timeToMinutes(end2);

    return start1Time < end2Time && start2Time < end1Time;
}

/**
 * Tente de résoudre un conflit entre deux classes soit en réassignant une autre salle, soit en ajustant les horaires.
 *
 * @param {Object} classe1 - Première classe en conflit.
 * @param {Object} classe2 - Deuxième classe en conflit.
 * @param {Array<Object>} data - Les données des cours.
 * @returns {boolean} Retourne vrai si le conflit a été résolu, faux sinon.
 */
function resolveConflict(classe1, classe2, data) {
    const availableRooms = findAvailableRooms(classe1.day, classe1.start, classe1.end, data);

    // Réassignation de la salle si possible
    if (availableRooms.length > 0) {
        console.log(`Réassignation de la classe (${classe1.start}-${classe1.end}) à la salle ${availableRooms[0]}.`);
        classe1.room = availableRooms[0];
        return true;
    } else {
        // Ajustement des horaires si aucune salle n'est disponible
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

/**
 * Trouve les salles disponibles pendant une plage horaire donnée.
 *
 * @param {string} day - Jour de la classe (ex : L, MA, ME).
 * @param {string} start - Heure de début (format HH:MM).
 * @param {string} end - Heure de fin (format HH:MM).
 * @param {Array<Object>} data - Les données des cours.
 * @returns {Array<string>} Retourne une liste des salles disponibles.
 */
function findAvailableRooms(day, start, end, data) {
    const occupiedRooms = new Set();

    // Parcourt les cours pour identifier les salles occupées
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

/**
 * Ajuste les horaires d'une classe pour éviter les chevauchements, tout en respectant la plage horaire 08:00-20:00.
 *
 * @param {Object} classe1 - Première classe à ajuster.
 * @param {Object} classe2 - Deuxième classe en conflit.
 * @returns {Object|null} Retourne un nouvel horaire { start, end } ou null si aucun ajustement n'est possible.
 */
function adjustClassTime(classe1, classe2) {
    const class1Start = Math.max(timeToMinutes(classe1.start), 480); // Minimum 08:00
    const class1End = Math.min(timeToMinutes(classe1.end), 1200); // Maximum 20:00
    const class2Start = timeToMinutes(classe2.start);
    const class2End = timeToMinutes(classe2.end);

    if (class1End <= class2Start - 30) {
        return { start: formatTime(class1Start), end: formatTime(class2Start - 30) };
    } else if (class2End + 30 <= class1Start) {
        return { start: formatTime(class2End + 30), end: formatTime(class1End) };
    }
    return null;
}

/**
 * Met à jour la base de données ou le système avec les nouvelles données corrigées.
 *
 * @param {Array<Object>} data - Les données mises à jour.
 * @returns {void}
 */
function updateDatabase(data) {
    console.log("Mise à jour des données... (simulation)");
    // Ajouter ici la logique réelle pour sauvegarder les données mises à jour
}

/**
 * Convertit une heure au format HH:MM en minutes depuis minuit.
 *
 * @param {string} time - Heure au format HH:MM.
 * @returns {number} Minutes depuis minuit.
 */
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Convertit des minutes depuis minuit en format HH:MM.
 *
 * @param {number} minutes - Minutes depuis minuit.
 * @returns {string} Heure au format HH:MM.
 */
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

module.exports = { checkOverlaps };
