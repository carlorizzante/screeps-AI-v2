# Screeps!
Release 2.17.12 - codename Little Rascal

AI for Screeps, version 2, completed of Grunt file and tasks for stand alone / private server play.

The project is abandoned due a complete rewrite of the entire AI which will be probably published as well at some point. However, at the current state the AI is quite capable and can get you started quite ok.

### Grunt
In order to stream files directly into the "default" folder, in game, you need to update one line in the file Gruntfile.js.

In game, on the panel Script, you should find on the bottom of it a link "Open local folder". Click it copy as a string the location of the "default" folder and paste it into Grunt, as "dest".

### Features
- Automatic spawn of all units, with the exclusion of Claimers.
- Automatic constructions of roads.
- Decent balance between units.
- Units can spread into nearby rooms to collect additional energy.
- Spawns can send Defenders and Guards remotely to support Heroes.

### Flaws
- Cannot extract minerals (I did not get there with my RCL)
- Cannot perform aggressive military operations, only defensive ones.
- Optimizes only partially Memory usage and CPU load. It's not that bad though.

### Units
- Builder, takes care of all constructions in the Spawn room.
- Claimer, to be spawned manually and manually sent to claim another room.
- Defender, perform ranged attacks and heal itself and nearby unit.
- Guard, perform close quarter attacks, quite tough unit.
- Harvester, harvests energy in the Spawn room.
- Hauler, transporte energy from Containers to Structures in the Spawn room.
- Hero, moves into nearby rooms to collect additional energy, auto-construct roads.
- Miner, substitutes Harvesters when the Spawn is capable to spawn them.
- Upgrader, takes care of upgrading the Room Controller.

### Towers
Towers are programmed to prioritize defense, otherwise they repair structures and roads in the Spawn room.

### Future improvements
- Units will be able to more efficiently use Memory.
- Room Object to keep the state of the various room.
- Flags, and a generally a more dynamic gameplay.
