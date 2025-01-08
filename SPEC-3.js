/**
 * Fonction qui affiche les horaires libres pour une salle
 * Exemple de donnée : "D105"
 *
 * @param {string} salle - La salle dont on veut afficher les horaires libres.
 * @returns {void} Cette fonction ne retourne rien, mais affiche les horaires libres de la salle.
 */
// function findFreeSlotsByRoom(specificRoom) {
//     // Gère le cas où l'utilisateur met des minuscules
//     specificRoom = specificRoom.toUpperCase();
//     // Récupérer toutes les classes pour la salle spécifique
//     const roomClasses = data.flatMap(module =>
//         module.classes.filter(classe => classe.room === specificRoom)
//     );

//     if (roomClasses.length === 0) {
//         console.log(`Pas de classe trouvée pour la salle ${specificRoom}.`);
//         return;
//     }

//     // Regroupement des cours par jour
//     const daySchedule = roomClasses.reduce((acc, classe) => {
//         if (!acc[classe.day]) acc[classe.day] = [];
//         acc[classe.day].push({ start: classe.start, end: classe.end });
//         return acc;
//     }, {});

//     // Fonction pour trouver les créneaux libres pour un jour donné
//     function findFreeSlots(dayClasses) {
//         const sortedClasses = dayClasses
//             .map(classe => ({
//                 start: timeToMinutes(classe.start),
//                 end: timeToMinutes(classe.end)
//             }))
//             .sort((a, b) => a.start - b.start);

//         const dayStart = timeToMinutes('08:00');
//         const dayEnd = timeToMinutes('20:00');
//         let currentTime = dayStart;
//         const freeSlots = [];

//         sortedClasses.forEach(({ start, end }) => {
//             if (currentTime < start) {
//                 freeSlots.push({ start: formatTime(currentTime), end: formatTime(start) });
//             }
//             currentTime = Math.max(currentTime, end);
//         });

//         if (currentTime < dayEnd) {
//             freeSlots.push({ start: formatTime(currentTime), end: formatTime(dayEnd) });
//         }

//         return freeSlots;
//     }
//     // Affichage des créneaux libres pour chaque jour

//     const dayChanging = {
//         L: "Lundi",
//         MA: "Mardi",
//         ME: "Mercredi",
//         J: "Jeudi",
//         V: "Vendredi",
//         S: "Samedi"
//     };

//     console.log(`Créneaux libres pour la salle : ${specificRoom}`);
//     Object.keys(dayChanging).forEach(dayKey => {
//         const dayName = dayChanging[dayKey];
//         console.log(`  Jour: ${dayName}`);
//         const dayClasses = daySchedule[dayKey] || [];
//         if (dayClasses.length === 0) {
//             console.log(`    Toute la journée est libre: 08:00 - 20:00`);
//         } else {
//             const freeSlots = findFreeSlots(dayClasses);
//             if (freeSlots.length === 0) {
//                 console.log('    Pas de créneaux libres');
//             } else {
//                 freeSlots.forEach(slot => {
//                     console.log(`    Libre: ${slot.start} - ${slot.end}`);
//                 });
//             }
//         }
//     });
// }

// Fonction pour trouver les créneaux libres pour un jour donné
// NOTE : Cette fonction est nécessaire pour que SPEC 3 fonctionne correctement.
// Pour l'utiliser, décommentez-la.
/*
function findFreeSlots(dayClasses) {
    const sortedClasses = dayClasses
        .map(classe => ({
            start: timeToMinutes(classe.start),
            end: timeToMinutes(classe.end)
        }))
        .sort((a, b) => a.start - b.start);

    const dayStart = timeToMinutes('08:00');
    const dayEnd = timeToMinutes('20:00');
    let currentTime = dayStart;
    const freeSlots = [];

    sortedClasses.forEach(({ start, end }) => {
        if (currentTime < start) {
            freeSlots.push({ start: formatTime(currentTime), end: formatTime(start) });
        }
        currentTime = Math.max(currentTime, end);
    });

    if (currentTime < dayEnd) {
        freeSlots.push({ start: formatTime(currentTime), end: formatTime(dayEnd) });
    }

    return freeSlots;
}
*/

function findFreeSlotsByRoom(specificRoom) {
    specificRoom = specificRoom.toUpperCase();

    const roomClasses = data.flatMap(module =>
        module.classes.filter(classe => classe.room === specificRoom)
    );

    if (roomClasses.length === 0) {
        console.log(`Pas de classe trouvée pour la salle ${specificRoom}.`);
        return;
    }

    const daySchedule = roomClasses.reduce((acc, classe) => {
        if (!acc[classe.day]) acc[classe.day] = [];
        acc[classe.day].push({ start: classe.start, end: classe.end });
        return acc;
    }, {});

    const dayChanging = {
        L: "Lundi",
        MA: "Mardi",
        ME: "Mercredi",
        J: "Jeudi",
        V: "Vendredi",
        S: "Samedi"
    };

    console.log(`\nCréneaux libres pour la salle : ${specificRoom}`);
    console.log("Jour       | Plage horaire");
    console.log("--------------------------");

    Object.keys(dayChanging).forEach(dayKey => {
        const dayName = dayChanging[dayKey];
        const dayClasses = daySchedule[dayKey] || [];
        const freeSlots = findFreeSlots(dayClasses);

        if (freeSlots.length === 0) {
            console.log(`${dayName.padEnd(10)} | Libre toute la journée`);
        } else {
            freeSlots.forEach(slot => {
                console.log(`${dayName.padEnd(10)} | ${slot.start} - ${slot.end}`);
            });
        }
    });

    console.log("--------------------------\n");
}


//Fontion pour passer des minutes au temps bien écrit
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

//Fonction pour convertir le temps écrit en minutes
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
module.exports = {findFreeSlotsByRoom, timeToMinutes};
