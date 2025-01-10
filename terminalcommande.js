const readline = require('readline');
const fs = require('fs');
const DataMain = require('./main.js');
data = DataMain.structuredData

module.exports={askMainMenu, waitForMenu};

//Importation des fonctions des SPEC 2, 8 et 9 - SPEC de Anaelle
const SPEC_1 = require('./SPEC-1.js');  //SPEC 1 - afficher les salles d'un cours donné
const SPEC_2 = require('./SPEC-2.js');  //SPEC 2 - afficher la capacité max d'une salle donnée
const SPEC_3 = require('./SPEC-3.js');  //SPEC 3 - affiche les horaires libres pour une salle
const SPEC_4 = require('./SPEC-4.js');  //SPEC 4 - affiche les salles libres à un créneau donné
//SPEC 5 non réalisé après discussion avec l'autre groupe
const SPEC_6 = require('./SPEC-6.js');  //SPEC 6 - génération du fichier ICalendar
const SPEC_7 = require('./SPEC-7.js');  //SPEC 7 - affiche salles où il y a chevauchement
const SPEC_8 = require('./SPEC-8.js');  //SPEC 8 - affichage du classement des salles par capacité
const SPEC_9 = require('./SPEC-9.js');  //SPEC 9 - visuel du taux d'occupation de chaque salle

// Création d'une interface pour lire et écrire dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// -------------------------------------------------------------------------------
// Affichage des menus

/**
 * Affiche le menu principal dans la console pour l'outil de gestion et suivi d'occupation des salles de cours.
 *
 * @function displayMainMenu
 * @returns {void} Pas de valeur de retour
 */
function displayMainMenu() {
    console.log("\n============= Main Menu =================")
    console.log("Bienvenue dans l'Outil de Gestion et Suivi d'Occupation des Salles de Cours :\n");
    console.log('Choisissez une option :');
    console.log('1 - Faire une recherche');
    console.log("2 - Visuel taux d'occupation de chaque salle"); //SPEC 9 
    console.log('3 - Générer son EDT en ICalendar'); //SPEC 6
    console.log('4 - Vérifier le non-chevauchement'); // SPEC 7
    console.log("5 - Classement des salles en fonction de leur capacité d'accueil"); //SPEC 8
    console.log('0 - Quitter');
    console.log('========================================\n');
}

/**
 * Affiche le menu de recherche dans la console pour l'outil de gestion
 * 
 * @function displaySearchMenu
 * @returns {void} Pas de valeur de retour.
 */
function displaySearchMenu() {
    console.log('============= Menu de Recherche =============');
    console.log('Choisissez une option de recherche :');
    console.log('1 - Recherche des salles assignées à un cours');
    console.log("2 - Recherche de la capacité maximale d'une salle");
    console.log("3 - Recherche des disponibilités d'une salle");
    console.log('4 - Recherche des salles libres à un créneau');
    console.log('5 - Recherche des salles par capacité minimale');
    console.log('0 - Retour au menu principal');
    console.log('=============================================\n');
}

// --------------------------------------------------------------
// Gérer les choix

/**
 * Gère la sélection du menu principal en fonction du choix de l'utilisateur.
 *
 * @function handleMainMenu
 * @param {string} choice - Le choix de l'utilisateur sous forme de chaîne de caractères.
 * @returns {void} Pas de valeur de retour à part un print à l'user.
 */
function handleMainMenu(choice) {
    switch (choice) {
        case '1':
            askSearchMenu(); // Aller au sous-menu
            return;
        case '2':
            VisuelOccupationSalle(); //SPEC 9
            return;
        case '3':
            generatePersonalSchedule(); //SPEC 6
            waitForMenu();
            return;
        case '4':
            Chevauchement(); //SPEC 7 
            return;
        case '5':
            RankingRoomCapacity(); //SPEC 8
            return;
        case '0':
            console.log('Au revoir !');
            rl.close(); // Fermer l'interface de lecture
            return;
        default:
            console.log('Option invalide. Veuillez choisir un nombre entre 0 et 5.');
            askMainMenu();
    }
}


/**
 * Gère la sélection du menu recherche en fonction du choix de l'utilisateur.
 *
 * @function handleSearchMenu
 * @param {string} choice - Le choix de l'utilisateur sous forme de chaîne de caractères.
 * @returns {void} Pas de valeur de retour à part un print à l'user.
 */
