SmartCampus Dashboard!
=====================


Voici le readme pour le dashboard du projet **SmartCampus**[^smartcampus]. Vous retrouverez ici les informations concernant les données nécessaires au bon fonctionnement des différentes dashboards mais également l'intention recherchée par chacune d'entre elle.

----------


Liste des dashboards :
---------

La liste suivante regroupe l'ensemble des dashboard créées pour **SmartCampus**:

> **Administration :**
>
> - Sécurité



> **Administration** (selection) :
> 
> **Utilisateur** (enseignant) :
>
> - [Restaurant universitaire](#restaurant-universitaire)


## <i class="icon-glass"></i> Restaurant Universitaire

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



  [^smartcampus]: **SmartCampus** est un projet consistant au déployement d'uensemble de capteurs sur le campus Sophia Tech pour le rendre "intelligent".