

import { Player, Crime, ShopItem, Business, Location, Drug, Vehicle, VehicleCrime, Heist, SkillBranch, Mission, MockUser, SmugglingMethod, Family, Territory, FamilyRole, Stock } from './types';

export const FAMILY_CREATION_COST = 1000000;
export const REPAIR_COST_FACTOR = 0.25; // 25% of vehicle's base value to repair
export const REPAIR_RISK_PERCENTAGE = 25; // 25% chance of getting caught
export const JAIL_TIME_SECONDS = 30;
export const HEAL_COST_PER_HP = 10;
export const PRODUCTION_CYCLE_MS = 10 * 60 * 1000; // 10 minutes for a production cycle
export const LAND_COST_PER_M3 = 25000;
export const PLANT_COST_PER_M3 = 5000;
export const WEED_PRODUCTION_PER_M3_PER_DAY = 0.8;
export const INVESTIGATOR_COST = 50000;
export const INVESTIGATOR_MIN_HOURS = 2;
export const INVESTIGATOR_MAX_HOURS = 4;

export const RANK_LAND_CAPS: { [rank: string]: number } = {
  'Thug': 10,
  'Picciotto': 15,
  'Soldato': 25,
  'Enforcer': 40,
  'Collector': 60,
  'Button Man': 90,
  'Made Man': 135,
  'Capodecina': 200,
  'Caporegime': 300,
  'Street Boss': 450,
  'Consigliere': 675,
  'Underboss': 1000,
  'Boss': 1500,
  'Don': 2250,
  'Capo di Capi': 3375,
  'Godfather': 5000,
};

export const STOCKS: Stock[] = [
    { id: 'GCO', name: 'Genco Pura Olive Oil', description: 'A legitimate front for a major crime family. Stable, but slow growth.', initialPrice: 150, volatility: 0.03 },
    { id: 'SMM', name: 'Schwartz & Meyer Munitions', description: 'A reliable supplier of firearms. Prices rise during turf wars.', initialPrice: 450, volatility: 0.08 },
    { id: 'VFL', name: 'Vespucci Fine Leathers', description: 'High-end fashion with deep ties to the underworld for laundering.', initialPrice: 220, volatility: 0.05 },
    { id: 'BLI', name: 'Blavikan industries', description: 'A cash-cow for its owners, but susceptible to police raids.', initialPrice: 800, volatility: 0.12 },
    { id: 'GLOG', name: 'Global Logistics Inc.', description: 'The go-to for moving... anything, anywhere. No questions asked.', initialPrice: 310, volatility: 0.07 },
];

export const FAMILY_SHOP_ITEMS: ShopItem[] = [
    { id: 'family_armor', name: 'Omertà Vest', description: 'A custom-fitted armored vest, a symbol of family protection.', power: 250, cost: 80000, type: 'Armor' },
    { id: 'family_weapon', name: 'The Vendetta', description: 'A gold-inlaid tommy gun, passed down through generations. It has settled many scores.', power: 500, cost: 150000, type: 'Weapon' },
    { id: 'family_ring', name: 'Don\'s Signet Ring', description: 'A heavy gold ring that signifies your absolute authority within the family.', power: 750, cost: 250000, type: 'Special' },
];

