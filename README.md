SmartCampus Dashboard!
=====================


Voici le readme pour le dashboard du projet **SmartCampus**. Vous retrouverez ici les informations concernant les données nécessaires au bon fonctionnement des différentes dashboards mais également l'intention recherchée par chacune d'entre elle.

----------


Liste des dashboards :
---------

La liste suivante regroupe l'ensemble des dashboard créées pour **SmartCampus**:

> **Administration :**
>
> - [Sécurité](#-sécurité)
> - [Energie](#-energie)



> **Administration** (selection) :
> 
> **Utilisateur** (enseignant) :
>
> - [Restaurant universitaire](#-restaurant-universitaire)


## Sécurité

### Intention recherchée
Afficher les problèmes de sécurité sur un plan d'un bâtiment, c'est-à-dire les portes et les fenêtres ouvertes.
Les capteurs sont affichés sur le plan et la liste complète des alertes de sécurité sont résumés dans une liste

### Données nécessaires
Fichier JSON contenant la liste des alertes de sécurité :
> {"id":"alertes",
>  "alertes":[
>   {"id":`id_capteur`,
>    "data":{"kind":`door`ou`window`,
>            "bat":`batiment`,
>            "floor":`etage`,
>            "id_salle":`salle`}}]



## Energie

### Intention recherchée
Afficher les problèmes de sécurité sur un plan d'un bâtiment, c'est-à-dire les pointes de chaleur et les lumières allumées.
Les capteurs sont affichés sur le plan et la liste complète des alertes d'énergie sont résumés dans une liste.

### Données nécessaires
Fichier JSON contenant la liste des alertes d'énergie :
> {"id":"alertes",
>  "alertes":[
>   {"id":`id_capteur`,
>    "data":{"kind":`temp`ou`light`,
>            "bat":`batiment`,
>            "floor":`etage`,
>            "id_salle":`salle`}}]



## Restaurant Universitaire

### Intention recherchée
- Afficher le menu du jour
- Afficher le temps d'attente en temps réel
- Afficher les temps d'attente moyen selon le jour de la semaine

### Données nécessaires
#### Menu
- Menu du jour (JSON)
#### Temps actuel
- JSON : {"id":"actual-waiting","value":`valeur`}
#### Temps moyen
- JSON : {"id":"avg-waiting",
          "day_1":[{"value":`valeur`,"date":"11h00"},{"value":`valeur`,"date":"11h15"},...],
.....
"day_5":[{"value":`valeur`,"date":"11h00"},{"value":`valeur`,"date":"11h15"},...]}

