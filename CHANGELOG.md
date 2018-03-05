# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/).
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.17.11] - 2018-03-05
### Edited
- README.md, final words

### Changed
- config.js, Tier1 Energy Cap reduced from 1000 to 800
- prototype.creep.js, bug fix recycleAt() and improvements
- prototype.spawn.js, bug fix, added calcCreepCost() method
- role.defender.js, Defenders only perform Ranged Attack

## [2.17.10] - 2018-03-05
### Changed
- prototype.creep.js, refactored getEnergy() method
- prototype.spawn.js, new deleteExpiredCreeps() method
                      new countCreepsInRoom() method
                      renamed getAdjacentRooms() into getExits()

## [2.17.9] - 2018-03-02
### Changed
- prototype.creep.js, minimal improvements
- prototype.spawn.js, bug fix
- role.hero.js, Heros reset Workroom when they transfer all residual Energy to Structures
- role.miner.js, increased time for recycling / moving towards Spawn


## [2.17.8] - 2018-03-02
### Changed
- config.js, changed Miners' Cap to the number of Energy Sources in the room
- prototype.creep.js, refactored resetWorkroom() method
                      refactored recycleAt() method
                      refactored rechargeStructure() method
- prototype.spawn.js, refactored spawnCustomCreep() method, bug fix
                      refactored getExits() method
                      refactored hijack() method
- role.harvester.js, Harvesters do not get Energy from Containers
                     Harvesters do not move into nearby rooms
- role.hero.js, Heros do not get Energy from Containers
                improved recycling routine when in Workroom

## [2.17.7] - 2018-03-01
### Changed
- config.js, Builders cap reduced from 5 to 4
- prototype.creep.js, added resetWorkroom() method
                      refactored requestRoad() method, added param fatigue
                      refactored getEnergy() method, returns Boolean
                      refactored findStructure() method, bug fix
                      refactored rechargeStructure() method, bug fix
                      renamed details() method into getDetails()
                      removed findAndrechargeStructures() method
- role.harvester.js, refactored to enable Harvester work on nearby rooms
- role.hauler.js, refactored to share more common code with other units
- role.hero.js, refactored, bug fix and optimization

## [2.17.6] - 2018-03-01
### Changed
- config.js, better balance of units spawning
- prototype.spawn.js, refactored Spawning routine, unified into spawnCustomCreep() method
                      hardcoded nearby rooms, temporary test
- role.hero.js, bug fix

## [2.17.5] - 2018-03-01
### Changed
- prototype.creep.js, renamed recharge() method into getEnergy()
                      refactored getEnergy(), bug fix
- role.hero.js, refactored

## [2.17.4] - 2018-03-01
### Changed
- prototype.creep.js, renamed suicideAt() method into recycleAt()
                      refactored recharge() method
                      removed longRecharge() method
- role.guard.js, implemented recycledAt(30)
- role.defender.js, implemented recycleAt(30)
- role.hauler.js, implemented recharge() method
- role.hero.js, refactored under attack routine
                added recycleAt(30) method
                replaced longRecharge() method with recharge()
- role.miner.js, implemented recycleAt(20);

## [2.17.3] - 2018-02-28
### Changed
- config.js, Tier1 Energy Cap increased to 1000 Energy
- prototype.creep.js, constansts VERBOSE and DEBUG
- prototype.spawn.js, constansts VERBOSE and DEBUG
- prototype.tower.js, constansts VERBOSE and DEBUG

### Removed
- utils.js, not used any longer

## [2.17.2] - 2018-02-28
### Changed
- prototype.creep.js, refactored suicideAt() method

## [2.17.1] - 2018-02-28
### Added
- prototype.creep.js, suicideAt() method
- role.builder.js, Builder can now be recycled by Spawn when closer to end of life
- role.harvester.js, Harvesters can now be recycled by Spawn when closer to end of life
- role.hauler.js, Haulers can now be recycled by Spawn when closer to end of life
- role.upgrader.js, Upgraders can now be recycled by Spawn when closer to end of life

## [2.17.0] - 2018-02-28
### Added
- prototype.creep.js, added headForHomeroom() method
- role.guard.js, Tier3 Guard units added to the pool of available Creeps

### Changed
- config.js, includes Guards in units count
- prototype.spawn.js, refactored spawning to add Guards
- role.builder.js, Builders can now pickup dropped resources
- role.harvester.js, Harvesters can now pickup dropped resources
- role.hauler.js, Haulers no longer pickup dropped resources
- role.hero.js, Heros head for homeroom if damaged
- role.upgrader.js, Upgraders can now pickup dropped resources

## [2.16.4] - 2018-02-27
### Changed
- config.js, changes Harvesters and Hauler Cap limits.