function handleSearchMenu(choice) {
    switch (choice) {
        case '1':
            SalleCours(); //SPEC 1
            return;
        case '2':
            RoomCapacity(); //SPEC 2
            return;
        case '3':
            DisponibiliteSalle(); //SPEC 3
            return;
        case '4':
            CreneauLibreSalle(); //SPEC 4
            return;
        case '5':
            SearchRoomsByMinCapacity(); //SPEC 2 - nouvelle fonction
            return;
        case '0':
            askMainMenu();
            return;
        default:
            console.log('Option invalide. Veuillez choisir un nombre entre 0 et 5.');
            askSearchMenu();
    }
}

// --------------------------------------------------------------
/**
 * Affiche le menu principal et gère l'interaction avec l'utilisateur.
 *
 * @function askMainMenu
 * @returns {void} Pas de valeur de retour.
 */
function askMainMenu() {
    displayMainMenu();
    rl.question('Votre choix : ', (choice) => {
        try {
            handleMainMenu(choice); // gère les choix de l'utilisateur
        } catch (error) {
            console.error('Une erreur est arrivée: ', error.message);
            askMainMenu(); // on redemande si erreur
        }
    });
}

/**
 * Affiche le menu recherche et gère l'interaction avec l'utilisateur.
 *
 * @function askSearchMenu
 * @returns {void} Pas de valeur de retour.
 */
function askSearchMenu() {
    displaySearchMenu();
    rl.question('Votre choix : ', (choice) => {
        try {
            handleSearchMenu(choice);
        } catch (error) {
            console.error('An error occurred: ', error.message);
            askSearchMenu(); // on redemande si erreur
        }
    });
}

// --------------------------------------------------------------------------------


// SPEC 1 - afficher les salles d'un cours donné
/** 
 * Demande un cours à l'utilisateur, puis appelle la fonction getRoomsForCourse de la SPEC-1 
 * pour le cours donné. Cette fonction permet d'afficher les salles assignées à ce cours.
 *
 * @returns {void} Cette fonction ne retourne rien
 */
