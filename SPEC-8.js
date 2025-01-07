// Exportation des fonctions dont on a besoin en dehors de ce fichier
module.exports = { classementSalles };
const DataMain = require('./main.js');
const SPEC2bis = require('./SPEC-2.js');
data = DataMain.structuredData;

/**
 * Fonction qui affiche le classement des salles données par l'utilisateur par ordre décroissant de leurs capacités maximales
 * Exemple de donnée : ["D105", "P102", "A002"]
 *
 * @param {Array<string>} listSalles - La liste des salles dont on veut le classement par ordre de capacité maximale.
 * @returns {void} Cette fonction ne retourne rien, mais affiche le classement des salles dans un format structuré
 */
function classementSalles(listSalles) {
    const capacites = listSalles.map((salle) => ({
        salle, 
        capacite: SPEC2bis.MaxCapacity(data, salle), // Capacité maximale de la salle
    }));

    capacites.sort((a, b) => b.capacite - a.capacite);

    console.log("\nClassement des salles par capacité maximale :");
    console.log("Salle       | Capacité maximale");
    console.log("-------------------------------");
    capacites.forEach(({ salle, capacite }) => {
        console.log(`${salle.padEnd(10)} | ${capacite} personnes`);
    });
    console.log("-------------------------------\n");
}