export const TERRITORIES: Territory[] = [
    { id: 'usa_docks', name: 'USA Docks', locationId: 'usa', influence: 25000, maxInfluence: 25000, controllingFamilyId: 'family_The Scorpions', bonus: { type: 'HEIST_SUCCESS', value: 5 } },
    { id: 'usa_downtown', name: 'USA Downtown', locationId: 'usa', influence: 50000, maxInfluence: 50000, controllingFamilyId: null, bonus: { type: 'BUSINESS_INCOME', value: 10 } },
    { id: 'usa_casino', name: 'The High Roller Casino', locationId: 'usa', influence: 40000, maxInfluence: 40000, controllingFamilyId: null, bonus: { type: 'CASINO_LOSS_CUT', value: 20 } },
    { id: 'italy_market', name: 'Italy Old Market', locationId: 'italy', influence: 15000, maxInfluence: 15000, controllingFamilyId: null, bonus: { type: 'CRIME_SUCCESS', value: 5 } },
    { id: 'italy_port', name: 'Italy Port', locationId: 'italy', influence: 30000, maxInfluence: 30000, controllingFamilyId: 'family_The Leone Family', bonus: { type: 'XP_GAIN', value: 5 } },
    { id: 'colombia_fields', name: 'The Greenfield Plains', locationId: 'colombia', influence: 35000, maxInfluence: 35000, controllingFamilyId: null, bonus: { type: 'DRUG_PRODUCTION', value: 10 } },
    { id: 'china_gambling_dens', name: 'Macau Gambling Dens', locationId: 'china', influence: 45000, maxInfluence: 45000, controllingFamilyId: null, bonus: { type: 'CASINO_LOSS_CUT', value: 80 } },
    { id: 'russia_kremlin_outskirts', name: 'Kremlin Outskirts', locationId: 'russia', influence: 40000, maxInfluence: 40000, controllingFamilyId: null, bonus: { type: 'CRIME_SUCCESS', value: 7 } },
    { id: 'russia_vodka_distillery', name: 'Vodka Distillery', locationId: 'russia', influence: 30000, maxInfluence: 30000, controllingFamilyId: null, bonus: { type: 'BUSINESS_INCOME', value: 8 } },
    { id: 'japan_shibuya_crossing', name: 'Shibuya Crossing', locationId: 'japan', influence: 55000, maxInfluence: 55000, controllingFamilyId: null, bonus: { type: 'XP_GAIN', value: 8 } },
    { id: 'japan_yakuza_hq', name: 'Yakuza HQ District', locationId: 'japan', influence: 70000, maxInfluence: 70000, controllingFamilyId: null, bonus: { type: 'HEIST_SUCCESS', value: 10 } },
    { id: 'sweden_stockholm_archipelago', name: 'Stockholm Archipelago Docks', locationId: 'sweden', influence: 20000, maxInfluence: 20000, controllingFamilyId: null, bonus: { type: 'DRUG_PRODUCTION', value: 5 } },
    { id: 'australia_sydney_harbour', name: 'Sydney Harbour Front', locationId: 'australia', influence: 40000, maxInfluence: 40000, controllingFamilyId: null, bonus: { type: 'BUSINESS_INCOME', value: 9 } },
];

export const SMUGGLING_METHODS: SmugglingMethod[] = [
  { id: 'cheap', name: 'Hidden Compartment', description: 'A classic method. Cheap, but risky.', costMultiplier: 0.05, successBonus: 0 },
  { id: 'standard', name: 'Bribe Dock Worker', description: 'Grease some palms to look the other way. More reliable, for a price.', costMultiplier: 0.15, successBonus: 15 },
  { id: 'premium', name: 'Private Courier', description: 'A professional service that guarantees discretion and speed. Very expensive, very secure.', costMultiplier: 0.35, successBonus: 30 },
];

export const WHEEL_REWARDS: {type: string, value: string}[] = [
  { type: 'Money', value: '$1000' },
  { type: 'Drug', value: '5 Weed' },
  { type: 'Money', value: '5000€' },
  { type: 'Vehicle', value: 'A Random Car' },
  { type: 'XP', value: '500 XP' },
  { type: 'Drug', value: '5 Pills' },
  { type: 'Respect', value: '1 Respect' },
  { type: 'Dud', value: 'Nothing' },
];

export const MOCK_USERS: MockUser[] = [];

