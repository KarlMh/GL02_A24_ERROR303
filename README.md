# Outil de Gestion et Suivi d'Occupation des Salles de Cours
Destiné aux gestionnaires de locaux de l'Université Centrale de la République de Sealand (SRU), au personnel du service informatique, et aux développeurs impliqués dans la réalisation de l'outil de gestion des salles de cours

## Table des matières
1. [Prérequis](#prérequis)
2. [Packages Requis](#packages-requis)
3. [Visualisation de Données](#visualisation-de-données)
4. [Structure des Données](#structure-des-données)
5. [Lancement de l'Application](#lancement-de-lapplication)
6. [Interface Utilisateur](#interface-utilisateur)
7. [Remarques](#remarques)
8. [Dépannage](#dépannage)
9. [Tests Unitaires](#tests-unitaires)

## Prérequis

### Dépendances

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de packages Node.js)

### Installation des Dépendances

Clonez le dépôt et installez les packages nécessaires :

```
bash
git clone https://github.com/ichoupinou/GL02_A24_ERROR303.git
cd GL02_A24_ERROR303
npm install 

```

## Packages Requis

- `readline`: Gestion des interactions en ligne de commande
- `fs`: Lecture/écriture de fichiers
- `path`: Manipulation des chemins de fichiers

## Visualisation de Données

### Vega et Vegalite

Installez Vega et Vegalite pour la visualisation :

```bash
bash
npm install vega vega-lite

```

Ces bibliothèques sont utilisées notamment pour la SPEC-9 (visualisation du taux d'occupation des salles).

## Structure des Données

Le programme traite des fichiers de type `.cru` contenant les informations des emplois du temps. Le fichier `sample/edttotal_clean.cru` est utilisé comme source de données par défaut.

## Fonctionnalités Principales

1. Recherche de salles par cours
2. Vérification de la capacité maximale des salles
3. Vérification des salles qui ont une capacité minimale donnée
4. Recherche des disponibilités des salles
5. Identification des salles libres à un créneau donné
6. Génération d'un agenda iCalendar
7. Vérification des chevauchements de cours
8. Classement des salles par capacité
9. Visualisation du taux d'occupation des salles

## Lancement de l'Application

```bash
node main.js

```

## Interface Utilisateur

L'application propose un menu interactif en ligne de commande avec plusieurs options numérotées.

## Remarques

- Assurez-vous d'utiliser le fichier `edttotal_clean.cru` ou des données en '.cru' valides
- Les interactions se font via la console
- Suivez les instructions affichées à l'écran

## Dépannage

- Vérifiez que Node.js est correctement installé
- Assurez-vous d'avoir toutes les dépendances installées
- Consultez les messages d'erreur de la console

## Tests Unitaires

Les tests unitaires se trouvent dans "./jasmin_unit_test.spec.js"
En se positionnant dans le dossier du fichier, on peut réaliser les tests unitaires de tel façon

```bash
npm test

```

## Fonction `verifSalle`

- **Test 1 :** Vérifie qu'une salle existante retourne `true`
    - Salles testées : A002, S102, D105
- **Test 2 :** Vérifie qu'une salle inexistante retourne `false`
    - Cas de test : Salle X999, chaîne vide

## Fonction `printedMaxCapacity`

- **Test 1 :** Retourne la capacité maximale d'une salle existante
    - Exemple : Salle A002
- **Test 2 :** Gère correctement une salle inexistante
    - Exemple : Salle X999

## Fonction `getRoomsForCourse`

- **Test 1 :** Retourne la liste des salles pour un cours existant
    - Exemple : Cours MA03
- **Test 2 :** Gère un cours inexistant
    - Exemple : Cours FB02

## Contributeurs

Anaëlle MELO (anaelle.melo@utt.fr)
Icham LECORVAISIER (icham.lecorvaisier@utt.fr)
Florent PERROUX (florent.perroux@utt.fr)
Cheikh DIOP (cheikh.diop1@utt.fr)
Karl MEHANNA (karl.mehanna@utt.fr)
tatiana NOUGWA (tatiana_nougwa.kemajou@utt.fr)
