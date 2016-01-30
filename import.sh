#/bin/bash

mongoimport --db dangerzone --collectionclear raw --drop --file ./input/moco-trunc.json
node < loadraw.js