export const MISSIONS: Mission[] = [
    {
        id: 'TUTORIAL_1',
        title: 'Secure Your Cash',
        description: "Cash on the street is a liability. The bank is the safest place for your earnings. Open the bank by clicking on your cash amount in the top-left panel.",
        objective: "Open the bank.",
        type: 'OPEN_BANK',
        reward: { money: 50, xp: 20 },
        nextMissionId: 'TUTORIAL_2',
    },
    {
        id: 'TUTORIAL_2',
        title: 'Make a Deposit',
        description: "Now that you're in the bank, deposit some of your starting cash to keep it safe from prying eyes and sticky fingers.",
        objective: "Deposit any amount of money into your bank account.",
        type: 'DEPOSIT_MONEY',
        reward: { money: 200, xp: 20 },
        nextMissionId: 'TUTORIAL_3',
    },
    {
        id: 'TUTORIAL_3',
        title: 'Gear Up',
        description: "You can't make a name for yourself bare-handed. Visit the Black Market and buy something to increase your power. Anything will do for now.",
        objective: 'Buy any item from the Black Market.',
        type: 'BUY_ANY_ITEM',
        reward: { money: 100, xp: 30 },
        nextMissionId: 'TUTORIAL_4',
    },
    {
        id: 'TUTORIAL_4',
        title: 'First Steps into Crime',
        description: 'The higher-ups want to see if you have what it takes. Make a move, any move, and show them you\'re not just talk. A simple score will do.',
        objective: 'Successfully commit any crime.',
        type: 'COMMIT_ANY_CRIME',
        reward: { money: 2000, xp: 50 },
        nextMissionId: 'TUTORIAL_5',
    },
    {
        id: 'TUTORIAL_5',
        title: 'Improve Yourself',
        description: 'Committing crimes earns you experience and makes you smarter. Rank promotions grant Skill Points (SP). Open your Skills panel to see how you can improve.',
        objective: 'Open your Skills panel.',
        type: 'VIEW_SKILLS',
        reward: { money: 0, xp: 40 },
        nextMissionId: 'TUTORIAL_6'
    },
    {
        id: 'TUTORIAL_6',
        title: 'On The Move',
        description: 'This city is just one part of your future empire. Travel to another location to see what opportunities await.',
        objective: 'Travel to any other location.',
        type: 'TRAVEL_ANYWHERE',
        reward: { money: 500, xp: 75 },
        nextMissionId: 'MISSION_2'
    },
    {
        id: 'MISSION_2',
        title: 'Grand Theft Auto: Tutorial',
        description: 'You\'ve got some cash, but a real operator needs wheels. Get yourself a car. Any car will do for now. It\'s about showing you\'ve got the nerve to take what isn\'t yours.',
        objective: 'Successfully steal any vehicle.',
        type: 'STEAL_ANY_VEHICLE',
        reward: { money: 2500, xp: 75 },
        nextMissionId: 'MISSION_3',
    },
    {
        id: 'MISSION_3',
        title: 'A Gentleman\'s Wager',
        description: 'Crime isn\'t all dirty work. Sometimes, you gotta play the odds. Head to the casino, try your luck at the dice table. A win will show you know how to handle yourself in any situation.',
        objective: 'Win a game of Odds or Evens.',
        type: 'WIN_ODDS_OR_EVENS',
        reward: { money: 1000, xp: 40 },
        nextMissionId: 'MISSION_4',
    },
    {
        id: 'MISSION_4',
        title: 'Building an Empire',
        description: 'Street scores are nice, but true power comes from steady income. It\'s time to invest your earnings. Buy a business, any business, and start building your empire. Let the money work for you.',
        objective: 'Buy any business.',
        type: 'BUY_ANY_BUSINESS',
        reward: { money: 10000, xp: 150 },
        nextMissionId: 'MISSION_5',
    },
    {
        id: 'MISSION_5',
        title: 'The Silk Road',
        description: 'Local markets are for amateurs. The real money is in moving product across borders. Acquire some merchandise and find a buyer in another city. This is where the real risk, and real reward, lies.',
        objective: 'Successfully smuggle a shipment of drugs.',
        type: 'SMUGGLE_ANY_DRUG',
        reward: { money: 15000, xp: 250 },
    },
];

export const HEISTS: Heist[] = [
    {
        id: 'heist_1',
        name: 'Armored Van Interception',
        description: 'Intercept a lightly armored cash-in-transit van on its daily route. A quick hit-and-run job.',
        minRank: 'Enforcer', // Rank 4
        stages: [
            { 
                id: 'h1_s1', name: 'Track Route', description: 'Follow the van to map its route and identify a weak point.',
                options: [
                    { id: 'h1_s1_o1', name: 'Quick Tail', description: 'A quick and dirty tail job. Might miss some details.', cost: 2000, successBonus: 5, failureBonus: 0 },
                    { id: 'h1_s1_o2', name: 'Full Surveillance', description: 'Stake out the route for a full day. Expensive but detailed.', cost: 5000, successBonus: 10, failureBonus: 2 },
                ]
            },
            { 
                id: 'h1_s2', name: 'Acquire Roadblock', description: 'Get your hands on a decommissioned police car or a heavy truck.',
                options: [
                    { id: 'h1_s2_o1', name: 'Steal a Wreck', description: 'Find a junker to block the road. Cheap and disposable.', cost: 3000, successBonus: 5, failureBonus: 0 },
                    { id: 'h1_s2_o2', name: 'Buy a Limo', description: 'Purchase a long limousine. It\'ll block the whole street.', cost: 10000, successBonus: 12, failureBonus: 3 },
                ]
            },
            { id: 'execution', name: 'The Ambush', description: 'This is it. Block the road and hit them fast. No turning back.', cost: 0 },
        ],
        finalReward: { money: [50000, 150000], xp: [2000, 5000] }
    },
    {
        id: 'heist_2',
        name: 'Downtown Jewelry Store Takedown',
        description: 'A sophisticated smash-and-grab on a high-end jewelry store after hours. Requires disabling security systems.',
        minRank: 'Collector', // Rank 5
        stages: [
            { 
                id: 'h2_s1', name: 'Case the Joint', description: 'Observe the store, noting camera placements and security patrols.',
                options: [
                    { id: 'h2_s1_o1', name: 'Fly a Drone', description: 'Use a consumer drone for aerial surveillance. Risky but cheap.', cost: 8000, successBonus: 8, failureBonus: 1 },
                    { id: 'h2_s1_o2', name: 'Pose as a Customer', description: 'Go inside and get a feel for the layout and security.', cost: 15000, successBonus: 12, failureBonus: 3 },
                ]
            },
            { 
                id: 'h2_s2', name: 'Disable Alarms', description: 'Bribe a security insider or hack their system to create a blind spot.',
                options: [
                    { id: 'h2_s2_o1', name: 'Insider Bribe', description: 'Pay off a security guard for the alarm codes.', cost: 25000, successBonus: 15, failureBonus: 5 },
                    { id: 'h2_s2_o2', name: 'Hire a Hacker', description: 'Recruit a netrunner to create a digital ghost in the system.', cost: 40000, successBonus: 20, failureBonus: 8 },
                ]
            },
            { id: 'execution', name: 'Smash and Grab', description: 'Break in during the blind spot, grab as much as you can, and get out.', cost: 0 },
        ],
        finalReward: { money: [100000, 300000], xp: [4000, 8000] }
    },
];

