#/bin/bash

mkdir data
mkdir data/db

mongod --dbpath ./data/db --smallfiles

rm -rf data
