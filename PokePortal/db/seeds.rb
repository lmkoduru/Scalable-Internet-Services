# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Creating Forums

User.create(
  username: 'Pokemon [Official]', 
  password_digest: 'pokemon', 
  bio: 'Welcome to the world of Pokemon! This is the official Pokemon account ready to interact with all of the members of PokePortal!',
)

User.create(
  username: 'AshKetchum', 
  password_digest: 'pikachu', 
  bio: 'Pokemon Master in training',
)

User.create(
  username: 'MistyWaterflower', 
  password_digest: 'starmie456', 
  bio: 'Cerulean City Gym Leader and Water Pokemon Expert',
)

User.create(
  username: 'Anonymous',
  password_digest: 'QOPHJCAKNCKQSNCIQSPMZXKCMQPSOJDOPQKSMZL<:MCKXPVIJPOKPOK!2',
  bio: 'N/A'
)

Forum.create(title: "news", description: "Stay updated and discuss about the newest announcements from Pokemon.")
Forum.create(title: "competitive", description: "Discuss recent VGC / Smogon updates, tournaments, and all things Competitive Pokemon.")
Forum.create(title: "games", description: "Watch out for the newest Pokemon games and discuss new releases, teams, etc...")
Forum.create(title: "trading", description: "Set up times and trading agreements with other trainers a part of the PokePortal community.")

Post.create(title: 'Pokémon GO - Catch Mastery + Pokémon HOME', body: "Niantic have announced the next Pokémon GO event. This event is theCatch Mastery: Ice event and runs on December 9th from 10:00 to 20;00 local time
During the event, you'll have increased chances to get Shiny Snorunt, Cryogonal & Bergmite
There is a 2* Experience bonus for successful catches with Nice, Great or Curveball Throws
Snorunt and Bergmite will appear in the wild
There will be Field Research to get Cryogonal based on Poké Ball throwing
There will be Timed Research to get 40 Cryogonal encounters
There will also be additional paid Timed Research to get 40 more Cryogonal encouners", user_id: 1, forum_id: 1)
Post.create(title: 'Pokémon UNITE - Meowscarada Release & Holiday Event', body: "Pokémon UNITE has received a small update which adds a variety of things to the game.
First, the Pokémon Meowscarada is now available to earn through event missions, and its Phantom Thief Holowear is now available to purchase in the shop for 1,050 Gems with animation for Movement. We're currently compiling full details for Meowscarada in our Pokémon section for the game.
Alongside this, the annual Holiday event is now live which features the return of the Pumpkin Battle Mode
A code is also available for the Sprigatito Boost Emblem with the code GETSPRIGATITO", user_id: 1, forum_id: Forum.first.id)
Post.create(title: 'Pokémon Scarlet & Violet - The Indigo Disk & Online Competition + Pokémon Masters EX - Villain Event', body: "It has been confirmed that some news about Pokémon Scarlet & Violet's The Indigo Disk DLC, will come December 7th at 14:00 UTC / 15:00 CEST / 09:00 EST / 06:00 PST / 23:00 JST. At present we don't know the content of the news but will post it as soon as it comes so be sure to keep checking back ---- Following its cancellation last week due to a bug that allowed for players to change Pokémon in their Battle Team if their Koraidon/Miraidon were registered and confirmation of it being rescheduled, we now have dates for the Japan only online competition, the Dragon King Battle Qualifiers. This competition will run from January 19th through January 21st 2024 ---- A trio of Pokémon Masters EX events have begun First, the People Protecting Pokémon Villain event has begun a repeat run. This event has you play against a variety of stages focused on Aether Foundation to earn tickets to exchange for items", user_id: User.first.id, forum_id: Forum.first.id)
Post.create(title: 'Best Strategies for Gym Battles', body: "What are your strategies for winning gym battles?", user_id: User.first.id, forum_id: Forum.second.id)
Post.create(title: 'Tera Type Suggestions', body: "I’m trying to change a few of my Pokémon’s Tera types (primarily for singles, but can also function in doubles) & I’m torn on a few options based on the current meta:
* Pyroar- Normal or Grass
* Noivern- Fire or Steel
* Tinkaton- Ghost, Steel, Ground, or Flying
* Gliscor- Water or Dragon
* Scizor- Water or Dragon", user_id: User.first.id, forum_id: Forum.second.id)


Post.create(title: 'Looking to Trade Psyduck', body: 'I am looking for a Charmander to trade for my Bulbasaur. Any takers?', user_id: User.last.id, forum_id: Forum.last.id)
Post.create(title: 'Pokémon Scarlet & Violet', body: "Pokémon Scarlet & Violet are the fourth set of mainline Pokémon games on the Nintendo Switch and the first of the Generation 9 of Pokémon.
This game is a full seamless open world game set in a big new region. You play as a trainer starting out in the region with one of three new Starter Pokémon; Sprigatito, Fuecoco or Quaxly. It has many New Pokémon, and the return of Regional Variants: Paldean Forms
This game features a new mechanic known as Terastal, which can cause your Pokémon to change type, or just boost up moves of a specific type.
The game is an open world game which you can take in any order and can play with up to 3 friends at a time with the friends and their Pokémon showing up on the open world. You can also use the features to battle and trade with other players, including Surprise Trade as well as participate in Raid Battles", user_id: User.last.id, forum_id: 3)

Battle.create(title: 'Kanto Region Championship', description: 'An epic showdown to find the champion of the Kanto region.', date: Date.today + 1.day, user_id: User.first.id, battle_type: 'Pokemon Battle')
Battle.create(title: 'Johto League Qualifier', description: 'Qualifying matches for the prestigious Johto League.', date: Date.today + 1.week, user_id: User.last.id, battle_type: 'Pokemon Contest')