## [2.16.3] - 2018-02-27
### Changed
- config.js, Tier 2 Energy Threshold downgraded from 1000 to 800
- prototype.creep.js, bug fix

## [2.16.2] - 2018-02-27
### Added
- role.miner.js, Unit stores energy source's and container's ids in memory

### Changed
- prototype.creep.js, refactored isLocked() method
- prototype.creep.js, rechargeStructures() method renamed into findAndRechargeStructures()

## [2.16.1] - 2018-02-25
### Added
- prototype.creep.js, new methods findStructure and rechargeStructure
- prototype.spawn.js, bug fix

### Changed
- role.harvester.js, refactored structures finding routine
- role.hero.js, refactored structures finding routine

## [2.16.0] - 2018-02-25
### Added
- role.claimer.js, first iteration for Claimer units
- prototype.spawn.js, refactored spawnTier3 method, can now spawn Claimers
- prototype.spawn.js, Spawns can now hijack Hero units on passage, resetting their homeroom and workroom
- config.js, added Tier 3 Energy Threshold method

## [2.15.0] - 2018-02-24
### Added
- prototype.creep.js, refactor pickUpDroppedResources
- prototype.spawn.js, priority given to requests
- role.hauler.js, Haulers added to the pool of Tier 2 units

## [2.14.0] - 2018-02-24
### Added
- config.js, added miners_cap() method
- role.miner.js, Fully functional Miner role
- prototype.creep.js, added isLocked() method
- prototype.spawn.js, spawnTier2() method can now spawn Miners as well

### Changed
- Gruntfile.js, refactor, sync and update tasks added

## [2.13.2] - 2018-02-24
### Changed
- prototype.creep.js, Recharging structures now can exclude Towers
- role.harvester.js, Harvesters allowed to recharge Towers
- role.hero.js, Heros NOT allowed to recharge Towers

## [2.13.1] - 2018-02-24
### Added
- prototype.creep.js, Creeps can use Containers
- prototype.spawn.js, refactored spawning of Creep Tier 2
- role.miner.js, Miner, work in progress

### Changed
- config.js, Creep Tier 2 Energy Available increased to 800
- main.js, Main loop properly handles entries in Memory.board

### Removed
- role.repairer.js

## [2.13.0] - 2018-02-23
### Added
- main.js, Main loop properly handles entries in Memory.board
- prototype.creep.js, requestMilitarySupport finally functional
- prorotype.spawn.js, implements Memory.board scan for pending requests
- role.builder.js, bug fix
- role.defender.js, bug fix in homeroom, removed target property from Creep's memory

## [2.12.3] - 2018-02-23
### Changed
- config.js, roles list moved in prototype.spawn.js, repair_threshold 0.5
- prototype.creep.js, removed obsolete roles, bug fix
- prototype.spawn.js, removed obsolete, refactored roles list, removed Repairers
- role.builder.js, Builders can now repair, no need for Repairers any longer
- role.exobuilder.js, deleted
- role.exoharvester.js, deleted
- role.repairer.js, role is now obsolete, replaced by Builders

## [2.12.2] - 2018-02-23
### Changed
- role.hero.js, refactored and bug fix

## [2.12.1] - 2018-02-23
### Changed
- prototype.creep.js, reduced range for picking up dropped resources, to 10 squares
- role.hero.js, reduced range for repairing structures, to 3 squares

## [2.12.0] - 2018-02-23
### Added
- prototype.creep.js, added requestRoad() method
- prototype.spawn.js, replace exobuilder and exoharvester with hero units
- role.hero.js, Hero units replace ExoBuilders and ExoHarvesters

## [2.11.3] - 2018-02-22
### Added
- utils.js, collection of short and sweet utilities

### Changed
- prototype.creep.js, work in progress for Memory.board
- prototype.spawn.js, refactored spawning

## [2.11.2] - 2018-02-21
### Changed
- role.defender.js, Defenders can now heal friendly creeps

## [2.11.1] - 2018-02-21
### Added
- role.exobuilder.js, replaces role.longBuilder.js
- role.exoharvester.js, replaces role.longHarvester.js

### Changed
- prototype.creep.js, uses new Exo Builders and Exo Harvesters
- prototype.spawn.js, uses new Exo Builders and Exo Harvesters

## [2.11.0] - 2018-02-21
### Changed
- prototype.creep.js, makes use of new Creeps' Memory properties, homeroom and workroom
- prototype.spawn.js, makes use of new Creeps' Memory properties, homeroom and workroom
- role.longBuilder.js, makes use of new Creeps' Memory properties, homeroom and workroom
- role.longHarvester.js, makes use of new Creeps' Memory properties, homeroom and workroom

