

export type FamilyRole = 'Don' | 'Consigliere' | 'Caporegime' | 'Soldato';

export interface ChatMessage {
  id: string;
  senderId: string; // 'player' or a mock user ID
  senderName: string;
  message: string;
  timestamp: number;
  channel: 'global' | 'local' | 'family';
  locationId?: string; // For local chat
  familyName?: string; // For family chat
  isSystemMessage?: boolean;
}

export interface Territory {
  id: string;
  name: string;
  locationId: string;
  influence: number;
  maxInfluence: number;
  controllingFamilyId: string | null;
  bonus: {
    type: 'BUSINESS_INCOME' | 'CRIME_SUCCESS' | 'XP_GAIN' | 'HEIST_SUCCESS' | 'CASINO_LOSS_CUT' | 'DRUG_PRODUCTION';
    value: number;
  };
}

export interface MockUser {
  id: string;
  name: string;
  rank: string;
  power: number;
  respect: number;
  familyName: string | null;
  role: FamilyRole | null;
  money: number;
  landOwned: number;
  friends: string[];
  enemies: string[];
  friendRequests: FriendRequest[];
  sentFriendRequests: string[];
  locationId: string;
  isNpc?: boolean;
  jailedUntil: number | null;
  banned?: { isBanned: boolean; reason: string; };
}

export interface AttackOutcome {
  playerWon: boolean;
  moneyExchanged: number;
  playerHealthLost: number;
  targetHealthLost: number;
}


export interface Mission {
  id:string;
  title: string;
  description: string;
  objective: string;
  type: 'COMMIT_ANY_CRIME' | 'STEAL_ANY_VEHICLE' | 'WIN_ODDS_OR_EVENS' | 'BUY_ANY_BUSINESS' | 'SMUGGLE_ANY_DRUG' | 'OPEN_BANK' | 'DEPOSIT_MONEY' | 'BUY_ANY_ITEM' | 'VIEW_SKILLS' | 'TRAVEL_ANYWHERE';
  nextMissionId?: string; // Optional ID of the mission that follows
  reward: { money: number; xp: number; };
}

export interface MailMessage {
  id: string;
  sender: string;
  recipient?: string;
  subject: string;
  body: string;
  timestamp: number;
  isRead: boolean;
}

export interface MembershipRequest {
  fromUserId: string;
  fromUserName: string;
  fromUserPower: number;
}

export interface FriendRequest {
  fromUserId: string;
  fromUserName: string;
}

export interface Family {
  id: string;
  name: string;
  donId: string; // Player ID of the founder
  description: string;
  bank: number;
  totalPower: number;
  membershipRequests: MembershipRequest[];
  allies: string[];
  rivals: string[];
}

export interface PlayerVehicle {
    id: string; // Unique instance ID for this specific car
    vehicleId: string; // ID of the base vehicle type (from VEHICLES constant)
    condition: number; // In percentage, 20-100
}

export interface HeistStageOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  successBonus: number;
  failureBonus: number;
}

export interface HeistStage {
  id: string;
  name: string;
  description: string;
  cost?: number; // Only for execution stage
  options?: HeistStageOption[];
}

export interface Heist {
  id: string;
  name: string;
  description: string;
  minRank: string;
  stages: HeistStage[];
  finalReward: {
    money: [number, number];
    xp: [number, number];
  };
}

export interface FinalHeistOutcome {
  success: boolean;
  narrative: string;
  moneyGained: number;
  xpGained: number;
}


export interface PlayerHeistProgress {
  heistId: string;
  lastHeistOutcome: FinalHeistOutcome | null;
}

export interface Skill {
    id: string;
    name: string;
    description: string;
    cost: number; // skill points
    dependencies: string[]; // ids of skills required before this one
    effect: {
        type: 'CRIME_SUCCESS' | 'CRIME_SUCCESS_LOW' | 'CRIME_SUCCESS_MEDIUM' | 'BUSINESS_INCOME' | 'XP_GAIN' | 'GAMBLE_PAYOUT' | 'HEIST_SUCCESS' | 'MAX_STAMINA' | 'STAMINA_REGEN_RATE' | 'ATTACK_STAMINA_COST' | 'DRUG_PRODUCTION';
        value: number; 
    };
}

export interface SkillBranch {
    id: 'mastermind' | 'enforcer' | 'grifter' | 'brawler';
    name: string;
    description: string;
    skills: Skill[];
}

export interface Stock {
  id: string;
  name: string;
  description: string;
  initialPrice: number;
  volatility: number; // e.g. 0.05 for 5% max change per tick
}

export type StockState = Stock & {
    price: number;
    change: number; // Percentage change from last tick
    priceHistory: number[];
};

