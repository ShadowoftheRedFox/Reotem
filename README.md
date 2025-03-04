# Reotem
Projet dev web CYTech 2024-2025

# Logiciels nécéssaires

- NodeJS
- MySQL
- ????

# Installation

Installation d'angular CLI:
```sh
cd ./front
npm install -g @angular/cli
```

Création des bases de données (il peut être nécéssaire d'activer le service MySQL sous Linux):
```sh
mysql -u root -p
CREATE USER 'reotem'@'localhost' IDENTIFIED BY '[PASSWORD]';
GRANT ALL PRIVILEGES ON reotem.* TO 'reotem'@'localhost';
quit

mysql -u reotem -p
CREATE DATABASE reotem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reotem;
SOURCE db/init.sql
#SOURCE db/sample.sql # pour avoir des données d'exemple
SHOW TABLES;
```

# Lancer le projet

Lancer le front:
```sh
cd ./front
ng serve
```

Lancer le back:
```sh
cd ./back
????
```

# Todo list

- [ ] page de connexion
- [ ] page inscription
- [ ] page du profil
- [ ] Système de points et niveaux en backend a stocker et frontend a afficher7
- [ ] module du tableau de bord (pour chaque utilisateur):
  - [ ] s'inscrire
  - [ ] valider son inscription (par mail ou autre)
  - [ ] envoie de mail au(x) membre(s)
  - [ ] modifier le profil d'un membre
  - [ ] log des connexions
  - [ ] changer le niveau d'un membre
  - [ ] gerer le nombre d'accès et le nombre d'actions des utilisateurs
  - [ ] rechercher, consulter, ajouter ou effacer les objets et services connectés
- [ ] module gestion (pour les membres d'un certains niveaux):
  - [ ] ajouter un nouvel objet connecté
  - [ ] demander à un admin la suppression d'un objet
  - [ ] modifier les attributs d'un objet (nom, description, statut, paramètres...)
  - [ ] actier/désactiver/mettre à jour un objet
  - [ ] associer des objects à des pièces/zones
  - [ ] configurer les paramètres d'utilisation de l'objet dans la zone (températeur de déclenchement pour un thermostat, horaire d'allumage pour une lampe etc)
  - [ ] consulter/gérer les rapports d'utilisation (log, moyenne d'utilisation, consommation energétique moyenne etc)
  - [ ] identifier les objets cassés (nécéssitant une maintenance), inneficaces (selon les paramètres de l'objet)
- [ ] module administrateur (pour les administrateur uniquement):
  - [ ] ajouter/modifier/supprimer des utilisateurs
  - [ ] ajouter/révoquer des permissions à des utilisateurs
  - [ ] gérer points et niveaux des utilisateurs
  - [ ] log des connexion et d'actions de tout les utilisateurs
  - [ ] ajouter/supprimer des catégories d'objets, d'objets ou de services
  - [ ] affectuer des sauvegardes de la BDD
  - [ ] vérifier l'intégrité des données de la platforme (pas de compte perdus, objets sans connexion a rien etc)
  - [ ] rapports avancés sur l'urilisation de la plateforme avec téléchargement des rapports (CSV, PDF etc...)
  - [ ] statistique du la consommation totale, taux de connexion et services les plus utilisés
- [ ] compression des images de profiles
- [ ] utiliser des headers de cache et optimiser les requetes API
- [ ] nécéssité des balises "aria", texte alternatif pour les logos, images et vidéos