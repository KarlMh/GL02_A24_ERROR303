const Parser = require('./parser.js');
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, 'sample/edttotal_clean.cru');
let structuredData = null;

// Suppression du warning Punycode causé par la SPEC-9
const originalEmitWarning = process.emitWarning;
    process.emitWarning = function(warning, ...args) {
        if (typeof warning === 'string' && warning.includes('punycode')) return;
        return originalEmitWarning(warning, ...args);
    };

// Lecture du fichier
fs.readFile(file, 'utf8', async (err, data) => {
    if (err) {
        console.error("Erreur lors de la lecture du fichier :", err);
        return;
    }

    // Créer une nouvelle instance de Parser
    const parser = new Parser();

    try {
        // Parse et récupère les tokens structurés
        console.log("Validation et tokenisation en cours...");
        const tokens = await parser.parseAndTokenize(data);

        if (tokens) {
            console.log(`Le fichier ${file} est conforme au format CRU.`);

            // Organisation des données
            structuredData = organizeTokens(tokens);
            
            // Export the structured data
            module.exports = { structuredData };
            
            //console.log("Structured Data: ");
            //console.log(JSON.stringify(structuredData, null, 2));

            // Lancer l'application APRES le traitement du fichier
            const Menu = require('./terminalcommande.js');
            //Menu.mainTest();
            Menu.askMainMenu();

        } else {
            console.log(`Le fichier ${file} n'est pas conforme au format CRU.`);
        }
    } catch (parseError) {
        console.error("Erreur lors du parsing :", parseError);
    }
});

/**
 * tableau d'objets représentant des lignes de cours en données organisées
 * Exemple de structure : données organisées par cours avec leurs attributs
 *
 * @function transformStructuredDataToClasses
 * @param {Array<string>} tokens - Les tokens à organiser.
 * @returns {Array<Object>} Données organisées.
 */
function transformStructuredDataToClasses(data) {
    return data.map(module => {
        const classes = module.entries.map(entry => {
            return {
                group: entry[1],      // C1, D1, T1
                capacity: entry[2],  // 63, 24
                day: entry[3],       // L, MA, ME
                start: entry[4],     // 10:00
                end: entry[5],       // 12:00
                room: entry[6]       // A002, S102
            };
        });

        return {
            module: module.module,  // +MA02
            classes: classes        // Array de dictionnaires
        };
    });
}

/**
 * Organise les tokens en une structure de données.
 * Exemple de structure : Données organisées par cours avec leurs attributs
 *
 * @function organizeTokens
 * @param {Array<string>} tokens - Les tokens à organiser.
 * @returns {Array<Object>} Données organisées.
 */
function organizeTokens(tokens) {
    const organized = [];
    let currentModule = null;
    let currentCourse = [];
    for (const token of tokens) {
        if (/^\+[A-Z]{2,7}(\d{1,2})?[A-Z]?\d?$/.test(token)) {
            // Détection d'un nouveau module
            if (currentModule) {
                // Si on a un cours partiellement rempli, on l'ajoute
                if (currentCourse.length > 0) {
                    currentModule.entries.push(currentCourse);
                    currentCourse = [];
                }
                organized.push(currentModule);
            }
            // Initialiser un nouveau module
            currentModule = {
                module: token.slice(1),
                entries: [], // Un tableau à double entrée (chaque sous-tableau représente un cours)
            };
        } else if (currentModule) {
            // Ajouter le token au cours courant
            if (/^1$|^(C|D|T)\d{1,2}$|^P=\d{1,3}$|^H=(L|MA|ME|J|V|S)$|^(\d|1\d|2[0-3]):[0-5]\d-(\d|1\d|2[0-3]):[0-5][0-9]$|^[A-Z]([0-9]|[A-Z])?$|^S=(?:SPOR|[A-Z]{1,3}\d{1,3})?$/.test(token)) {
                // Transformer les valeurs spécifiques
                if (/^[CTD]\d{1,2}$/.test(token)) {
                    // Replace C1 -> CM1, T1 -> TP1, D1 -> TD1 dynamically
                    const transformedToken = token.replace(/^([CTD])(\d+)$/, (match, letter, number) => {
                        // Dynamically add the appropriate letter (CM, TP, TD)
                        if (letter === 'C') return 'CM' + number;
                        if (letter === 'T') return 'TP' + number;
                        if (letter === 'D') return 'TD' + number;
                        return match;  // si pas de match trouvé, on return la valeur originale du token
                    });
                    currentCourse.push(transformedToken);  //ajout du transformedToken
                } else if (/^P=\d{1,3}$/.test(token)) {
                    currentCourse.push(parseInt(token.split("=")[1])); // "P=50" -> 50 (int)
                } else if (/^H=(L|MA|ME|J|V|S)$/.test(token)) {
                    currentCourse.push(token.split("=")[1]); // "H=MA" -> "MA"
                } else if (/^S=(?:SPOR|[A-Z]{1,3}\d{1,3})?$/.test(token)) {
                    if (token == 'S=') {
                        currentCourse.push('')
                    }else{
                        currentCourse.push(token.split("=")[1]); // "S=LAB102" -> "LAB102"
                    }
                } else if (/^(\d|1\d|2[0-3]):[0-5]\d-(\d|1\d|2[0-3]):[0-5][0-9]$/.test(token)) {
                    const [start, end] = token.split("-"); // "08:00-09:30" -> ["08:00", "09:30"]
                    currentCourse.push(start, end);
                } else {
                    currentCourse.push(token); // Ajout brut pour les autres tokens
                }
            } else if (/^\+[A-Z]{2,4}(\d{1,2})?[A-Z]?\d?$/.test(token)) {
                currentCourse.push(token.slice(1)); //"+MA02" -> "MA02"
            }

            // Si le token de fin de cours est atteint
            if (token === "//") {
                currentModule.entries.push(currentCourse);
                currentCourse = [];
            }
        }
    }

    // Ajouter le dernier module traité
    if (currentModule) {
        if (currentCourse.length > 0) {
            currentModule.entries.push(currentCourse);
        }
        organized.push(currentModule);
    }

    //on range tout dans une structure de données
    structuredData = transformStructuredDataToClasses(organized)

    return structuredData;
}