function SalleCours() {
    console.log("\nVous avez choisi l'option 'Recherche des salles assignées à un cours'");
    console.log("Quel est le cours dont vous recherchez les salles ?");
    console.log("0 - Quitter");
    rl.question('Votre choix : ', (choice) => {
        switch (choice) {
            case '0':
                console.log("\\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return;
            default:
                console.log(`Vous avez choisi de rechercher les salles pour le cours : ${choice}`);
                SPEC_1.getRoomsForCourse(data, choice);
                waitForMenu();
        }
    });
}

// SPEC 2 - Afficher la capacité maximum d'une salle
/**
 * Demande une salle à l'utilisateur, vérifie qu'elle existe dans la base de données
 * et ensuite affiche sa capacité maximale.
 *
 * @returns {void} Cette fonction ne retourne rien 
 */
function RoomCapacity(){
    console.log("\nVous avez choisi l'option 'Trouver la capacité max d'une salle'");
    console.log("Quel est la salle dont vous recherchez la capacité ?");
    console.log("0 - Quitter");
    rl.question('Votre choix : ', (salle) => {
        switch (salle) {
            case '0':
                console.log("\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return; 
            default:
                console.log(`Vous avez choisi de rechercher la capacité de la salle : ${salle}`);
                SPEC_2.printedMaxCapacity(data, salle);
                waitForMenu();
        }
    })
}

function SearchRoomsByMinCapacity() {
    console.log("\nRecherche des salles par capacité minimale");
    console.log("0 - Retour au menu précédent");
    
    rl.question('Entrez la capacité minimale recherchée : ', (input) => {
        if (input === '0') {
            askSearchMenu();
            return;
        }

        const capacity = parseInt(input);
        if (isNaN(capacity)) {
            console.log("Erreur : Veuillez entrer un nombre valide");
            SearchRoomsByMinCapacity();
            return;
        }

        const filteredRooms = SPEC_2.getRoomsByMinCapacity(capacity);
        if (filteredRooms.length > 0) {
            console.log(`\nSalles disponibles avec une capacité d'au moins ${capacity} personnes :`);
            console.log("Salle | Capacité");
            console.log("---------------");
            filteredRooms.forEach(room => {
                console.log(`${room.room.padEnd(6)} | ${room.capacity} personnes`);
            });
        }
        waitForMenu();
    });
}

// SPEC 3 - Affiche les horaires libres pour une salle
/** 
 * Demande une salle à l'utilisateur, puis appelle la fonction findFreeSlotsByRoom de la SPEC-3 
 * pour la salle donnée.
 *
 * @returns {void} Cette fonction ne retourne rien
 */
function DisponibiliteSalle() {
    console.log("\nVous avez choisi l'option 'Recherche des créneaux pour une salle'");
    console.log("Quel est la salle dont vous recherchez les créneaux ?");
    console.log("0 - Quitter");
    rl.question('Votre choix : ', (choice) => {
        switch (choice) {
            case '0':
                console.log("\\nVous avez choisi l'option 'Quitter'");
                askSearchMenu();
                return;
            default:
                console.log(`Vous avez choisi de rechercher les créneaux pour la salle : ${choice}`);
                SPEC_3.findFreeSlotsByRoom(choice);
                waitForMenu();
        }
    });
}

// SPEC 4 - affiche les salles libres à un créneau donné
/**
 * Demande un créneau à l'utilisateur, puis appelle la fonction findFreeRoom de la SPEC-4
 * afin d'afficher les salles qui sont libres pendant ce créneau
 *
 * @returns {void} Cette fonction ne retourne rien
 */
function CreneauLibreSalle() {
    console.log("\nRecherche des salles libres à un créneau");
    console.log("0 - Retour au menu précédent");

    rl.question('Entrez le jour (ex: L/MA/ME/J/V/S) : ', (jour) => {
        if (jour === '0') {
            askSearchMenu();
            return;
        }
        
        const normalizedJour = jour.trim().toUpperCase();

        if (!isValidDay(normalizedJour)) {
            console.error("Erreur : Le jour doit être l'un des suivants : L, MA, ME, J, V, S. Veuillez réessayer.");
            CreneauLibreSalle(); // Restart the process
            return;
        }

        rl.question("Entrez l'heure de début (HH:MM) : ", (heureDebut) => {
            if (heureDebut === '0') {
                askSearchMenu();
                return;
            }

            if (!isValidTimeFormat(heureDebut)) {
                console.error("Erreur : L'heure de début doit respecter le format HH:MM. Veuillez réessayer.");
                CreneauLibreSalle(); // Restart the process
                return;
            }

            rl.question("Entrez l'heure de fin (HH:MM) : ", (heureFin) => {
                if (heureFin === '0') {
                    askSearchMenu();
                    return;
                }

                if (!isValidTimeFormat(heureFin)) {
                    console.error("Erreur : L'heure de fin doit respecter le format HH:MM. Veuillez réessayer.");
                    CreneauLibreSalle(); // Restart the process
                    return;
                }

                SPEC_4.findFreeRooms(jour, heureDebut, heureFin);
                waitForMenu();
            });
        });
    });
}

/**
 * Vérifie si une chaîne de caractères correspond au format HH:MM.
 *
 * @param {string} time - L'heure à vérifier
 * @returns {boolean} Retourne true si le format est valide, sinon false
 */
function isValidTimeFormat(time) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
}

/**
 * Vérifie si le jour est valide (L, MA, ME, J, V, S).
 *
 * @param {string} day - Le jour à vérifier
 * @returns {boolean} Retourne true si le jour est valide, sinon false
 */
function isValidDay(day) {
    const validDays = ['L', 'MA', 'ME', 'J', 'V', 'S'];
    return validDays.includes(day);
}

//SPEC 5 non réalisé après discussion avec l'autre groupe

//SPEC 6 - génération fichier ICalendar
/**
 * Lance le processus de génération d'un emploi du temps personnalisé au format iCalendar.
 * 
 * Cette fonction affiche un message d'accueil et appelle la fonction `askForCourses` pour que l'utilisateur choisisse les cours qu'il souhaite inclure dans son emploi du temps.
 *
 * @returns {void} Cette fonction n'a pas de valeur de retour, elle déclenche l'interaction avec l'utilisateur pour sélectionner les cours.
 */
function generatePersonalSchedule() {
    console.log("Bienvenue dans l'outil de génération de fichier ICalendar");
    dict_courses_selected={};
    askForCourses(dict_courses_selected);
    waitForMenu();
}

/**
 * Demande à l'utilisateur de sélectionner des cours pour son emploi du temps personnalisé.
 * 
 * Cette fonction gère l'interaction avec l'utilisateur pour permettre la sélection de cours.
 * Elle utilise un menu où l'utilisateur peut entrer le nom des cours, terminer la sélection ou quitter.
 * Lorsqu'un cours valide est sélectionné, il est ajouté à la liste des cours, et une fois la sélection terminée, 
 * elle appelle la fonction `askForGroups` pour que l'utilisateur choisisse les groupes associés aux cours.
 *
 * @returns {void} Cette fonction n'a pas de valeur de retour. Elle interagit avec l'utilisateur pour sélectionner des cours.
 */
function askForCourses(dict_courses_selected) {
    console.log("\nCours déjà sélectionnés:", Object.keys(dict_courses_selected).join(", ") || "Aucun");
    rl.question("Donnez le nom d'un cours ('0' pour quitter, '1' pour terminer la sélection): ", (courseCode) => {
        switch (courseCode) {
            case '0':
                console.log("Vous avez choisi de quitter");
                askMainMenu();
                return;
            case '1':
                if (Object.keys(dict_courses_selected).length > 0) {
                    showSummaryAndGenerate(dict_courses_selected);
                } else {
                    console.log('Aucun cours sélectionné. Veuillez choisir au moins un cours.');
                    askForCourses(dict_courses_selected);
                }
                return;
            default:
                if (SPEC_6.findCourse(courseCode)) {
                    askForGroups(courseCode, dict_courses_selected);
                } else {
                    console.log('Cours non trouvé. Veuillez réessayer.');
                    askForCourses(dict_courses_selected);
                }
        }
    });
}

/**
 * Demande à l'utilisateur de choisir un groupe pour chaque cours dans la liste donnée et génère un fichier iCalendar avec les cours sélectionnés.
 *
 * Cette fonction parcourt chaque cours dans la liste `list_courses`, demande à l'utilisateur de spécifier un groupe pour chaque cours, et ajoute le groupe sélectionné à un dictionnaire `dict_courses_selected`. Lorsque l'utilisateur termine la sélection, un fichier iCalendar est généré avec les informations des cours et groupes choisis.
 *
 * @function askForGroups
 * @param {} course 
 * @param {} dict_courses_selected - Liste des cours pour lesquels l'utilisateur doit choisir un groupe.
 * @returns {} Cette fonction ne retourne rien, mais lance un processus interactif pour sélectionner les groupes et générer le fichier iCalendar.
 */
function askForGroups(courseCode, dict_courses_selected) {
    SPEC_6.PrintGroupsAvailable(courseCode);
    console.log("\nGroupes déjà sélectionnés pour", courseCode + ":", 
        dict_courses_selected[courseCode]?.map(g => g.classes.group).join(", ") || "Aucun");
    
    rl.question(`Donnez le nom du groupe ('0' pour quitter, '1' pour retourner à la sélection des cours): `, (groupCode) => {
        switch (groupCode) {
            case '0':
                console.log("Vous avez choisi de quitter");
                askMainMenu();
                return;
            case '1':
                askForCourses(dict_courses_selected);
                return;
            default:
                if (SPEC_6.findGroup(courseCode, groupCode)) {
                    const newModule = SPEC_6.findGroupModule(courseCode, groupCode);
                    const conflict = SPEC_6.checkTimeConflict(dict_courses_selected, newModule);
                    
                    if (conflict.conflict) {
                        console.log("\nImpossible d'ajouter ce groupe:", conflict.message);
                        askForGroups(courseCode, dict_courses_selected);
                        return;
                    }

                    if (!dict_courses_selected[courseCode]) {
                        dict_courses_selected[courseCode] = [];
                    }
                    dict_courses_selected[courseCode].push(newModule);
                    console.log(`Groupe ${groupCode} ajouté au cours ${courseCode}`);
                    askForGroups(courseCode, dict_courses_selected);
                } else {
                    console.log('Groupe non trouvé. Veuillez réessayer.');
                    askForGroups(courseCode, dict_courses_selected);
                }
        }
    });
}


//SPEC 7 - Affiche les salles et les créneaux où il y a chevauchement
/**
 * Appelle la fonction checkOverLaps de la SPEC-7, qui vérifie le non-chevauchement 
 * des cours et les affiche s'il y en a.
 *
 * @returns {void} Cette fonction ne retourne rien
 */
function Chevauchement() {
    console.log("\nVérification du non-chevauchement des cours");
    SPEC_7.checkOverlaps(data);
    waitForMenu();
}

// SPEC 8 - Afficher un classement par capacité des salles données
/**
 * Demande plusisurs salles à l'utilisateur, vérifie qu'elles existe dans la base de données
 * et ensuite appelle une fonction qui génère un classement des salles données par capacité maximale.
 *
 * @returns {void} Cette fonction ne retourne rien 
 */
function RankingRoomCapacity(){
    console.log("\nVous avez choisi l'option 'Classement des salles en fonction de leur capacité d'accueil'");
    console.log("0 - Quitter");
    printRooms();
    const listSalles = [];
    function ask() {
        rl.question("Entrez les salles que vous souhaitez ajouter au classement ((ou '1' pour terminer, '0' pour sortir) : ", (input) => {
            input=input.toUpperCase(); // Met en majuscule
            switch (input) {
                case '0':
                    console.log("Vous avez choisi de quitter");
                    askMainMenu();
                    return;
                case '1':
                    if (listSalles.length > 0) {
                        console.log('Géneration du classement des salles sélectionnées...');
                        SPEC_8.classementSalles(listSalles);
                        waitForMenu();
                        return
                    } else {
                        console.log('Pas de groupes choisis, veuillez réessayer');
                    }
                    break;
                default:
                    if (SPEC_2.verifSalle(data, input) == true) {
                        console.log(`Salle ajoutée: ${input}`);
                        listSalles.push(input);
                    } else {
                        console.log("Erreur : la salle n'existe pas dans la base de données.");
                    }

                    ask(); //répéter pour la prochaine salle
            }
        });
    };
    ask();
}

// SPEC 9 - Visualiser le taux d'occupation d'une salle
/**
 * Demande une salle à l'utilisateur, vérifie qu'elle existe dans la base de données
 * et ensuite appelle une fonction qui génère une visualisation du taux d'occupation de la salle.
 *
 * @returns {void} Cette fonction ne retourne rien 
 */
function VisuelOccupationSalle() {
    console.log("\nVous avez choisi l'option 'Visuel taux d'occupation d'une salle'");
    console.log("Quel est la salle dont vous recherchez le taux d'occupation dans la semaine ?");
    printRooms();
    console.log("0 -> Quitter");
    rl.question('Votre choix : ', (choice) => {
        choice=choice.toUpperCase(); // Met en majuscule
        switch (choice) {
            case '0':
                console.log("\nVous avez choisi l'option 'Quitter'");
                askMainMenu();
                return; 
            default:
                if (SPEC_2.verifSalle(data, choice) == true) {
                    console.log(`Vous avez choisi de voir le taux d'occupation de la salle : ${choice}`);
                    SPEC_9.visualiserOccupationJour(choice);
                    waitForMenu();
                    return;
                } else {
                    console.log("Erreur : la salle n'existe pas dans la base de données, recommencez.");
                    VisuelOccupationSalle();
                }
        }
    });
}

/**
 * Affichage de l'ensemble des salles présentes dans la base de données
 *
 * @returns {void} Cette fonction ne retourne rien 
 */
function printRooms() {
    const listSalles = [];
    console.log("\nL'ensemble des salles disponibles est :");

    // Collecter toutes les salles sans doublon
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (!listSalles.includes(classEntry.room)) {
                listSalles.push(classEntry.room);
            }
        }
    }

    // Affichage des salles dans un format compact, 5 salles par ligne
    const sallesParLigne = 5;
    for (let i = 0; i < listSalles.length; i += sallesParLigne) {
        console.log(listSalles.slice(i, i + sallesParLigne).join(' | '));
    }

    console.log("\nTotal des salles : " + listSalles.length);
}


/**
 * Fonction qui attend que l'utilisateur fasse "Entrée" pour afficher le menu
 *
 * @returns {void} Cette fonction ne retourne rien
 */
function waitForMenu(){
    rl.question('Faites "Entrée" pour passer à la suite : ', (anything) => {
        switch (anything) {
            default:
                askMainMenu();
                return;
        }
    }
    )
}