export const SKILL_TREE: SkillBranch[] = [
    {
        id: 'mastermind',
        name: 'Mastermind',
        description: 'Skills for the strategic criminal who profits from intelligence and influence.',
        skills: [
            { id: 'mastermind_1', name: 'Shrewd Investor', description: '+10% income from all businesses.', cost: 1, dependencies: [], effect: { type: 'BUSINESS_INCOME', value: 10 }},
            { id: 'mastermind_2', name: 'Natural Leader', description: '+5% XP gain from all sources.', cost: 2, dependencies: ['mastermind_1'], effect: { type: 'XP_GAIN', value: 5 }},
            { id: 'mastermind_3', name: 'Meticulous Planner', description: '+5% success chance on all heists.', cost: 3, dependencies: ['mastermind_2'], effect: { type: 'HEIST_SUCCESS', value: 5 }},
        ]
    },
    {
        id: 'enforcer',
        name: 'Enforcer',
        description: 'Skills for the muscle who prefers direct action and intimidation.',
        skills: [
            { id: 'enforcer_1', name: 'Street Smarts', description: '+5% success chance on Low difficulty crimes.', cost: 1, dependencies: [], effect: { type: 'CRIME_SUCCESS_LOW', value: 5 }},
            { id: 'enforcer_2', name: 'Heavy Handed', description: '+5% success chance on Medium difficulty crimes.', cost: 2, dependencies: ['enforcer_1'], effect: { type: 'CRIME_SUCCESS_MEDIUM', value: 5 }},
        ]
    },
    {
        id: 'grifter',
        name: 'Grifter',
        description: 'Skills for the gambler who plays the odds and always has an ace up their sleeve.',
        skills: [
            { id: 'grifter_1', name: 'Lucky Streak', description: '+10% payouts from Odds or Evens & Higher or Lower.', cost: 1, dependencies: [], effect: { type: 'GAMBLE_PAYOUT', value: 10 }},
            { id: 'grifter_2', name: 'Comped', description: 'Your first Wheel of Fortune spin each day is free.', cost: 2, dependencies: ['grifter_1'], effect: { type: 'GAMBLE_PAYOUT', value: 100 }}, // Placeholder effect
        ]
    },
    {
        id: 'brawler',
        name: 'Brawler',
        description: 'Skills for those who solve problems with their fists, focusing on health and stamina.',
        skills: [
            { id: 'brawler_1', name: 'Toughness', description: '+25 max Stamina.', cost: 1, dependencies: [], effect: { type: 'MAX_STAMINA', value: 25 }},
            { id: 'brawler_2', name: 'Second Wind', description: '+10% Stamina regeneration rate.', cost: 2, dependencies: ['brawler_1'], effect: { type: 'STAMINA_REGEN_RATE', value: 10 }},
            { id: 'brawler_3', name: 'Efficient Fighter', description: 'Attacks cost 1 less Stamina.', cost: 3, dependencies: ['brawler_2'], effect: { type: 'ATTACK_STAMINA_COST', value: -1 }},
        ]
    }
];

export const RANKS: { name: string; xpThreshold: number; skillPoints?: number }[] = [
  { name: 'Thug', xpThreshold: 0 },
  { name: 'Picciotto', xpThreshold: 200, skillPoints: 1 },
  { name: 'Soldato', xpThreshold: 600, skillPoints: 1 },
  { name: 'Enforcer', xpThreshold: 1500, skillPoints: 1 },
  { name: 'Collector', xpThreshold: 3500, skillPoints: 1 },
  { name: 'Button Man', xpThreshold: 7000, skillPoints: 1 },
  { name: 'Made Man', xpThreshold: 12000, skillPoints: 1 },
  { name: 'Capodecina', xpThreshold: 20000, skillPoints: 1 },
  { name: 'Caporegime', xpThreshold: 35000, skillPoints: 1 },
  { name: 'Street Boss', xpThreshold: 60000, skillPoints: 1 },
  { name: 'Consigliere', xpThreshold: 100000, skillPoints: 1 },
  { name: 'Underboss', xpThreshold: 150000, skillPoints: 1 },
  { name: 'Boss', xpThreshold: 250000, skillPoints: 1 },
  { name: 'Don', xpThreshold: 400000, skillPoints: 1 },
  { name: 'Capo di Capi', xpThreshold: 600000, skillPoints: 1 },
  { name: 'Godfather', xpThreshold: 1000000, skillPoints: 1 },
];

