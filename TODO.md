# TO DO
Planned future improvements and refactoring, in not any specific order.

- Setup a board, or todo list, or requests object

- Implement test suit, at least for utils

- Naming: Automate, Empire, Small, Simple, Hive.

- New unit: Hero
-- Heros can harvest in nearby rooms, request for roads, and build them.
-- Heros replace Exoharvesters and Exobuilders.

- New unit: Guard
-- Guards are like Defenders but more powerful, and stationary in the room they've been requested to.

- Refactor prototype.spawn.js: Automatic spawn of Long Range Builders.
-- Long Range Builders should be spawn only if necessary, aka if construction areas are on site.
-- Otherwise, one single Long Range Builder might be sufficient to repair/maintain exo structures.

- Refactor prototype.spawn.js: Automatic spawn of Harvester Tier 2.
-- Harvesters Tier 2 should be spawn automatically when the necessary Energy Level is available/reached.
-- At this point they should move (crawl) toward an Energy Source.
-- When on site, they won't move any longer, progressively inhibiting the spawn of more Harvesters.

- Refactor prototype.spawn.js: Automatic spawn of Haulers.

- Refactor prototype.creep.js: Better use of target as variable.
-- Target should be the structure or unit to act upon, not the room where the unit is expected to go on duty.
-- Suggestions for alternative to target: office, area, district, homeroom/workroom, workshop, base, headquarter, room1/room2, source/destination...

- Refactor unit: Builder.
-- Builder should be able to repair structures as well as building them, therefore removing the necessity of the Repairer.

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

## Tier 1 - basic units
-- Harvester
-- Upgrader / Sustainer
-- Builder, can Repair, fallback to Upgrader

## Tier 2 - advanced units
-- Lorry
-- Harvester
-- Upgrader
-- Builder
-- Long Range Harvester
-- Long Range Builder, fallback to Long Range Harvester

## Tier 3 - military units
-- Defender
-- Claimer
-- Healer ?
