import { Crime, Player, VehicleCrime } from '../types';
import { RANKS, VEHICLES } from '../constants';

// For General Crimes
export const crimeDifficultyPowerMap: { [key in Crime['difficulty']]: number } = {
    'Low': 50,
    'Medium': 500,
    'High': 2500,
    'Extreme': 10000,
};

export const crimeBaseChanceMap: { [key in Crime['difficulty']]: number } = {
    'Low': 85,
    'Medium': 70,
    'High': 55,
    'Extreme': 40,
};

export const crimeDifficultyRewardMap: { [key in Crime['difficulty']]: number } = {
    'Low': 100,
    'Medium': 6000,
    'High': 50000,
    'Extreme': 2000000,
};

export const calculateCrimeSuccessChance = (crime: Crime, player: Player, skillBonus: number): number => {
    const playerRankIndex = RANKS.findIndex(r => r.name === player.rank);
    const crimeRankIndex = RANKS.findIndex(r => r.name === crime.rankRequired);

    const rankDifference = playerRankIndex - crimeRankIndex;
    const rankBonus = rankDifference * 5;

    const crimePowerBaseline = crimeDifficultyPowerMap[crime.difficulty];
    const powerRatio = player.power / crimePowerBaseline;
    
    const powerBonus = (powerRatio >= 1) 
        ? Math.min(25, (powerRatio - 1) * 20)
        : (powerRatio - 1) * 30;
    
    const averageReward = (crime.moneyRange[0] + crime.moneyRange[1]) / 2;
    const rewardBaseline = crimeDifficultyRewardMap[crime.difficulty];
    const rewardModifier = (rewardBaseline - averageReward) / 10;

    const baseChance = crimeBaseChanceMap[crime.difficulty];
    const totalChance = baseChance + rankBonus + powerBonus + skillBonus + rewardModifier;

    return Math.floor(Math.max(5, Math.min(95, totalChance)));
};

// For Vehicle Crimes
export const vehicleDifficultyPowerMap: { [key in VehicleCrime['difficulty']]: number } = {
    'Low': 50,
    'Medium': 500,
    'High': 2500,
    'Extreme': 10000,
};

export const vehicleBaseChanceMap: { [key in VehicleCrime['difficulty']]: number } = {
    'Low': 85,
    'Medium': 70,
    'High': 55,
    'Extreme': 40,
};

export const vehicleDifficultyValueMap: { [key in VehicleCrime['difficulty']]: number } = {
    'Low': 1000,
    'Medium': 8000,
    'High': 60000,
    'Extreme': 250000,
};

export const calculateVehicleCrimeSuccessChance = (crime: VehicleCrime, player: Player, skillBonus: number): number => {
    const playerRankIndex = RANKS.findIndex(r => r.name === player.rank);
    const crimeRankIndex = RANKS.findIndex(r => r.name === crime.rankRequired);

    const rankDifference = playerRankIndex - crimeRankIndex;
    const rankBonus = rankDifference * 5;

    const crimePowerBaseline = vehicleDifficultyPowerMap[crime.difficulty];
    const powerRatio = player.power / crimePowerBaseline;
    
    const powerBonus = (powerRatio >= 1) 
        ? Math.min(25, (powerRatio - 1) * 20)
        : (powerRatio - 1) * 30;
    
    const targetVehicle = VEHICLES.find(v => v.id === crime.targetVehicleId);
    const vehicleValue = targetVehicle?.resaleValue || 0;
    const valueBaseline = vehicleDifficultyValueMap[crime.difficulty];
    const valueModifier = (valueBaseline - vehicleValue) / 200;

    const baseChance = vehicleBaseChanceMap[crime.difficulty];
    const totalChance = baseChance + rankBonus + powerBonus + skillBonus + valueModifier;

    return Math.floor(Math.max(5, Math.min(95, totalChance)));
};
