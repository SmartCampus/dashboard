SmartCampus Dashboard!
=====================


Voici le readme pour le dashboard du projet **SmartCampus**. Vous retrouverez ici les informations concernant les données nécessaires au bon fonctionnement des différentes dashboards mais également l'intention recherchée par chacune d'entre elle.

----------


Liste des dashboards :
---------

La liste suivante regroupe l'ensemble des dashboard créées pour **SmartCampus**:

> **Administration :**
>
> - [Sécurité (plan)](#sécurité-plan)
> - [Energie (plan)](#energie-plan)
>
> **Administration** (selection) :
> - [Bâtiment](#bâtiment-sélection)
> 
> **Utilisateur** (enseignant) :
>
> - [Parkings](#parkings)
> - [Restaurant universitaire](#restaurant-universitaire)
> - [Salles libres](#salles-libres)


----------


## Sécurité plan

### Intention recherchée
Afficher les problèmes de sécurité sur un plan d'un bâtiment, c'est-à-dire les portes et les fenêtres ouvertes.
Les capteurs sont affichés sur le plan et la liste complète des alertes de sécurité sont résumés dans une liste

### Données nécessaires
Fichier JSON contenant la liste des alertes :
```json
// Exemple de json attendu :
{"id":"alertes",
  "sensors":[
   {"id":"door_24"
    "kind":"door",
            "bat":"templier 2",
            "value":true,
            "floor":2,
            "id_salle":"s_32"}
            ]
}
```

----------


## Energie plan

### Intention recherchée
Afficher les problèmes de sécurité sur un plan d'un bâtiment, c'est-à-dire les pointes de chaleur et les lumières allumées.
Les capteurs sont affichés sur le plan et la liste complète des alertes d'énergie sont résumés dans une liste.

### Données nécessaires
Fichier JSON contenant la liste des alertes idem que [Sécurité](#sécurité) (avec `light` et `temp` pour l'attribut `kind`


----------

##Bâtiment (sélection)
### Intention recherchée
Afficher un plan vierge et proposer à l'utilisateur (administrateur) de choisir quelles types de données il souhaite voir apparaître sur ce plan. Il y a deux types de visualisations possibles : on représente chaque capteur par un icone ou alors on combine l'ensemble des capteurs d'un même type pour afficher une représentation de ce dit type sous forme de carte de chaleur.

### Données nécessaires
Ici l'ensemble des données sur tous les capteurs du bâtiments affiché sont nécessaires, donc :
>- le type de capteur
- sa position dans le campus (bâtiment)
- l'étage du bâtiment
- la salle
- la position dans la salle
- sa valeur

----------


## Parkings

### Intention recherchée
Afficher les places restantes (ainsi que le taux de remplissage) des parkings auquels l'utilisateur (enseignant) a une priorité d'accès.
Afficher des statistiques sur les parkings : le taux de remplissage de chaque parking selon l'heure d'arrivée et le jour de la semaine.

### Données nécessaires
Un fichier JSON contenant les valeurs actuelles sur les parkings et un autre contenant un historique (pour les statistiques).
```json
// Exemple de json attendu, les (...) remplacent des valeurs
{"id":"avg-occupation","parkings":
    {"P1":[
         {"day_1":[    
            {"value":5,"date":"7h00"},
            (...)
            {"value":5,"date":"19h00"}
            ]},
        (...)
        {"day_5":[    
            {"value":5,"date":"7h00"},
            (...)
            {"value":5,"date":"19h00"}
            ]}
]}}
```


----------


## Restaurant Universitaire

### Intention recherchée
- Afficher le menu du jour
- Afficher le temps d'attente en temps réel
- Afficher les temps d'attente moyen selon le jour de la semaine

### Données nécessaires
#### Menu
- Menu du jour (JSON)

#### Temps actuel
```json
//Exemple de json attendu
{"id":"actual-waiting","value":32}
```

#### Temps moyen
```json
//Exemple de json attendu :
{"id":"avg-waiting",
        "day_1":[{"value":`valeur`,"date":"11h00"},
                 {"value":`valeur`,"date":"11h15"},(...)],
        (...)
        "day_5":[{"value":`valeur`,"date":"11h00"},
                 {"value":`valeur`,"date":"11h15"},(...)]
}
```


----------


## Salles libres

### Intention recherchée
Afficher le bâtiment (étage) dont le nombre de salles libres est le plus grand

### Données nécessaires
```json
// Exemple de json attendu :
{"id":"salles","salles":[
                         {"id_salle":`id`,
                          "value":true}
                        ]
}
```
