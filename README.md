SmartCampus Dashboard!
=====================


Voici le readme pour le dashboard du projet **SmartCampus**. Vous retrouverez ici les informations concernant les données nécessaires au bon fonctionnement des différentes dashboards mais également l'intention recherchée par chacune d'entre elle.

----------


Liste des dashboards :
---------

La liste suivante regroupe l'ensemble des dashboard créées pour **SmartCampus**:

> **Administration :**
>
> - [Sécurité (map)](#sécurité-map)
> - [Sécurité (plan)](#sécurité-plan)
> - [Energie (map)](#energie-map)
> - [Energie (plan)](#energie-plan)
>
> **Administration** (selection) :

> - [Map](#map-sélection)
> - [Bâtiment](#bâtiment-sélection)
> 
> **Utilisateur** (enseignant) :
>
> - [Parkings](#parkings)
> - [Restaurant universitaire](#restaurant-universitaire)
> - [Salles libres](#salles-libres)



----------
## Sécurité map
## Intention
Je suis administrateur de **SmartCampus** et m'occupe de la sécurité sur le campus. Je peux voir d'un coup d'oeil les problèmes de sécurité sur la carte du campus, une fois que j'ai identifié ces problèmes de façon globale, je peux les regarder en détails de 2 manières :
- je regarde la liste des alertes présenté également sur la même page (liste plus détaillée sur le type d'alerte, la position du problème, etc)
- je peux aller sur une autre page qui me visualisera le plan du bâtiment que j'ai sélectionné (voir [Sécurité plan](#sécurité-plan)).

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


## Sécurité plan
### Intention

Je suis administrateur de **SmartCampus** et m'occupe de la sécurité sur le campus. Je peux voir d'un coup d'oeil les problèmes de sécurité sur un plan (plan d'architecte) d'un étage d'un bâtiment. Lorsque j'ai identifié les problèmes, je peux voir leurs détails sur une liste détaillée présente sur la même page.

### Données nécessaires
Idem que pour [Sécurité map](#sécurité-map)

----------
## Energie map
### Intention
Je suis administrateur de **SmartCampus** et m'occupe de la gestion de l'énergie sur le campus. Je peux voir d'un coup d'oeil sur la carte du campus les problèmes concernant l'énergie (problème de température ou lampe allumée inutilement). Une fois que j'ai identifié les problèmes je peux voir ces problèmes de façon plus détaillé de 2 manières différentes :
- sur une liste d'alertes déjà présente sur la page, détaillant chaque alerte présente sur la carte
- sur une autre page, en cliquant sur le bâtiment que l'on souhaite (voir [Energie plan](#énergie-plan))

### Données nécessaires
Idem que pour [Sécurité map](#sécurité-map)


----------


## Energie plan

### Intention recherchée
Je suis administrateur de **SmartCampus** et m'occupe de la gestion de l'énergie sur le campus. Je peux identifier d'un seul coup d'oeil sur un plan (plan d'architecte) les problèmes d'énergie. Une fois que j'ai identifié les problèmes je peux voir les détails de ces problèmes sur la liste déjà  présente sur cette même page.

### Données nécessaires
Idem que pour [Sécurité map](#sécurité-map)


----------
## Map (sélection)
### Intention recherchée
Je suis administrateur de **SmartCampus** et je peux afficher sur une carte du campus les éléments qui m'intéressent:

- les capteurs dans les bâtiments, leur type et le nombre de capteur par bâtiment
- une carte de chaleur par type de capteur 

Lors que j'ai sélectionné un bâtiment, je peux aller sur une page qui donnera des détails (voir [Bâtiment (sélection)](#bâtiment-sélection))

### Données nécessaires
Ici l'ensemble des données sur tous les capteurs du bâtiments affiché sont nécessaires, donc un fichier JSON du type :

```json
{"id":"list-sensors",
 "sensors":[
    {"id":"door_1",
     "kind":"door",
     "value":true,
     "bat":"temp1",
     "floor":4,
     "salle":"s_1",
     "location":"N"
    },
    (...)
    {"id":"window_1",
     "kind":"door",
     "value":false,
     "bat":"temp1",
     "floor":4,
     "salle":"s_2",
     "location":"N"
    }
 ]
}

```



----------

##Bâtiment (sélection)
### Intention recherchée
Je suis administrateur de **SmartCampus** et je peux afficher sur un plan d'architecte des capteurs et leur état ou une carte de chaleur correspondant à un type de capteur. Je peux choisir quelle donnée doit être affiché sur le plan. Je peux également revenir à la carte du campus vers [Map (sélection)](#map-sélection).
### Données nécessaires
Idem que [Map (sélection)](#map-sélection).

----------


## Parkings

### Intention recherchée
Je suis utilisateur du campus (enseignant). Deux utilisations de ce dashboard sont possibles:
- Je souhaite savoir, à l'instant même, dans quel parking j'ai le plus de chance de trouver une place pour me garer
- Je souhaite savoir à l'avance, dans quel parking j'ai le plus de chance de trouver une place pour me garer (selon le jour et l'heure d'arrivée)

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
Je suis utilisateur du campus. Sur ce dashboard deux utilisations sont possibles :

- Je compte manger au RU ce midi (il est à peu près l'heure du repas), je regarde le menu du jour pour savoir ce qu'on me proposer à manger aujourd'hui, ensuite je regarde le temps d'attente actuel et l'heure supposée à laquelle je devrais manger si je pars immédiatement.
- Nous sommes Lundi, j'ai une journée très chargée Jeudi et donc très peu de temps pour manger le midi. Je regarde donc le temps moyen d'attente le Jeudi pour attendre le moins possible et manger le plus rapidement possible.

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
Je suis utilisateur du campus. Je souhaite travailler en groupe avec des collègues. Je peux savoir quel bâtiment (et étage) a le plus de salles libres et je peux identifier ces salles sur le plan de l'étage concerné. Ensuite, je peux aller voir la position du bâtiment concerné sur une carte du campus, puis revenir au plan de l'étage.

### Données nécessaires
```json
// Exemple de json attendu :
{"id":"salles","salles":[
                         {"id_salle":`id`,
                          "value":true}
                        ]
}
```