export const DRUGS: Drug[] = [
    { id: 'weed', name: 'Weed', basePrice: 100 },
    { id: 'pills', name: 'Painkillers', basePrice: 500 },
    { id: 'cocaine', name: 'Cocaine', basePrice: 2000 },
    { id: 'heroin', name: 'Heroin', basePrice: 5000 },
];

export const LOCATIONS: Location[] = [
    { id: 'usa', name: 'USA', description: 'The land of opportunity, where empires are built and rivals are buried.', airTravelCost: 0, airTravelDuration: 0, trainTravelCost: 0, trainTravelDuration: 0, drugPriceModifiers: { weed: 1.0, pills: 1.2, cocaine: 1.5, heroin: 1.8 } },
    { id: 'italy', name: 'Italy', description: 'The old country. Respect and tradition are everything here.', airTravelCost: 5000, airTravelDuration: 10, trainTravelCost: 1500, trainTravelDuration: 60, drugPriceModifiers: { weed: 0.9, pills: 1.1, cocaine: 1.2, heroin: 1.4 } },
    { id: 'russia', name: 'Russia', description: 'A cold, hard place for cold, hard criminals. The Bratva rule here.', airTravelCost: 7500, airTravelDuration: 12, trainTravelCost: 2200, trainTravelDuration: 90, drugPriceModifiers: { weed: 0.8, pills: 1.5, cocaine: 1.3, heroin: 1.6 } },
    { id: 'china', name: 'China', description: 'The Triads hold immense power in the bustling cities and ports.', airTravelCost: 10000, airTravelDuration: 18, trainTravelCost: 3000, trainTravelDuration: 150, drugPriceModifiers: { weed: 0.7, pills: 0.8, cocaine: 1.6, heroin: 2.0 } },
    { id: 'colombia', name: 'Colombia', description: 'The heart of the cartel operations; a dangerous and lucrative destination.', airTravelCost: 12000, airTravelDuration: 8, trainTravelCost: 4000, trainTravelDuration: 50, drugPriceModifiers: { weed: 1.2, pills: 1.4, cocaine: 0.5, heroin: 1.0 } },
    { id: 'australia', name: 'Australia', description: 'A new frontier for organized crime, far from watchful eyes.', airTravelCost: 15000, airTravelDuration: 22, trainTravelCost: 5500, trainTravelDuration: 180, drugPriceModifiers: { weed: 1.5, pills: 1.3, cocaine: 2.0, heroin: 2.5 } },
    { id: 'japan', name: 'Japan', description: 'The intricate world of the Yakuza, where honor is as sharp as a katana.', airTravelCost: 9000, airTravelDuration: 16, trainTravelCost: 2800, trainTravelDuration: 130, drugPriceModifiers: { weed: 1.1, pills: 1.0, cocaine: 1.8, heroin: 2.2 } },
    { id: 'sweden', name: 'Sweden', description: 'A surprisingly profitable territory for those who can navigate its underworld.', airTravelCost: 6000, airTravelDuration: 9, trainTravelCost: 1800, trainTravelDuration: 70, drugPriceModifiers: { weed: 1.3, pills: 0.9, cocaine: 1.4, heroin: 1.5 } },
];

