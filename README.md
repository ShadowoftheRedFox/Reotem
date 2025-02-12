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