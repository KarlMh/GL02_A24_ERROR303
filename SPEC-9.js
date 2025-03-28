// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports={visualiserOccupationJour};
const DataMain = require('./main.js');
data = DataMain.structuredData
const fs = require('fs');

//Importation des modules specifique à l'affichage (ils sont à installer par le client)
const vg = require("vega");
const vegalite = require("vega-lite");
const { exec } = require('child_process');

// ------------------------------------------------------------
// Fonction appelée depuis terminalcommande

/**
 * Fonction qui génère un fichier SVG montrant le taux d'occupation de la salle donnée pour chaque jour
 * Exemple de donnée : "D105"
 *
 * @param {string} salle - La salle dont on veut visualiser le taux d'occupation par jour.
 * @returns {void} Cette fonction ne retourne rien, mais génère le SVG
 */
function visualiserOccupationJour(salle){
    const joursMap = {
        "L": "Lundi", 
        "MA": "Mardi", 
        "ME": "Mercredi", 
        "J": "Jeudi", 
        "V": "Vendredi", 
        "S": "Samedi"
    };

    // dataParJour va contenir les données que l'on utilise pour afficher le graphique, c'est à dire
    // le nombre d'heures pendant lesquelles la salle est occupée, le nombre d'heures pendant lesquelles elle est libre, et quel jour
    const jours = ["L", "MA", "ME", "J", "V", "S"];
    const dataParJour = jours.flatMap(jourAbrege => {
        const stats = tauxParJour(jourAbrege, salle);
        const heuresOccupees = stats.totalHeures;
        const heuresDisponibles = 12 - heuresOccupees; // en supposant des plages horaires de 12h
        return [
            { jour: joursMap[jourAbrege], 
                category: "Occupée", 
                pourcentage: heuresOccupees / 12 
            },
            { jour: joursMap[jourAbrege], 
                category: "Disponible", 
                pourcentage: heuresDisponibles / 12 
            }
        ];
    });

    // création de barChart, qui contient les données du graphique VegaLite
    const barChart = {
         "title": `Occupation de la salle ${salle} par jour`,
        "data": { "values": dataParJour },
        "width": 900,
        "height": 700,
        "mark": "bar",
        "encoding": {
            "x": { "field": "jour", 
                "type": "nominal", 
                "title": "Jour",
                "sort": ["L", "MA", "ME", "J","V", "S"],
                "scale": {
                    "domain": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                },
                "axis": {
                    "labelAngle": 0  ,
                }
            },
            "y": { 
                "type": "quantitative", 
                "title": "Pourcentage",
                "field": "pourcentage",
                "stack": "normalize"
            },
            "color": { 
                "field": "category",
                "type": "nominal",
                "title":"Disponibilité",
                "scale": { 
                    "domain": ["Occupée", "Disponible"],
                    "range": ["#F5A788", "#98CE00"] 
                }
            },
            "tooltip": [
                { "field": "jour", "type": "nominal", "title": "Jour" },
                { "field": "category", "type": "nominal", "title": "Catégorie" },
                { "field": "pourcentage", "type": "quantitative", "title": "Pourcentage", "format": ".0%" }
            ]
        },
        "config": {
            "title": {
                "fontSize": 30,
                "fontWeight": "bold",
                "color": "#333"
            },
            "legend": {
                "labelFontSize": 17,  
                "titleFontSize": 17,   
                "title": "Disponibilité",
            }
        }
    };
    
    // création du fichier SVG qui affiche le taux d'occupation de la salle donnée
    const myChart = vegalite.compile(barChart).spec;
    
    const runtime = vg.parse(myChart);
    const view = new vg.View(runtime).renderer('svg').run();
    const mySvg = view.toSVG();
    mySvg.then(function(res){
        fs.writeFileSync("barChart_VisuelOccupation.svg", res);
        console.log("Graphique sauvegardé sous 'barChart_VisuelOccupation.svg'.");
        
        // Ouvrir le fichier automatiquement après sa création selon le système d'exploitation
        let command;
        switch (process.platform) {
            case 'darwin':  // macOS
                command = `open barChart_VisuelOccupation.svg`;
                break;
            case 'win32':   // Windows
                command = `start barChart_VisuelOccupation.svg`;
                break;
            default:        // Linux
                command = `xdg-open barChart_VisuelOccupation.svg`;
        }
        
        exec(command, (error) => {
            if (error) {
                console.error(`Erreur lors de l'ouverture du fichier : ${error}`);
            }
        });
    });
    
}


// ------------------------------------------------------------
// Fonction uniquement utilisée ici

/**
 * Fonction qui renvoie le total des heures pendant lesquelles la salle est occupée donnée pour le 
 * jour donné
 * Exemple de donnée : "J" et "D105" pour la salle D105 le Jeudi
 *
 * @param {string} jour - Le jour dont on veut les heures occupées de la salle donnée
 * @param {string} salle - La salle dont on veut les heures occupées
 * @returns {number} total des heures occupées de la salle donnée pour le jour donné
 */
function tauxParJour(jour, salle) {
    let totalHeures = 0; // Nombre total d'heures d'occupation
    for (const course of data) {
        for (const classEntry of course.classes) {
            if (classEntry.room === salle && classEntry.day === jour) {
                //somme des heures pendant lesquelles la salle donnée est occupée donnée pour le jour donné
                const [start, end] = [classEntry.start, classEntry.end]; // Horaires début et fin
                const heures = parseInt(end.split(":")[0]) - parseInt(start.split(":")[0]);
                const minutes = parseInt(end.split(":")[1]) - parseInt(start.split(":")[1]);
                totalHeures += heures + minutes / 60;
            }
        }
    }
    return { totalHeures };
}
 