export const INITIAL_PLAYER: Player = {
  hp: 100,
  stamina: 100,
  maxStamina: 100,
  lastStaminaTimestamp: Date.now(),
  money: 50,
  bank: 0,
  respect: 0,
  criminalXP: 0,
  power: 10,
  rank: RANKS[0].name,
  location: LOCATIONS[0].id,
  inventory: {},
  businesses: [],
  drugs: {
    [LOCATIONS[0].id]: {}
  },
  vehicles: [],
  familyId: null,
  familyName: null,
  familyRole: null,
  jailedUntil: null,
  travelingUntil: null,
  generalCrimeCooldownEnd: null,
  vehicleCrimeCooldownEnd: null,
  heistCooldownEnd: null,
  lastFreeSpinTimestamp: null,
  dailyWheelSpins: 0,
  lastWheelSpinDay: null,
  travelDestination: null,
  travelMode: null,
  skillPoints: 0,
  unlockedSkills: [],
  heists: {},
  mail: [
    {
      id: 'welcome_mail',
      sender: 'System',
      subject: 'Welcome to Empire Of Families',
      body: "Welcome to the city. Your journey to the top of the criminal underworld begins now. This is your private mailbox. You'll receive important messages and updates here. Don't get caught. Good luck.",
      timestamp: Date.now(),
      isRead: false,
    }
  ],
  activeMissionId: MISSIONS[0].id,
  hasViewedActiveMission: false,
  completedMissionIds: [],
  completedUnclaimedMissionId: null,
  landOwned: 0,
  weedPlants: 0,
  lastProductionTimestamp: Date.now(),
  friends: [],
  enemies: [],
  friendRequests: [],
  sentFriendRequests: [],
  sentFamilyJoinRequest: null,
  portfolio: {},
  profileDescription: 'A rising star in the criminal underworld.',
  investigations: [],
  banned: { isBanned: false, reason: '' },
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'brass_knuckles', name: 'Brass Knuckles', description: 'For when a fist isn\'t enough.', power: 5, cost: 200, type: 'Weapon' },
  { id: 'switchblade', name: 'Switchblade', description: 'A classic choice for close encounters.', power: 8, cost: 350, type: 'Weapon' },
  { id: 'lead_pipe', name: 'Lead Pipe', description: 'Simple, effective, and intimidating.', power: 10, cost: 450, type: 'Weapon' },
  { id: 'leather_jacket', name: 'Leather Jacket', description: 'Look tough, take a hit.', power: 12, cost: 600, type: 'Armor' },
  { id: 'pistol_9mm', name: '9mm Pistol', description: 'Standard issue for any serious gangster.', power: 20, cost: 1200, type: 'Weapon' },
  { id: 'shotgun', name: 'Sawed-off Shotgun', description: 'Makes a loud statement.', power: 25, cost: 1800, type: 'Weapon' },
  { id: 'kevlar_vest', name: 'Kevlar Vest', description: 'Stops small caliber rounds.', power: 30, cost: 2500, type: 'Armor' },
  { id: 'molotov', name: 'Molotov Cocktail', description: 'Fire cleanses all.', power: 35, cost: 3000, type: 'Explosive' },
  { id: 'silenced_pistol', name: 'Silenced Pistol', description: 'For quiet work.', power: 45, cost: 4500, type: 'Weapon' },
  { id: 'tommy_gun', name: 'Tommy Gun', description: 'The Chicago Typewriter.', power: 60, cost: 6000, type: 'Weapon' },
  { id: 'sniper_rifle', name: 'Sniper Rifle', description: 'Reach out and touch someone.', power: 75, cost: 8000, type: 'Weapon' },
  { id: 'body_armor', name: 'Body Armor', description: 'Military-grade protection.', power: 80, cost: 10000, type: 'Armor' },
  { id: 'grenade', name: 'Grenade', description: 'Pull pin, throw, problem solved.', power: 100, cost: 12500, type: 'Explosive' },
  { id: 'armored_car', name: 'Armored Car', description: 'Travel in style and safety.', power: 120, cost: 15000, type: 'Special' },
  { id: 'gold_revolver', name: 'Gold-Plated Revolver', description: 'A status symbol that packs a punch.', power: 150, cost: 20000, type: 'Weapon' },
  { id: 'safehouse_network', name: 'Safehouse Network', description: 'Always have a place to lay low.', power: 180, cost: 25000, type: 'Special' },
  { id: 'rpg', name: 'RPG Launcher', description: 'For when you absolutely need it gone.', power: 250, cost: 35000, type: 'Explosive' },
  { id: 'corrupt_politician', name: 'Corrupt Politician', description: 'Legal troubles disappear.', power: 300, cost: 50000, type: 'Special' },
  { id: 'dons_ring', name: 'The Don\'s Ring', description: 'A ring that commands ultimate respect.', power: 400, cost: 75000, type: 'Special' },
  { id: 'offshore_accounts', name: 'Offshore Accounts', description: 'Untouchable money is true power.', power: 500, cost: 100000, type: 'Special' },
];