## [2.10.2] - 2018-02-21
### Changed
- Gruntfile.js, Grunt can now copy into proper Screeps game folder.

## [2.10.1] - 2018-02-21
### Changed
- README.md, updates file structure and versioning

## [2.10.0] - 2018-02-21
### Added
- Gruntfile.js

### Changed
- All .js files moved into src/ folder
- All prototype...js files moved into src/proto/ folder
- All role...js files moved into src/roles/ folder

## [2.9.0] - 2018-02-21
### Added
- config.js, wall_threshold() and rampart_threshold()
- prototype.tower.js, Towers can now repair structures and heal creeps

### Changed
- prototype.spawn.js, LongBuilder priority set to 25% over longHarvester
- role.repair.js, bug fix
- settings.js into config.js

## [2.8.1] - 2018-02-20
### Changed
- role.longBuilder.js, LR Builder can now repair, makes maintenance

## [2.8.0] - 2018-02-20
### Added
- role.defender.js, added Tier 3 for Creeps, Defenders, work in progress

## [2.7.0] - 2018-02-19
### Added
- role.longBuilder.js, Creeps able to build in other/target rooms

## [2.6.0] - 2018-02-19
### Changed
- prototype.creep.js, refactored Creeps' logic
- prototype.spawn.js, bug fix
- role.builder.js, refactored Creeps' logic
- role.harvester.js, refactored Creeps' logic
- role.longHarvester.js, refactored Creeps' logic
- role.repairer.js, refactored Creeps' logic
- role.upgrader.js, refactored Creeps' logic
- settings.js, bug fix

## [2.5.3] - 2018-02-19
### Changed
- role.longHarvester.js, Long Range Harvester can now pick up dropped resource

## [2.5.2] - 2018-02-19
### Changed
- main.js, added "use strict"
- prototype.creep.js, Creeps take a break when fatigue > 0

## [2.5.1] - 2018-02-19
### Changed
- role.longHarvester.js, bug fix

## [2.5.0] - 2018-02-19
### Changed
- prototype.creep.js, Creeps can now recharge from Storage
- prototype.spawn.js, Long Range Harvesters in Tier 2
- role.longHarvester.js, search energy source by path instead of by range
- role.repairer.js, fix repair bug, now Repairs actually repair structures

## [2.4.1] - 2018-02-19
### Changed
- prototype.spawn.js, implements energy cap limit for Creeps tier 1
- role.repairer.js, switch to build mode if not repair needed
- settings.js, Creeps tier 1 capped at 600 Max Energy

## [2.4.0] - 2018-02-18
### Changed
- prototype.spawn.js, implements automatic settings for creeps tier 1
- settings.js, calc automatic settings for creeps tier 1

## [2.7.5] - 2018-02-18
### Changed
- prototype.spawn.js, fallback to Long Range Harvester
- role.builder.js, removed creep.say(...)
- role.harvester.js, removed creep.say(...)
- role.longHarvester.js, removed creep.say(...)
- role.repairer.js, removed creep.say(...)
- role.upgrader.js, removed creep.say(...)

## [2.7.4] - 2018-02-18
### Changed
- prototype.spawn.js, changed spawning priorities
- role.builder.js, Builder can gather energy from storage
- role.repairer.js, Repairer can gather energy from storage
- role.upgrader.js, Upgrader can gather energy from storage

## [2.7.3] - 2018-02-18
### Changed
- role.longHarvester.js, upgrade controller when room fully charged

## [2.7.2] - 2018-02-18
### Changed
- role.longHarvester.js, fully-automatic room targeting

## [2.7.1] - 2018-02-18
### Changed
- role.longHarvester.js, pseudo-automatic room targeting

## [2.7.0] - 2018-02-18
### Added
- role.longHarvester.js, added basic Long Range Harvesters

## [2.6.1] - 2018-02-17
### Changes
- prototype.spawn.js, refactored auto spawning for creeps tier 1

## [2.6.0] - 2018-02-17
### Added
- prototype.tower.js, added tower logic

## [2.5.0] - 2018-02-17
### Changed
- prototype.spawn.js, refactored auto spawn creeps tier 1

## [2.4.0] - 2018-02-17
### Added
- role.repairer.js

## [2.3.0] - 2018-02-17
### Added
- role.builder.js

## [2.2.0] - 2018-02-17
### Added
- prototype.spawn.js
- role.upgrader.js

## [2.1.0] - 2018-02-16
### Added
- basics.js
- main.js
- prototype.creep.js
- role.harvester.js

## [2.0.0] - 2018-02-16
### Initial commit
- CHANGELOG.md
- package.json
- README.md
