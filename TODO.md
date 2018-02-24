# TO DO
Planned future improvements and refactoring, in not any specific order.

- Implement test suit, at least for utils

- Naming: Automate, Empire, Small, Simple, Hive.

- Optimize Creeps' actions, perform multiple actions per tick as for http://docs.screeps.com/simultaneous-actions.html

- Optimize Hero body parts

- Towers should auto-build their own Ramparts.
	-- A square all around them, size 3x3 with the Tower in the middle.

- Critical structures, like Towers, should auto-request for their own Ramparts.
	-- A square all around them, size 3x3 with the structure in the middle.

- Implements jobs {target, action}
	-- Jobs will require a coordinator.
	-- The coordinator assigns job to each individual creep and they perform the task until completion, done that they are free to take another job.
	-- Coordinator, Supervisor, AI, Mind, Genius...

- Setup recycling routine for creeps
	-- When Creeps's life gets below 50 or so ticks, have it going to a container closed to the Spawn, once there the Spawn recycles them, and the residual energy from the Creep is dropped into the container - not lost.

- New unit: Guard
	-- Guards are like Defenders but more powerful, and stationary in the room they've been requested to.

- Refactor prototype.spawn.js: Automatic spawn of Harvester Tier 2.
-- Harvesters Tier 2 should be spawn automatically when the necessary Energy Level is available/reached.
-- At this point they should move (crawl) toward an Energy Source.
-- When on site, they won't move any longer, progressively inhibiting the spawn of more Harvesters.

- Refactor prototype.spawn.js: Automatic spawn of Haulers.

- Refactor prototype.creep.js: Better use of target as variable.
-- Target should be the structure or unit to act upon, not the room where the unit is expected to go on duty.
-- Suggestions for alternative to target: office, area, district, homeroom/workroom, workshop, base, headquarter, room1/room2, source/destination...

- Refactor unit: Long Range Builder.
-- Long Range Builder should fallback to Long Range Harvester if no construction or maintenance/repair is needed.

- Design new unit: Miner
-- Miner has only one MOVE part, which is uses to get to the Extraction point. Once there it drops extracted resource into a nearby Container. Haulers then take care of picking up the resource and hauling it where required.
-- Balance between Energy Source and other kinds.

- Design new unit: Hauler.
-- Haulers move resources (probably mainly Energy) across various key points on the map, mainly Containers, Storage, Spawn, and Extensions.
-- Balance between Energy Source and other kinds.

- Design new unit: Reclaimer.
-- Reclaimer goes into empty rooms and reclaims them for further use / investigate how to do so.

- Reorganize Creeps' Tiers.
-- Rethink Energy Cap for each tier.
-- Tier 1: 800
-- Tier 2: 1.500
-- Tier 3: ?

## Tier 1 - starter units
-- Harvester
-- Upgrader / Sustainer
-- Builder, can Repair, fallback to Upgrader

## Tier 2 - efficiency units
-- Hero
-- Defender
-- Miner + Hauler

## Tier 3 - military units
-- Claimer
-- Guard ?
-- Healer ?

## Progression
- Phase 1. Tier 1 / Energy 300 -> 700...?
	Harvesters get energy for spawning initial creeps.
	Upgraders maintain/upgrade Room Controller.
	Builders build infrastructures.
	
- Phase 2. Tier 2 / Energy 700 -> 1500...?
	Heros add additional energy income from nearby rooms.
	Defenders spawned on necessity when Heros under threat.
	Miners + Haulers improve energy management in Home room.
	Miners + Haulers also mine Minerals.

- Phase 3. Tier 3 / Energy 1000 -> ...?
	To be defined, but basically Phase 3 is about expansion.

