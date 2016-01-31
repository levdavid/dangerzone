#/bin/bash

mkdir data

screen -S database mongod --dbpath ./data --smallfiles
