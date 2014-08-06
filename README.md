SmartCampus Dashboard!
=====================


Voici le readme pour le dashboard du projet **SmartCampus**. Vous retrouverez ici les informations concernant les données nécessaires au bon fonctionnement des différentes dashboards mais également l'intention recherchée par chacune d'entre elle.

----------


Liste des visualisations :
---------

La liste suivante regroupe l'ensemble des visualisations créées pour **SmartCampus**:

> **Administration :**
>
> - [Sécurité](#sécurité)
> - [Energie](#energie)
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
## Sécurité
## Intention
Je suis m'occupe de la gestion de l'énergie sur le campus. Les alertes de sécurité concerne les portes et fenêtres oubliées.
Je veux voir une information globales sur les problèmes de sécurité.
(Option) Pour cela si le nombre d'alertes n'est pas trop important je peux voir une liste de celles-ci les résumant. Une fois que j'ai identifié les problèmes sur cette liste je peux passer à l'étape suivante.
Si le nombre d'alerte est trop importante, je visualise directement les alertes par bâtiments en cliquant sur ceux-ci.
Une fois que j'ai choisi l'endroit où je souhaite plus de détails, je peux aller vers une autre page qui m'affichera le plan du bâtiment selectionné. Sur cette page je peux soit regarde la liste des alertes présentes afin de planifier ma journée (si cette liste n'est pas trop grande) et ensuite je visualise sur le plan la position des alertes afin de connaître la position du problème et d'y intervenir.

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
## Energie
### Intention
Je suis m'occupe de la gestion de l'énergie sur le campus. Les alertes d'énergie concerne les lumières oubliées et les températures trop faibles ou trop élevé.
Je veux voir une information globales sur les problèmes d'énergie.
La procédure est identique que pour les problèmes de [sécurité](#sécurité).

### Données nécessaires
Idem que pour [Sécurité](#sécurité)


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

- Je souhaite me garer (maintenant), pour cela je regarde l'occupation (scalaire) actuelle des parkings où j'ai accès, ainsi que le taux d'occupation de chacun pour choisir celui où j'aurais le plus de facilité pour me garer.
- Je souhaite savoir quel est le meilleur horaire pour me garer étant donné un jour donné afin de prévoir mon heure d'arrivée. Pour cela je visualise la taux d'occupation (%) dans le créneau horaire qui m'interesse et je compare également les flux de départ et d'arrivée des autres utilisateurs

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

- Je compte manger au RU ce midi (il est à peu près l'heure du repas), je regarde le menu du jour pour savoir ce qu'on me proposer à manger aujourd'hui, si celui m'interesse, je regarde le temps d'attente actuel ainsi que l'heure supposée à laquelle je devrais manger si je pars immédiatement.
- Nous sommes Lundi, j'ai une journée très chargée Jeudi et donc très peu de temps pour manger le midi. Je regarde donc le temps moyen d'attente (scalaire) le Jeudi pour attendre le moins possible et manger le plus rapidement possible. Si je trouve un horaire qui me convient, je vérifie si le menu du jour concerné afin de prendre ma décision.

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