export interface Investigation {
    targetUserName: string;
    reportDueTimestamp: number;
}

export interface Player {
  hp: number;
  stamina: number;
  maxStamina: number;
  lastStaminaTimestamp: number;
  money: number;
  bank: number;
  respect: number;
  criminalXP: number;
  power: number;
  rank: string;
  location: string; // ID of current location
  inventory: { [itemId: string]: number }; // Maps item ID to quantity
  businesses: string[]; // IDs of purchased businesses
  drugs: { [locationId: string]: { [drugId: string]: number } }; // quantity of each drug per location
  vehicles: PlayerVehicle[]; // Each vehicle is a unique object with its own condition
  familyId: string | null;
  familyName: string | null;
  familyRole: FamilyRole | null;
  
  // Timers & Cooldowns
  jailedUntil: number | null; // Timestamp until which the player is jailed
  travelingUntil: number | null; // Timestamp until arrival
  generalCrimeCooldownEnd: number | null;
  vehicleCrimeCooldownEnd: number | null;
  heistCooldownEnd: number | null;
  lastFreeSpinTimestamp: number | null;
  dailyWheelSpins: number;
  lastWheelSpinDay: string | null; // YYYY-MM-DD

  travelDestination: string | null; // Destination location ID
  travelMode: 'air' | 'train' | null;
  skillPoints: number;
  unlockedSkills: string[];
  heists: { [heistId: string]: PlayerHeistProgress };
  mail: MailMessage[];
  activeMissionId: string | null;
  hasViewedActiveMission: boolean;
  completedMissionIds: string[];
  completedUnclaimedMissionId: string | null;
  landOwned: number;
  weedPlants: number;
  lastProductionTimestamp: number;
  friends: string[];
  enemies: string[];
  friendRequests: FriendRequest[];
  sentFriendRequests: string[];
  sentFamilyJoinRequest: string | null;
  portfolio: { [stockId: string]: number }; // Maps stock ID to quantity of shares
  profileDescription: string;
  investigations: Investigation[];
  banned?: { isBanned: boolean; reason: string; };
}

export interface Crime {
  id: string;
  name:string;
  description: string;
  rankRequired: string;
  cooldown: number; // in seconds
  difficulty: 'Low' | 'Medium' | 'High' | 'Extreme';
  moneyRange: [number, number];
  category: 'Petty Theft' | 'Felony' | 'Operations';
  healthCost: number;
}

export interface Vehicle {
    id:string;
    name: string;
    description: string;
    resaleValue: number;
    heistBonus: number;
}

export interface VehicleCrime {
    id: string;
    type: 'vehicle';
    name: string;
    description: string;
    rankRequired: string;
    cooldown: number; // in seconds
    difficulty: 'Low' | 'Medium' | 'High' | 'Extreme';
    targetVehicleId: string;
}

export interface GameEvent {
  id: number;
  type: 'system' | 'crime' | 'heist' | 'war';
  message: string;
  outcome?: 'success' | 'failure';
}

export interface CrimeOutcome {
  success: boolean;
  moneyGained: number;
  xpGained: number;
  healthLost: number;
  narrative: string;
  jailed: boolean;
}

export interface HeistStageOutcome {
  narrative: string;
}

export interface VehicleCrimeOutcome {
    success: boolean;
    xpGained: number;
    healthLost: number;
    narrative: string;
    vehicleGained: { vehicleId: string, condition: number } | null;
}

export interface SmugglingMethod {
  id: string;
  name: string;
  description: string;
  costMultiplier: number; // e.g., 0.1 means 10% of drug value per unit
  successBonus: number; // e.g., 15 means +15% success chance
}

export interface SmugglingOutcome {
  success: boolean;
  narrative: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  power: number;
  cost: number;
  type: 'Weapon' | 'Armor' | 'Special' | 'Explosive';
}

export interface Business {
  id: string;
  name: string;
  description: string;
  cost: number;
  incomePerHour: number;
  locationId: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  airTravelCost: number;
  airTravelDuration: number; // in minutes
  trainTravelCost: number;
  trainTravelDuration: number; // in minutes
  drugPriceModifiers: { [drugId: string]: number };
}

export interface Drug {
  id: string;
  name: string;
  basePrice: number;
}

export interface WheelFortuneOutcome {
  prizeType: 'money' | 'xp' | 'respect' | 'drug' | 'vehicle' | 'nothing';
  narrative: string;
  moneyGained: number;
  xpGained: number;
  respectGained: number;
  drugsGained: { drugId: string, quantity: number } | null;
  vehicleGained: { vehicleId: string, condition: number } | null;
}