export const BUSINESSES: Business[] = [
    { id: 'loan_shark', name: 'Loan Sharking Operation', description: 'Lend money at exorbitant rates. A steady, if small, earner.', cost: 75000, incomePerHour: 750, locationId: 'usa' },
    { id: 'illegal_poker', name: 'Illegal Poker Game', description: 'Run a backroom poker game. The house always wins.', cost: 150000, incomePerHour: 1500, locationId: 'usa' },
    { id: 'smuggling_ring', name: 'Smuggling Ring', description: 'Import and distribute contraband goods across the city.', cost: 350000, incomePerHour: 3800, locationId: 'colombia' },
    { id: 'protection_racket', name: 'Protection Racket', description: 'Convince local businesses they need your "insurance".', cost: 650000, incomePerHour: 7500, locationId: 'italy' },
    { id: 'illegal_casino', name: 'Illegal Casino', description: 'A full-blown underground casino with slots and table games.', cost: 1250000, incomePerHour: 15000, locationId: 'china' },
    { id: 'counterfeit_ring', name: 'Counterfeit Ring', description: 'Print high-quality fake bills that are hard to distinguish.', cost: 2500000, incomePerHour: 28000, locationId: 'russia' },
    { id: 'casino_usa', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'usa' },
    { id: 'casino_italy', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'italy' },
    { id: 'casino_russia', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'russia' },
    { id: 'casino_colombia', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'colombia' },
    { id: 'casino_australia', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'australia' },
    { id: 'casino_japan', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'japan' },
    { id: 'casino_sweden', name: 'Casino', description: 'A high-stakes casino where fortunes are made and lost. The house always wins.', cost: 2000000, incomePerHour: 22000, locationId: 'sweden' },
];

export const VEHICLES: Vehicle[] = [
    { id: 'rusty_sedan', name: 'Rusty Sedan', description: 'It runs, most of the time. Not flashy, but gets you from A to B.', resaleValue: 500, heistBonus: 1 },
    { id: 'hatchback', name: 'Common Hatchback', description: 'A dime a dozen. Blends into any parking lot.', resaleValue: 1200, heistBonus: 2 },
    { id: 'muscle_car', name: 'Muscle Car', description: 'Loud, fast, and burns a lot of fuel. A real head-turner.', resaleValue: 8000, heistBonus: 5 },
    { id: 'luxury_suv', name: 'Luxury SUV', description: 'The preferred vehicle of soccer moms and mid-level drug dealers.', resaleValue: 25000, heistBonus: 8 },
    { id: 'sports_car', name: 'Exotic Sports Car', description: 'Sleek, powerful, and screams "I have more money than sense".', resaleValue: 100000, heistBonus: 12 },
    { id: 'armored_limo', name: 'Armored Limo', description: 'Bulletproof glass and reinforced plating. For the truly paranoid.', resaleValue: 250000, heistBonus: 20 },
];

export const VEHICLE_CRIMES: VehicleCrime[] = [
    {
        id: 'steal_beater',
        type: 'vehicle',
        name: 'Steal a Beater',
        description: 'Find an unlocked, beat-up car in a back alley and hotwire it.',
        rankRequired: 'Picciotto',
        cooldown: 180, // 3 minutes
        difficulty: 'Low',
        targetVehicleId: 'rusty_sedan',
    },
    {
        id: 'boost_hatchback',
        type: 'vehicle',
        name: 'Boost a Hatchback',
        description: 'Snatch a common car from a shopping mall parking lot.',
        rankRequired: 'Enforcer',
        cooldown: 300, // 5 minutes
        difficulty: 'Low',
        targetVehicleId: 'hatchback',
    },
    {
        id: 'jack_muscle_car',
        type: 'vehicle',
        name: 'Jack a Muscle Car',
        description: 'Wait for a loud muscle car to stop at a red light and take it.',
        rankRequired: 'Made Man',
        cooldown: 900, // 15 minutes
        difficulty: 'Medium',
        targetVehicleId: 'muscle_car',
    },
    {
        id: 'heist_luxury_suv',
        type: 'vehicle',
        name: 'Heist a Luxury SUV',
        description: 'Break into a rich suburban garage and make off with their prized SUV.',
        rankRequired: 'Capodecina',
        cooldown: 1800, // 30 minutes
        difficulty: 'High',
        targetVehicleId: 'luxury_suv',
    },
    {
        id: 'grand_theft_auto',
        type: 'vehicle',
        name: 'Grand Theft Auto',
        description: 'Perform a high-speed carjacking on a rare, imported sports car.',
        rankRequired: 'Street Boss',
        cooldown: 3600, // 1 hour
        difficulty: 'High',
        targetVehicleId: 'sports_car',
    },
     {
        id: 'secure_armored_limo',
        type: 'vehicle',
        name: 'Acquire an Armored Limo',
        description: 'Ambush a diplomat\'s motorcade to seize their armored limousine.',
        rankRequired: 'Don',
        cooldown: 7200, // 2 hours
        difficulty: 'Extreme',
        targetVehicleId: 'armored_limo',
    },
];

