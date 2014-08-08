SmartCampus Dashboard!
=====================


Voici le readme pour le dashboard du projet **SmartCampus**. Vous retrouverez ici les informations concernant les données nécessaires au bon fonctionnement des différents dashboards mais également l'intention recherchée par chacun d'entre eux.

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
Je m'occupe de la gestion de la sécurité sur le campus. Les alertes de sécurité concernent les portes et fenêtres ouvertes.
Je veux savoir comment organiser le planning de ma journée pour résoudre ces problèmes.
Pour cela , je commence par identifier quels sont les problèmes à l'aide d'une liste d'alertes regroupant l'ensemble des problèmes puis je peux localiser les problèmes que j'ai choisi sur une carte Google Maps représentant l'ensemble des bâtiments du campus et mettant en évidence les problèmes sur chacun d'entre eux.
Une fois que j'ai choisi le bâtiment auquel je souhaite plus d'informations, je clique sur celui-ci. Je retouve une liste d'alerte ne concernant que le bâtiment (étage) en question ainsi que chacun des problèmes localisé sur un plan d'architecte avec des informations détaillées sur chacun de ces problèmes.

### Données nécessaires
- Pour la liste des alertes sur l'ensemble des bâtiments, le fichier JSON suivant est nécessaire :
```json
/* Exemple de json attendu : */
{"id":"alertes",
  "sensors":[
    {   "id":"door_24"
        "kind":"door",
        "bat":"templier 2",
        "value":true,
        "floor":2,
        "id_salle":"s_32"
    },
    {   "id":"window_35"
        "kind":"window",
        "bat":"templier 1",
        "value":true,
        "floor":1,
        "id_salle":"s_1"
    }
            ]
}
```
- Pour l'affichage des bâtiments sur une carte Google Maps les JSON suivants sont nécessaires :
```json
/* JSON contenant les coordonnées pour la représentation graphique des bâtiments sur la carte */
/* (Ici seul les coordonnées du bâtiment 'iut' sont présentes */
{"id":"coord_bat","values":[
    {"bat":"iut","coords":[
        {"lat":43.616843,"long":7.070968},
        {"lat":43.616823,"long":7.071223},
        {"lat":43.616495,"long":7.071171},
        {"lat":43.616513,"long":7.070915}
    ]}
]}
```
```json
/* JSON contenant les coordonnées pour la mise en évidence des alertes sur les bâtiments (centre des bâtiments en question) */
/* (Ici seul les coordonnées pour le bâtiment 'iut' sont présentes */
{"id":"coord_poi",
 "coords":[
     {"bat":"iut",
      "lat":43.616653,
      "lng":7.071069
     }
 ]
}
```
- Pour l'affichage de la liste des alertes par bâtiment (étage), on retrouve le même type de données que pour l'affichage de l'ensemble des alertes de tous les bâtiments, cependant, ici on ne retrouvera que les alertes concernant le bâtiment en question
- Pour l'affichage de la position des alertes sur un plan d'architecte, on utilisera le même fichier JSON que pour l'affichage des alertes par bâtiment (voir ci-dessus), on a également besoin du plan en question au format SVG (voir [librairie SVG][1]) dont chacune des salles possède le même `id` que l'attribut `id_salle` (afin de faire la liaison entre le SVG et les données) du JSON cité précedemment.


----------
## Energie
### Intention
Je m'occupe de la gestion de l'énergie sur le campus. Les alertes d'énergie concernent les lumières oubliées et les températures trop faibles ou trop élevées.
Je veux voir une information globale sur les problèmes d'énergie.
La procédure est identique que pour les problèmes de [sécurité](#sécurité).

### Données nécessaires
Idem que pour [Sécurité](#sécurité)


----------
## Map (sélection)
### Intention recherchée
Je suis administrateur de **SmartCampus** et je peux afficher sur une carte du campus les éléments qui m'intéressent:

- les capteurs dans les bâtiments, leur type et le nombre de capteur par bâtiment
- une carte de chaleur par type de capteur 

Lors que j'ai sélectionné un bâtiment, je peux aller sur une page qui me donnera des détails (voir [Bâtiment (sélection)](#bâtiment-sélection))

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