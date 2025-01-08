const SPEC_3 = require('./SPEC-3');

/**
 * Fonction qui affiche les salles et les créneaux où il y a un chevauchement.
 *
 * @param {string} data - Les données des cours
 * @returns {void} Cette fonction ne retourne rien, mais affiche les salles et les créneaux où il y a un chevauchement.
 */
function checkOverlaps(data) {
    // Regroupe les classes par salle
    const classesByRoom = {};

    let overlapsDetected = false;

    // Collecte les classes par salle et vérifie les chevauchements
    data.forEach(course => {
        course.classes.forEach((classe) => {
            if (!classesByRoom[classe.room]) {
                classesByRoom[classe.room] = [];
            }

            // Liste des cours qui se chevauchent avec la classe actuelle
            const overlappingClasses = classesByRoom[classe.room].filter(existingClass =>
                classe.day === existingClass.day &&
                areOverlapping(classe.start, classe.end, existingClass.start, existingClass.end)
            );

            if (overlappingClasses.length > 0) {
                console.log(`Chevauchement détecté dans la salle ${classe.room} pour le créneau ${classe.day} ${classe.start}-${classe.end} :`);
                
                // Afficher tous les cours qui se chevauchent
                overlappingClasses.forEach(overlappingClass => {
                    console.log(`- ${overlappingClass.parentModule} (${overlappingClass.start}-${overlappingClass.end})`);
                });

                // Afficher aussi le cours actuel
                console.log(`- ${course.module} (${classe.start}-${classe.end})`);

                overlapsDetected = true;
            }

            // Ajoute la classe à la liste des classes dans la salle
            classesByRoom[classe.room].push({
                ...classe,
                parentModule: course.module // Ajoute le module parent
            });
        });
    });

    if (!overlapsDetected) {
        console.log("Pas de chevauchement détecté.");
    }
}

/**
 * Fonction qui vérifie si deux horaires de cours se superposent.
 *
 * @param {string, string, string, string} start1, end1, start2, end2 : heures de début et de fin des deux cours
 * @returns {boolean} Renvoie vrai si les deux heures de cours se superposent, et faux sinon
 */
function areOverlapping(start1, end1, start2, end2) {
    const start1Time = SPEC_3.timeToMinutes(start1);
    const end1Time = SPEC_3.timeToMinutes(end1);
    const start2Time = SPEC_3.timeToMinutes(start2);
    const end2Time = SPEC_3.timeToMinutes(end2);

    return start1Time < end2Time && start2Time < end1Time;
}

module.exports = { checkOverlaps };