export const CRIMES: Crime[] = [
  // Petty Theft
  {
    id: 'pickpocket',
    name: 'Pickpocket a Tourist',
    description: 'Light fingers in a crowded square. Low risk, low reward.',
    rankRequired: 'Thug',
    cooldown: 15, // 15 seconds
    difficulty: 'Low',
    moneyRange: [10, 50],
    category: 'Petty Theft',
    healthCost: 1,
  },
  {
    id: 'steal_bicycle',
    name: 'Steal a Bicycle',
    description: 'Snip a lock and ride away. A bit more noticeable than pickpocketing.',
    rankRequired: 'Thug',
    cooldown: 20, // 20 seconds
    difficulty: 'Low',
    moneyRange: [25, 75],
    category: 'Petty Theft',
    healthCost: 1,
  },
  {
    id: 'break_into_car',
    name: 'Break into a Car',
    description: 'Smash a window and grab whatever is inside. Quick, but noisy.',
    rankRequired: 'Picciotto',
    cooldown: 45, // 45 seconds
    difficulty: 'Low',
    moneyRange: [50, 200],
    category: 'Petty Theft',
    healthCost: 2,
  },
  {
    id: 'package_poaching',
    name: 'Package Poaching',
    description: 'Grab a package from a porch before anyone notices.',
    rankRequired: 'Picciotto',
    cooldown: 30, // 30 seconds
    difficulty: 'Low',
    moneyRange: [40, 150],
    category: 'Petty Theft',
    healthCost: 1,
  },
  {
    id: 'shoplifting',
    name: 'Shoplifting',
    description: 'Lift some high-value items from a department store.',
    rankRequired: 'Soldato',
    cooldown: 60, // 1 minute
    difficulty: 'Low',
    moneyRange: [100, 300],
    category: 'Petty Theft',
    healthCost: 2,
  },

  // Felony
  {
    id: 'rob_store',
    name: 'Rob a Convenience Store',
    description: 'A classic stick-up. More cash, but the clerk might be a hero.',
    rankRequired: 'Enforcer',
    cooldown: 300, // 5 minutes
    difficulty: 'Medium',
    moneyRange: [800, 2500],
    category: 'Felony',
    healthCost: 5,
  },
  {
    id: 'rob_small_bank',
    name: 'Rob a Small Bank',
    description: 'Hit a local branch during off-peak hours. Guards and silent alarms are a real risk.',
    rankRequired: 'Made Man',
    cooldown: 900, // 15 minutes
    difficulty: 'Medium',
    moneyRange: [5000, 15000],
    category: 'Felony',
    healthCost: 8,
  },
  {
    id: 'credit_fraud',
    name: 'Credit Card Fraud',
    description: 'Use stolen credit card numbers for an online shopping spree.',
    rankRequired: 'Capodecina',
    cooldown: 1800, // 30 minutes
    difficulty: 'High',
    moneyRange: [10000, 30000],
    category: 'Felony',
    healthCost: 10,
  },
  {
    id: 'blackmail',
    name: 'Blackmail a Stranger',
    description: 'Dig up some dirt on a random well-to-do person and make them pay for your silence.',
    rankRequired: 'Street Boss',
    cooldown: 2700, // 45 minutes
    difficulty: 'High',
    moneyRange: [25000, 75000],
    category: 'Felony',
    healthCost: 10,
  },
   {
    id: 'street_drug_deal',
    name: 'Organize a Drug Deal',
    description: 'Set up a back-alley deal for a large shipment. Watch out for undercover cops and rival gangs.',
    rankRequired: 'Collector',
    cooldown: 600, // 10 minutes
    difficulty: 'Medium',
    moneyRange: [3000, 9000],
    category: 'Felony',
    healthCost: 6,
  },

  // Operations
  {
    id: 'rob_national_bank',
    name: 'Rob the National Bank',
    description: 'The big one. A full-scale assault on the city\'s most secure vault. A legendary score if you pull it off.',
    rankRequired: 'Consigliere',
    cooldown: 3600, // 1 hour
    difficulty: 'Extreme',
    moneyRange: [500000, 2500000],
    category: 'Operations',
    healthCost: 20,
  },
  {
    id: 'kidnap_politician',
    name: 'Kidnap a Politician',
    description: 'Grab a high-profile public figure and demand a hefty ransom. The entire city will be looking for you.',
    rankRequired: 'Boss',
    cooldown: 7200, // 2 hours
    difficulty: 'Extreme',
    moneyRange: [1000000, 5000000],
    category: 'Operations',
    healthCost: 25,
  },
  {
    id: 'influence_stockmarket',
    name: 'Influence the Stock Market',
    description: 'Use a combination of hacking and insider information to manipulate a stock for massive profit.',
    rankRequired: 'Godfather',
    cooldown: 10800, // 3 hours
    difficulty: 'Extreme',
    moneyRange: [2000000, 10000000],
    category: 'Operations',
    healthCost: 15,
  },
];