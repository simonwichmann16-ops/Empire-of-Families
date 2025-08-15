

import React, { useState, useEffect, useCallback } from 'react';
import * as userService from './services/userService';
import { Player, Crime, GameEvent, ShopItem, Business, Location, CrimeOutcome, Drug, SmugglingOutcome, VehicleCrime, VehicleCrimeOutcome, WheelFortuneOutcome, Family, PlayerVehicle, Heist, HeistStage, Skill, SkillBranch, Mission, MockUser, SmugglingMethod, FinalHeistOutcome, AttackOutcome, PlayerHeistProgress, HeistStageOption, Territory, ChatMessage, FamilyRole, MailMessage, FriendRequest, MembershipRequest, StockState, Stock, Investigation } from './types';
import { INITIAL_PLAYER, CRIMES, RANKS, SHOP_ITEMS, BUSINESSES, LOCATIONS as LOCATIONS_DATA, DRUGS, VEHICLE_CRIMES, VEHICLES, FAMILY_CREATION_COST, REPAIR_COST_FACTOR, REPAIR_RISK_PERCENTAGE, JAIL_TIME_SECONDS, HEISTS, SKILL_TREE, HEAL_COST_PER_HP, MISSIONS, PRODUCTION_CYCLE_MS, MOCK_USERS, TERRITORIES, STOCKS, RANK_LAND_CAPS, LAND_COST_PER_M3, WEED_PRODUCTION_PER_M3_PER_DAY, PLANT_COST_PER_M3, INVESTIGATOR_COST, INVESTIGATOR_MIN_HOURS, INVESTIGATOR_MAX_HOURS } from './constants';
import { generateCrimeOutcome, generateSmugglingOutcome, generateVehicleCrimeOutcome, generateWheelSpinOutcome, generateFinalHeistOutcome, generateTurfWarNews, generateFamilyNews } from './services/geminiService';
import { calculateCrimeSuccessChance } from './utils/crimeCalculations';
import { calculateVehicleCrimeSuccessChance } from './utils/crimeCalculations';
import PlayerStats from './components/PlayerStats';
import LogFeed from './components/LogFeed';
import Loader from './components/Loader';
import ShopModal from './components/ShopModal';
import RankModal from './components/RankModal';
import BusinessModal from './components/BusinessModal';
import CrimeModal from './components/CrimeModal';
import VehicleCrimeModal from './components/VehicleCrimeModal';
import TravelModal from './components/TravelModal';
import DrugsModal from './components/DrugsModal';
import ProfileModal from './components/ProfileModal';
import BankModal from './components/BankModal';
import LoginScreen from './components/LoginScreen';
import GameClock from './components/GameClock';
import GarageModal from './components/GarageModal';
import OddsOrEvensModal from './components/OddsOrEvensModal';
import HigherOrLowerModal from './components/HigherOrLowerModal';
import WheelOfFortuneModal from './components/WheelOfFortuneModal';
import CreateFamilyModal from './components/CreateFamilyModal';
import JailedNotification from './components/JailedNotification';
import TravelNotification from './components/TravelNotification';
import ActivityPanel from './components/ActivityPanel';
import HeistModal from './components/HeistModal';
import SkillsModal from './components/SkillsModal';
import MailModal from './components/MailModal';
import HospitalModal from './components/HospitalModal';
import MissionsModal from './components/MissionsModal';
import PowerModal from './components/PowerModal';
import PropertiesModal from './components/PropertiesModal';
import ProductionModal from './components/ProductionModal';
import OnlineUsersModal from './components/OnlineUsersModal';
import UserProfileModal from './components/UserProfileModal';
import FamilyListModal from './components/FamilyListModal';
import AttackModal from './components/AttackModal';
import FamilyProfileModal from './components/FamilyProfileModal';
import MyFamilyModal from './components/MyFamilyModal';
import CityMapModal from './components/CityMapModal';
import Chatbox from './components/Chatbox';
import MessageModal from './components/MessageModal';
import FriendsModal from './components/FriendsModal';
import SuccessAnimation from './components/SuccessAnimation';
import FailureAnimation from './components/FailureAnimation';
import PrisonModal from './components/PrisonModal';
import CommunityPanel from './components/CommunityPanel';
import CrimesPanel from './components/CrimesPanel';
import LocationsPanel from './components/LocationsPanel';
import OperationsPanel from './components/OperationsPanel';
import CasinoPanel from './components/CasinoPanel';
import ArrivalNotification from './components/ArrivalNotification';
import FaqModal from './components/FaqModal';
import RulesModal from './components/RulesModal';
import BanConfirmationModal from './components/BanConfirmationModal';


export default function App(): React.ReactNode {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});
  const [gameLog, setGameLog] = useState<GameEvent[]>([
    {
      id: Date.now(),
      type: 'system',
      message: 'Welcome to Empire Of Families. Make a name for yourself.',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRankModalOpen, setIsRankModalOpen] = useState<boolean>(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState<boolean>(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);
  const [isCrimeModalOpen, setIsCrimeModalOpen] = useState<boolean>(false);
  const [isVehicleCrimeModalOpen, setIsVehicleCrimeModalOpen] = useState<boolean>(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState<boolean>(false);
  const [isDrugsModalOpen, setIsDrugsModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState<boolean>(false);
  const [isOddsOrEvensModalOpen, setIsOddsOrEvensModalOpen] = useState<boolean>(false);
  const [isHigherOrLowerModalOpen, setIsHigherOrLowerModalOpen] = useState<boolean>(false);
  const [isWheelOfFortuneModalOpen, setIsWheelOfFortuneModalOpen] = useState<boolean>(false);
  const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState<boolean>(false);
  const [isFamilyListModalOpen, setIsFamilyListModalOpen] = useState<boolean>(false);
  const [isHeistModalOpen, setIsHeistModalOpen] = useState<boolean>(false);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState<boolean>(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState<boolean>(false);
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState<boolean>(false);
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState<boolean>(false);
  const [isPowerModalOpen, setIsPowerModalOpen] = useState<boolean>(false);
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState<boolean>(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState<boolean>(false);
  const [isOnlineUsersModalOpen, setIsOnlineUsersModalOpen] = useState<boolean>(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState<boolean>(false);
  const [isPrisonModalOpen, setIsPrisonModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  
  const [locations, setLocations] = useState<Location[]>(LOCATIONS_DATA);
  const [onlineUsers, setOnlineUsers] = useState<MockUser[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [territories, setTerritories] = useState<Territory[]>(TERRITORIES);
  
  const [isCityMapModalOpen, setIsCityMapModalOpen] = useState<boolean>(false);
  const [isFamilyProfileModalOpen, setIsFamilyProfileModalOpen] = useState<boolean>(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isAttackModalOpen, setIsAttackModalOpen] = useState<boolean>(false);
  const [attackTarget, setAttackTarget] = useState<MockUser | null>(null);
  const [attackOutcome, setAttackOutcome] = useState<AttackOutcome | null>(null);
  const [isMyFamilyModalOpen, setIsMyFamilyModalOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [messageRecipient, setMessageRecipient] = useState<MockUser | null>(null);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState<boolean>(false);
  const [stocks, setStocks] = useState<StockState[]>(STOCKS.map(s => ({ ...s, price: s.initialPrice, change: 0, priceHistory: [s.initialPrice] })));
  const [justLoggedIn, setJustLoggedIn] = useState<boolean>(false);
  const [actionOutcome, setActionOutcome] = useState<'success' | 'failure' | null>(null);
  const [arrivalNotification, setArrivalNotification] = useState<string | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isBanConfirmModalOpen, setIsBanConfirmModalOpen] = useState<boolean>(false);
  const [banTargetUser, setBanTargetUser] = useState<MockUser | null>(null);


  const isJailed = player.jailedUntil !== null && player.jailedUntil > Date.now();
  const isTraveling = player.travelingUntil !== null && player.travelingUntil > Date.now();
  const isBusy = isLoading || isJailed || isTraveling;
  
  useEffect(() => {
    const userSession = userService.getLoggedInUser();
    if (userSession) {
      setPlayer(userSession.player);
      setCurrentUser(userSession.username);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
        const allRegistered = userService.getAllRegisteredUsers(currentUser);
        setOnlineUsers(allRegistered);
    } else {
        setOnlineUsers([]);
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      userService.save(currentUser, player);
    }
  }, [player, currentUser, isAuthenticated]);

  const handleLoginSuccess = (playerData: Player, username: string) => {
    userService.setLoggedInUser(username);
    setPlayer(playerData);
    setCurrentUser(username);
    setIsAuthenticated(true);
    addLog('system', `Welcome back, ${username}.`);
    setJustLoggedIn(true);
  };

  const handleLogout = () => {
    userService.logout();
    setCurrentUser(null);
    setPlayer(INITIAL_PLAYER);
    setIsAuthenticated(false);
  };

  const addLog = useCallback((type: GameEvent['type'], message: string, outcome?: 'success' | 'failure'): void => {
    setGameLog(prevLog => [{ id: Date.now(), type, message, outcome }, ...prevLog.slice(0, 100)]);
  }, []);
  
  // Initialize and update families from user data
  useEffect(() => {
    const familyData = onlineUsers.reduce((acc, user) => {
        if (user.familyName) {
            if (!acc[user.familyName]) {
                acc[user.familyName] = { members: [], totalPower: 0 };
            }
            acc[user.familyName].members.push(user);
            acc[user.familyName].totalPower += user.power;
        }
        return acc;
    }, {} as { [key: string]: { members: MockUser[], totalPower: number } });

    const updatedFamilies = Object.entries(familyData).map(([name, data]) => {
        const existingFamily = families.find(f => f.name === name);
        const don = data.members.find(m => m.role === 'Don') || data.members.sort((a, b) => b.power - a.power)[0];
        
        return {
            id: existingFamily?.id || `family_${name.replace(/\s+/g, '')}`,
            name: name,
            donId: don.id,
            description: existingFamily?.description || `A powerful family known for their influence.`,
            bank: existingFamily?.bank || Math.floor(Math.random() * 500000) + 50000,
            totalPower: data.totalPower,
            membershipRequests: existingFamily?.membershipRequests || [],
            allies: existingFamily?.allies || [],
            rivals: existingFamily?.rivals || [],
        };
    });
    setFamilies(updatedFamilies);
  }, [onlineUsers]); // Rerun if onlineUsers changes


  const getBonus = useCallback((type: Skill['effect']['type'] | Territory['bonus']['type'], locationId?: string): number => {
    const skillBonus = player.unlockedSkills.reduce((total, skillId) => {
        for (const branch of SKILL_TREE) {
            const skill = branch.skills.find(s => s.id === skillId);
            if (skill && skill.effect.type === type) {
                return total + skill.effect.value;
            }
        }
        return total;
    }, 0);

    let territoryBonus = 0;
    if (player.familyName && locationId) {
        const myFamily = families.find(f => f.name === player.familyName);
        if (myFamily) {
            const controlledTerritories = territories.filter(t => 
                t.controllingFamilyId === myFamily.id &&
                t.locationId === locationId &&
                t.bonus.type === type
            );
            territoryBonus = controlledTerritories.reduce((sum, t) => sum + t.bonus.value, 0);
        }
    }
    
    return skillBonus + territoryBonus;
}, [player.unlockedSkills, player.familyName, families, territories]);
  
  // Effect to re-render when timers are over
  useEffect(() => {
    const nextEventTime = Math.min(
      player.jailedUntil || Infinity,
      player.travelingUntil || Infinity,
      player.generalCrimeCooldownEnd || Infinity,
      player.vehicleCrimeCooldownEnd || Infinity,
      player.heistCooldownEnd || Infinity
    );

    if (nextEventTime !== Infinity && nextEventTime > Date.now()) {
      const timer = setTimeout(() => {
        setPlayer(p => ({ ...p })); // Trigger a re-render
      }, nextEventTime - Date.now() + 100);
      return () => clearTimeout(timer);
    }
  }, [player]);

  // Handle travel arrival
  useEffect(() => {
    if (player.travelingUntil && player.travelingUntil <= Date.now()) {
        const destination = locations.find(l => l.id === player.travelDestination);
        if(destination) {
            addLog('system', `You have arrived in ${destination.name}.`, 'success');
            setArrivalNotification(destination.name);
            setTimeout(() => setArrivalNotification(null), 2600);
            setPlayer(p => {
                const newDrugs = JSON.parse(JSON.stringify(p.drugs));
                if (!newDrugs[destination!.id]) {
                    newDrugs[destination!.id] = {};
                }
                return {
                    ...p,
                    location: destination.id,
                    travelingUntil: null,
                    travelDestination: null,
                    travelMode: null,
                    drugs: newDrugs,
                }
            });
        }
    }
  }, [player.travelingUntil, player.travelDestination, addLog, locations]);

  // Rank up check
  useEffect(() => {
    const currentRankIndex = RANKS.findIndex(r => r.name === player.rank);
    const nextRank = RANKS[currentRankIndex + 1];
    
    if (nextRank && player.criminalXP >= nextRank.xpThreshold) {
      const awardedSkillPoints = RANKS[currentRankIndex + 1].skillPoints || 0;
      setPlayer(p => ({ 
        ...p, 
        rank: nextRank.name,
        skillPoints: p.skillPoints + awardedSkillPoints
      }));
      let rankUpMessage = `You've been promoted! Your new rank is ${nextRank.name}.`;
      if (awardedSkillPoints > 0) {
        rankUpMessage += ` You gained ${awardedSkillPoints} Skill Point(s)!`;
      }
      addLog('system', rankUpMessage, 'success');
    }
  }, [player.criminalXP, player.rank, addLog]);
  
    // Passive income from businesses
    useEffect(() => {
        const incomeInterval = setInterval(() => {
            if (isBusy) return;
            const ownedBusinesses = BUSINESSES.filter(b => player.businesses.includes(b.id));
            if (ownedBusinesses.length === 0) return;

            const totalIncome = ownedBusinesses.reduce((sum, business) => {
                const incomeBonusPercent = getBonus('BUSINESS_INCOME', business.locationId);
                const finalIncomeForBusiness = Math.round(business.incomePerHour * (1 + incomeBonusPercent / 100));
                return sum + finalIncomeForBusiness;
            }, 0);
            
            setPlayer(p => ({ ...p, money: p.money + totalIncome }));
            if(totalIncome > 0) {
              addLog('system', `Your businesses generated $${totalIncome.toLocaleString()} in hourly revenue.`);
            }

        }, 3600000); // Every hour

        return () => clearInterval(incomeInterval);
    }, [player.businesses, addLog, isBusy, getBonus]);
    
    // Passive drug production
    useEffect(() => {
        const productionInterval = setInterval(() => {
            if (isBusy || player.weedPlants <= 0) return;
            const now = Date.now();
            const timeSinceLastProduction = now - player.lastProductionTimestamp;
            
            if (timeSinceLastProduction >= PRODUCTION_CYCLE_MS) {
                const newDrugs = JSON.parse(JSON.stringify(player.drugs));
                let logMessage = '';

                const productionBoostPercent = getBonus('DRUG_PRODUCTION', player.location);
                const totalOutputPerDay = player.weedPlants * WEED_PRODUCTION_PER_M3_PER_DAY;
                
                const baseProductionAmount = Math.floor(totalOutputPerDay * (timeSinceLastProduction / (24 * 60 * 60 * 1000)));
                const productionAmount = Math.floor(baseProductionAmount * (1 + productionBoostPercent / 100));

                if (productionAmount > 0) {
                    if (!newDrugs[player.location]) newDrugs[player.location] = {};
                    newDrugs[player.location]['weed'] = (newDrugs[player.location]['weed'] || 0) + productionAmount;
                    logMessage += `Your operation produced ${productionAmount} units of Weed. `;
                }

                if (logMessage) {
                    setPlayer(p => ({
                        ...p,
                        drugs: newDrugs,
                        lastProductionTimestamp: now
                    }));
                    addLog('system', logMessage.trim(), 'success');
                } else {
                     setPlayer(p => ({
                        ...p,
                        lastProductionTimestamp: now
                    }));
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(productionInterval);
    }, [player.weedPlants, player.lastProductionTimestamp, player.location, addLog, isBusy, getBonus]);
    
    // Passive stamina regeneration
    useEffect(() => {
        const staminaInterval = setInterval(() => {
            if (isBusy) return;
            setPlayer(p => {
                const maxStamina = p.maxStamina + getBonus('MAX_STAMINA');
                if (p.stamina >= maxStamina) {
                    return p.lastStaminaTimestamp !== Date.now() ? {...p, lastStaminaTimestamp: Date.now() } : p;
                }

                const now = Date.now();
                const secondsPassed = (now - p.lastStaminaTimestamp) / 1000;
                
                const regenRateBonus = getBonus('STAMINA_REGEN_RATE');
                const baseRegenPerSecond = 1 / 100; // 1 every 100 seconds
                const finalRegenPerSecond = baseRegenPerSecond * (1 + regenRateBonus / 100);

                const staminaGained = Math.floor(secondsPassed * finalRegenPerSecond);

                if (staminaGained > 0) {
                    const newStamina = Math.min(maxStamina, p.stamina + staminaGained);
                    return {
                        ...p,
                        stamina: newStamina,
                        lastStaminaTimestamp: now
                    };
                }
                return p;
            });
        }, 10000); // Check every 10 seconds

        return () => clearInterval(staminaInterval);
    }, [isBusy, getBonus]);

    // Fluctuating drug prices effect
    useEffect(() => {
        const priceInterval = setInterval(() => {
        setLocations(currentLocations => 
            currentLocations.map(location => {
            const newModifiers = { ...location.drugPriceModifiers };
            for (const drugId in newModifiers) {
                const fluctuation = (Math.random() - 0.5) * 0.1; // +/- 5%
                newModifiers[drugId] = Math.max(0.5, Math.min(2.5, newModifiers[drugId] * (1 + fluctuation)));
            }
            return { ...location, drugPriceModifiers: newModifiers };
            })
        );
        addLog('system', 'The word on the street is that drug prices have shifted across the globe.');
        }, 3600000); // every hour

        return () => clearInterval(priceInterval);
    }, [addLog]);

    // Stock market price fluctuations
    useEffect(() => {
        const stockInterval = setInterval(() => {
            setStocks(currentStocks => 
                currentStocks.map(stock => {
                    const changePercent = (Math.random() - 0.5) * 2 * stock.volatility;
                    const newPrice = Math.max(1, stock.price * (1 + changePercent)); // Prevent stocks from being free
                    const newHistory = [...stock.priceHistory, newPrice].slice(-50); // Keep last 50 prices
                    return {
                        ...stock,
                        price: newPrice,
                        change: (newPrice / stock.price) - 1,
                        priceHistory: newHistory,
                    };
                })
            );
        }, 30000); // every 30 seconds

        return () => clearInterval(stockInterval);
    }, []);
    
    // Investigation check effect
  useEffect(() => {
    const investigationInterval = setInterval(() => {
        if (player.investigations.length === 0) return;

        const now = Date.now();
        const completedInvestigations = player.investigations.filter(inv => inv.reportDueTimestamp <= now);

        if (completedInvestigations.length > 0) {
            let newMail: MailMessage[] = [];
            let remainingInvestigations = [...player.investigations];

            for (const investigation of completedInvestigations) {
                const targetUser = onlineUsers.find(u => u.name.toLowerCase() === investigation.targetUserName.toLowerCase());
                const targetLocation = targetUser ? LOCATIONS_DATA.find(l => l.id === targetUser.locationId)?.name : 'Unknown (user went off-grid)';
                
                const report: MailMessage = {
                    id: `pi_report_${Date.now()}_${investigation.targetUserName}`,
                    sender: 'Private Investigator',
                    subject: `Intel on: ${investigation.targetUserName}`,
                    body: `Our operative has concluded their surveillance.\n\nTarget: ${investigation.targetUserName}\nCurrent Location: ${targetLocation}\n\nOur services are concluded. Burn this message.`,
                    timestamp: now,
                    isRead: false,
                };
                newMail.push(report);
                remainingInvestigations = remainingInvestigations.filter(inv => inv.targetUserName !== investigation.targetUserName);
            }
            
            setPlayer(p => ({
                ...p,
                mail: [...p.mail, ...newMail],
                investigations: remainingInvestigations
            }));
            
            addLog('system', `You have received a new intelligence report in your inbox.`, 'success');
        }

    }, 60000); // Check every minute

    return () => clearInterval(investigationInterval);
  }, [player.investigations, onlineUsers, addLog]);


    const handleSendMessage = (message: string, channel: 'global' | 'local' | 'family') => {
        if (!message.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            senderId: 'player',
            senderName: 'You',
            message: message.trim(),
            timestamp: Date.now(),
            channel,
            ...(channel === 'local' && { locationId: player.location }),
            ...(channel === 'family' && { familyName: player.familyName }),
        };

        setChatMessages(prev => [...prev, newMessage]);
    };

    const completeActiveMissionIfTypeMatches = useCallback((type: Mission['type']) => {
        if (!player.activeMissionId) return;
        const mission = MISSIONS.find(m => m.id === player.activeMissionId);
        if (mission && mission.type === type) {
            setPlayer(p => ({
                ...p,
                activeMissionId: null,
                completedUnclaimedMissionId: mission.id,
            }));
            addLog('system', `Mission Objective Complete: ${mission.title}! Go to your assignments to claim your reward.`, 'success');
        }
    }, [player.activeMissionId, addLog]);

    const handleClaimMissionReward = () => {
        if (!player.completedUnclaimedMissionId) return;

        const mission = MISSIONS.find(m => m.id === player.completedUnclaimedMissionId);
        if (!mission) return;

        setPlayer(p => ({
            ...p,
            money: p.money + mission.reward.money,
            criminalXP: p.criminalXP + mission.reward.xp,
            completedMissionIds: [...p.completedMissionIds, mission.id],
            activeMissionId: mission.nextMissionId || null,
            completedUnclaimedMissionId: null,
            hasViewedActiveMission: false,
        }));
        
        addLog('system', `Reward Claimed for "${mission.title}": You received $${mission.reward.money.toLocaleString()} and ${mission.reward.xp.toLocaleString()} XP.`, 'success');
    };

    const handleOpenMissionsModal = () => {
        setPlayer(p => ({
            ...p,
            hasViewedActiveMission: true
        }));
        setIsMissionsModalOpen(true);
    };

  const handleOpenProfileAndResetLoginState = () => {
    setIsProfileModalOpen(true);
    setJustLoggedIn(false);
  };
  
    const handleOpenBankModal = () => {
        completeActiveMissionIfTypeMatches('OPEN_BANK');
        setIsBankModalOpen(true);
    };

    const handleOpenSkillsModal = () => {
        completeActiveMissionIfTypeMatches('VIEW_SKILLS');
        setIsSkillsModalOpen(true);
    };

  const handleCrime = useCallback(async (crime: Crime) => {
    if (isBusy) return;
    if (player.generalCrimeCooldownEnd && player.generalCrimeCooldownEnd > Date.now()) {
      addLog('system', "You need more time before you can commit another crime. Lay low.");
      return;
    }
    if (player.hp <= crime.healthCost) {
      addLog('system', `You're too weak to attempt this. You need at least ${crime.healthCost + 1} HP.`);
      return;
    }
    
    setIsCrimeModalOpen(false);
    setIsLoading(true);
    addLog('system', `Attempting to ${crime.name.toLowerCase()}...`);

    setPlayer(p => ({...p, hp: p.hp - crime.healthCost}));

    try {
      let crimeSuccessBonus = getBonus('CRIME_SUCCESS', player.location);
      if (crime.difficulty === 'Low') {
          crimeSuccessBonus += getBonus('CRIME_SUCCESS_LOW');
      } else if (crime.difficulty === 'Medium') {
          crimeSuccessBonus += getBonus('CRIME_SUCCESS_MEDIUM');
      }

      const successChance = calculateCrimeSuccessChance(crime, player, crimeSuccessBonus);
      const roll = Math.random() * 100;
      const success = roll < successChance;
      
      const outcomeDetails = await generateCrimeOutcome(crime, player, success);
      const result: CrimeOutcome = { success, ...outcomeDetails };

      const xpGainBonus = getBonus('XP_GAIN', player.location);
      const finalXPGained = Math.round(result.xpGained * (1 + xpGainBonus / 100));

      let logMessage = result.narrative;
      if (result.success) {
          const gains = [];
          if (result.moneyGained > 0) gains.push(`$${result.moneyGained.toLocaleString()}`);
          if (finalXPGained > 0) gains.push(`${finalXPGained} XP`);
          if (gains.length > 0) {
            logMessage += ` You gained ${gains.join(' and ')}.`;
          }
      }
      
      addLog('crime', logMessage, result.success ? 'success' : 'failure');
      setActionOutcome(result.success ? 'success' : 'failure');
      
      if (result.success) {
          completeActiveMissionIfTypeMatches('COMMIT_ANY_CRIME');
      }

      setPlayer(p => ({
        ...p,
        money: p.money + result.moneyGained,
        criminalXP: p.criminalXP + finalXPGained,
        hp: Math.max(0, p.hp - result.healthLost),
        generalCrimeCooldownEnd: Date.now() + crime.cooldown * 1000,
        jailedUntil: result.jailed ? Date.now() + JAIL_TIME_SECONDS * 1000 : p.jailedUntil,
      }));

      if (result.healthLost > 0) {
        addLog('system', `You lost ${result.healthLost} HP during the crime.`);
      }
       if (player.hp - crime.healthCost - result.healthLost <= 0) {
         addLog('system', `You've been knocked out! You wake up at the hospital, your pockets lighter.`);
         setPlayer(p => ({...p, hp: 50, money: Math.floor(p.money * 0.8)}));
       }

    } catch (error) {
      console.error('Gemini API Error:', error);
      addLog('system', 'An unexpected event occurred. You lay low for a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [player, isBusy, addLog, getBonus, completeActiveMissionIfTypeMatches]);

    const handleVehicleCrime = useCallback(async (crime: VehicleCrime) => {
        if (isBusy) return;
        if (player.vehicleCrimeCooldownEnd && player.vehicleCrimeCooldownEnd > Date.now()) {
            addLog('system', "You need more time before you can do that again. Lay low.");
            return;
        }

        setIsVehicleCrimeModalOpen(false);
        setIsLoading(true);
        addLog('system', `Attempting to ${crime.name.toLowerCase()}...`);

        try {
            let crimeSuccessBonus = getBonus('CRIME_SUCCESS', player.location);
            if (crime.difficulty === 'Low') {
                crimeSuccessBonus += getBonus('CRIME_SUCCESS_LOW');
            } else if (crime.difficulty === 'Medium') {
                crimeSuccessBonus += getBonus('CRIME_SUCCESS_MEDIUM');
            }
            const successChance = calculateVehicleCrimeSuccessChance(crime, player, crimeSuccessBonus);
            const roll = Math.random() * 100;
            const success = roll < successChance;

            const outcomeDetails = await generateVehicleCrimeOutcome(crime, player, success);
            const result: VehicleCrimeOutcome = { success, ...outcomeDetails };

            const xpGainBonus = getBonus('XP_GAIN', player.location);
            const finalXPGained = Math.round(result.xpGained * (1 + xpGainBonus / 100));

            let logMessage = result.narrative;
            if (result.success && result.vehicleGained) {
                const vehicleInfo = VEHICLES.find(v => v.id === result.vehicleGained!.vehicleId);
                const gains = [];
                if (vehicleInfo) gains.push(`a ${vehicleInfo.name}`);
                if (finalXPGained > 0) gains.push(`${finalXPGained} XP`);
                if (gains.length > 0) {
                    logMessage += ` You gained ${gains.join(' and ')}.`;
                }
            }

            addLog('crime', logMessage, result.success ? 'success' : 'failure');
            setActionOutcome(result.success ? 'success' : 'failure');
            
            if (result.success) {
                completeActiveMissionIfTypeMatches('STEAL_ANY_VEHICLE');
            }

            setPlayer(p => {
                const newVehicles = [...p.vehicles];
                if (result.success && result.vehicleGained) {
                    newVehicles.push({
                        id: Date.now().toString(),
                        vehicleId: result.vehicleGained.vehicleId,
                        condition: result.vehicleGained.condition
                    });
                }
                return {
                    ...p,
                    criminalXP: p.criminalXP + finalXPGained,
                    hp: Math.max(0, p.hp - result.healthLost),
                    vehicles: newVehicles,
                    vehicleCrimeCooldownEnd: Date.now() + crime.cooldown * 1000,
                    jailedUntil: !result.success ? Date.now() + JAIL_TIME_SECONDS * 1000 : p.jailedUntil,
                };
            });
            
            if (result.healthLost > 0) {
                addLog('system', `You lost ${result.healthLost} HP.`);
            }
            if (player.hp - result.healthLost <= 0) {
                addLog('system', `You've been knocked out! You wake up at the hospital, your pockets lighter.`);
                setPlayer(p => ({...p, hp: 50, money: Math.floor(p.money * 0.8)}));
            }

        } catch (error) {
            console.error('Gemini API Error:', error);
            addLog('system', 'An unexpected event occurred. You lay low for a moment.');
        } finally {
            setIsLoading(false);
        }
    }, [player, isBusy, addLog, getBonus, completeActiveMissionIfTypeMatches]);
    
    const handleSellVehicle = (vehicleInstanceId: string) => {
        if (isBusy) return;

        const vehicleToSell = player.vehicles.find(v => v.id === vehicleInstanceId);
        if (!vehicleToSell) return;

        const vehicleInfo = VEHICLES.find(v => v.id === vehicleToSell.vehicleId);
        if(!vehicleInfo) return;

        const salePrice = Math.round(vehicleInfo.resaleValue * (vehicleToSell.condition / 100));

        setPlayer(p => ({
            ...p,
            money: p.money + salePrice,
            vehicles: p.vehicles.filter(v => v.id !== vehicleInstanceId),
        }));

        addLog('system', `You sold the ${vehicleInfo.name} for $${salePrice.toLocaleString()}.`, 'success');
    };

    const handleRepairVehicle = (vehicleInstanceId: string) => {
        if (isBusy) return;
        const vehicleToRepair = player.vehicles.find(v => v.id === vehicleInstanceId);
        if (!vehicleToRepair || vehicleToRepair.condition === 100) return;

        const vehicleInfo = VEHICLES.find(v => v.id === vehicleToRepair.vehicleId);
        if(!vehicleInfo) return;

        const repairCost = Math.round(vehicleInfo.resaleValue * REPAIR_COST_FACTOR);
        if (player.money < repairCost) {
            addLog('system', "You can't afford the parts to repair this vehicle.");
            return;
        }

        if (Math.random() * 100 < REPAIR_RISK_PERCENTAGE) {
            setPlayer(p => ({
                ...p,
                vehicles: p.vehicles.filter(v => v.id !== vehicleInstanceId),
                jailedUntil: Date.now() + JAIL_TIME_SECONDS * 1000,
            }));
            addLog('crime', `While repairing the ${vehicleInfo.name}, sirens wail! The cops raid your chop shop. The car is confiscated and you're thrown in jail!`, 'failure');
            setIsGarageModalOpen(false);
        } else {
            setPlayer(p => ({
                ...p,
                money: p.money - repairCost,
                vehicles: p.vehicles.map(v => 
                    v.id === vehicleInstanceId ? { ...v, condition: 100 } : v
                ),
            }));
             addLog('system', `You spent $${repairCost.toLocaleString()} and successfully repaired the ${vehicleInfo.name} to mint condition.`, 'success');
        }
    };

    const handleHeal = (amount: number) => {
      if (isBusy || amount <= 0) return;
      const healCost = amount * HEAL_COST_PER_HP;
      if (player.money < healCost) {
          addLog('system', "You can't afford the hospital fees for that treatment.");
          return;
      }
      if (player.hp === 100) {
        addLog('system', "You're already in perfect health.");
        return;
      }

      setPlayer(p => ({...p, hp: Math.min(100, p.hp + amount), money: p.money - healCost}));
      addLog('system', `You paid $${healCost.toLocaleString()} to heal ${amount} HP. You feel better.`);
      setIsHospitalModalOpen(false);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (isBusy) return;
    if (player.money < item.cost) {
      addLog('system', "You don't have enough cash for that.");
      return;
    }

    setPlayer(p => ({
      ...p,
      money: p.money - item.cost,
      power: p.power + item.power,
      inventory: {
        ...p.inventory,
        [item.id]: (p.inventory[item.id] || 0) + 1
      },
    }));
    addLog('system', `You purchased a ${item.name} for $${item.cost.toLocaleString()}. Your power increases by ${item.power}.`, 'success');
    completeActiveMissionIfTypeMatches('BUY_ANY_ITEM');
  };
  
    const handleHireInvestigator = (targetUserName: string) => {
    if (isBusy) return;
    if (player.money < INVESTIGATOR_COST) {
        addLog('system', "You can't afford the PI's retainer fee.");
        return;
    }
    if (targetUserName.toLowerCase() === currentUser?.toLowerCase()) {
        addLog('system', "You can't hire an investigator to track yourself.");
        return;
    }

    const reportDueHours = Math.random() * (INVESTIGATOR_MAX_HOURS - INVESTIGATOR_MIN_HOURS) + INVESTIGATOR_MIN_HOURS;
    const reportDueTimestamp = Date.now() + reportDueHours * 60 * 60 * 1000;

    const newInvestigation: Investigation = {
        targetUserName,
        reportDueTimestamp
    };
    
    setPlayer(p => ({
        ...p,
        money: p.money - INVESTIGATOR_COST,
        investigations: [...p.investigations, newInvestigation]
    }));
    
    addLog('system', `You hired a private investigator for $${INVESTIGATOR_COST.toLocaleString()}. They will report back on ${targetUserName}'s location in a few hours.`, 'success');
    setIsShopModalOpen(false);
};


  const handleBuyFamilyShopItem = (item: ShopItem) => {
    if (isBusy) return;
    if (player.money < item.cost) {
      addLog('system', "You don't have enough cash for that family heirloom.");
      return;
    }

    setPlayer(p => ({
      ...p,
      money: p.money - item.cost,
      power: p.power + item.power,
      inventory: {
        ...p.inventory,
        [item.id]: (p.inventory[item.id] || 0) + 1
      },
    }));
    addLog('system', `You purchased the ${item.name} from the family armory for $${item.cost.toLocaleString()}. Your personal power increases by ${item.power}.`, 'success');
  };

  const handleBuyBusiness = (business: Business) => {
    if (isBusy) return;
    if (player.money < business.cost) {
        addLog('system', "You don't have enough cash to fund this venture.");
        return;
    }
    if (player.businesses.includes(business.id)) {
        addLog('system', "You already own this type of business.");
        return;
    }
    
    setPlayer(p => ({
        ...p,
        money: p.money - business.cost,
        businesses: [...p.businesses, business.id],
    }));
    addLog('system', `You are now the proud owner of a ${business.name}. The money should start rolling in.`);
    completeActiveMissionIfTypeMatches('BUY_ANY_BUSINESS');
  };

  const handleTravel = (location: Location, mode: 'air' | 'train') => {
    if (isBusy) return;
    if (player.location === location.id) {
        addLog('system', `You are already in ${location.name}.`);
        return;
    }

    const now = new Date();
    let departureTime = new Date(now);
    let travelDurationMinutes = 0;
    let cost = 0;
    
    if (mode === 'air') {
        cost = location.airTravelCost;
        travelDurationMinutes = location.airTravelDuration;
        const minutes = now.getMinutes();
        const nextDepartureMinute = Math.ceil(minutes / 15) * 15;
        departureTime.setMinutes(nextDepartureMinute, 0, 0);
        if (nextDepartureMinute <= minutes) { // If we're past the departure time for this 15-min block
            departureTime.setMinutes(departureTime.getMinutes() + 15);
        }
    } else { // train
        cost = location.trainTravelCost;
        travelDurationMinutes = location.trainTravelDuration;
        departureTime.setHours(now.getHours() + 1, 0, 0, 0);
    }

    if (player.money < cost) {
        addLog('system', `You can't afford the ticket to ${location.name}.`);
        return;
    }

    const arrivalTime = new Date(departureTime.getTime() + travelDurationMinutes * 60000);

    setPlayer(p => ({
        ...p,
        money: p.money - cost,
        travelingUntil: arrivalTime.getTime(),
        travelDestination: location.id,
        travelMode: mode,
    }));

    addLog('system', `You bought a ${mode} ticket to ${location.name} for $${cost.toLocaleString()}. You will arrive at ${arrivalTime.toLocaleTimeString()}.`);
    completeActiveMissionIfTypeMatches('TRAVEL_ANYWHERE');
    setIsTravelModalOpen(false);
  };

  const handleCancelTravel = () => {
    if (!isTraveling) return;

    const destination = locations.find(l => l.id === player.travelDestination);
    const destinationName = destination ? destination.name : 'your destination';

    setPlayer(p => ({
        ...p,
        travelingUntil: null,
        travelDestination: null,
        travelMode: null,
    }));
    addLog('system', `You canceled your trip to ${destinationName}. The ticket cost is non-refundable.`, 'failure');
  };
  
    const handleInstantTravel = () => {
    if (currentUser !== 'Dev' || !isTraveling) return;

    const destination = locations.find(l => l.id === player.travelDestination);
    if(destination) {
        addLog('system', `[DEV] Instantly traveled to ${destination.name}.`, 'success');
        setArrivalNotification(destination.name);
        setTimeout(() => setArrivalNotification(null), 2600);
        setPlayer(p => {
            const newDrugs = JSON.parse(JSON.stringify(p.drugs));
            if (!newDrugs[destination!.id]) {
                newDrugs[destination!.id] = {};
            }
            return {
                ...p,
                location: destination.id,
                travelingUntil: null,
                travelDestination: null,
                travelMode: null,
                drugs: newDrugs,
            }
        });
    }
  };


  const handleBuyDrug = (drug: Drug, quantity: number) => {
    if (isBusy || quantity <= 0) return;
    const currentLocation = locations.find(l => l.id === player.location);
    if (!currentLocation) return;

    const price = Math.round(drug.basePrice * (currentLocation.drugPriceModifiers[drug.id] || 1));
    const totalCost = price * quantity;

    if (player.money < totalCost) {
        addLog('system', "You don't have enough cash for that deal.");
        return;
    }
    
    setPlayer(p => {
        const newDrugs = JSON.parse(JSON.stringify(p.drugs)); // Deep copy
        const locationDrugs = newDrugs[p.location] || {};
        locationDrugs[drug.id] = (locationDrugs[drug.id] || 0) + quantity;
        newDrugs[p.location] = locationDrugs;

        return {
            ...p,
            money: p.money - totalCost,
            drugs: newDrugs,
        };
    });
    addLog('system', `You purchased ${quantity} unit(s) of ${drug.name} for $${totalCost.toLocaleString()}.`);
  };

  const handleSellDrug = (drug: Drug, quantity: number) => {
    if (isBusy || quantity <= 0) return;
    const currentLocation = locations.find(l => l.id === player.location);
    if (!currentLocation) return;
    
    const ownedQuantity = player.drugs[player.location]?.[drug.id] || 0;
    if (ownedQuantity < quantity) {
        addLog('system', `You don't have that many ${drug.name} to sell.`);
        return;
    }

    const price = Math.round(drug.basePrice * (currentLocation.drugPriceModifiers[drug.id] || 1));
    const totalGain = price * quantity;

    setPlayer(p => {
        const newDrugs = JSON.parse(JSON.stringify(p.drugs));
        const locationDrugs = newDrugs[p.location];
        if (locationDrugs) {
            locationDrugs[drug.id] -= quantity;
        }
        newDrugs[p.location] = locationDrugs;

        return {
            ...p,
            money: p.money + totalGain,
            drugs: newDrugs,
        };
    });
    addLog('system', `You sold ${quantity} unit(s) of ${drug.name} for $${totalGain.toLocaleString()}.`);
  };

  const handleSmuggle = useCallback(async (drug: Drug, quantity: number, destinationId: string, method: SmugglingMethod) => {
    if (isBusy || quantity <= 0) return;
    
    const ownedQuantity = player.drugs[player.location]?.[drug.id] || 0;
    if (ownedQuantity < quantity) {
      addLog('system', `You don't have that many ${drug.name} to smuggle.`);
      return;
    }

    const origin = locations.find(l => l.id === player.location);
    const destination = locations.find(l => l.id === destinationId);

    if (!origin || !destination) {
      addLog('system', 'Invalid smuggling route.');
      return;
    }
    
    const smugglingCost = Math.round(drug.basePrice * quantity * method.costMultiplier);
    if (player.money < smugglingCost) {
        addLog('system', `You can't afford the smuggling fee of $${smugglingCost.toLocaleString()}.`);
        return;
    }

    setIsDrugsModalOpen(false);
    setIsLoading(true);
    addLog('system', `Attempting to smuggle ${quantity} units of ${drug.name} to ${destination.name} via ${method.name}...`);
    
    // Deduct cost and drugs upfront
    setPlayer(p => {
        const newDrugs = JSON.parse(JSON.stringify(p.drugs));
        newDrugs[p.location][drug.id] -= quantity;

        return {
            ...p,
            money: p.money - smugglingCost,
            drugs: newDrugs,
        };
    });

    try {
      const result: SmugglingOutcome = await generateSmugglingOutcome(drug, quantity, origin, destination, player, method.successBonus);
      addLog('crime', result.narrative, result.success ? 'success' : 'failure');
      setActionOutcome(result.success ? 'success' : 'failure');
      
      if (result.success) {
          completeActiveMissionIfTypeMatches('SMUGGLE_ANY_DRUG');
          
          // Add drugs to destination inventory
          setPlayer(p => {
              const newDrugs = JSON.parse(JSON.stringify(p.drugs));
              if (!newDrugs[destinationId]) {
                  newDrugs[destinationId] = {};
              }
              newDrugs[destinationId][drug.id] = (newDrugs[destinationId][drug.id] || 0) + quantity;
              
              return { ...p, drugs: newDrugs };
          });

      } // On failure, drugs and money are already gone. No other state change needed.

    } catch (error) {
      console.error('Gemini API Smuggling Error:', error);
      addLog('system', 'An unexpected complication with the shipment arose. The operation is a bust. Your fee and product are lost.');
    } finally {
      setIsLoading(false);
    }
  }, [player, isBusy, addLog, locations, completeActiveMissionIfTypeMatches]);

  const handleDeposit = (amount: number) => {
    if (isBusy || amount <= 0 || amount > player.money) {
      addLog('system', "Invalid amount to deposit.");
      return;
    }
    setPlayer(p => ({ ...p, money: p.money - amount, bank: p.bank + amount }));
    addLog('system', `You deposited $${amount.toLocaleString()} into your bank account.`);
    completeActiveMissionIfTypeMatches('DEPOSIT_MONEY');
  };

  const handleWithdraw = (amount: number) => {
    if (isBusy || amount <= 0 || amount > player.bank) {
      addLog('system', "Invalid amount to withdraw.");
      return;
    }
    setPlayer(p => ({ ...p, money: p.money + amount, bank: p.bank - amount }));
    addLog('system', `You withdrew $${amount.toLocaleString()} from your bank account.`);
  };

  const handleBuyStock = (stockId: string, quantity: number, cost: number) => {
    if (isBusy || quantity <= 0 || player.bank < cost) {
        addLog('system', 'Invalid transaction.');
        return;
    }
    setPlayer(p => ({
        ...p,
        bank: p.bank - cost,
        portfolio: {
            ...p.portfolio,
            [stockId]: (p.portfolio[stockId] || 0) + quantity
        }
    }));
    addLog('system', `Purchased ${quantity} shares of ${stockId} for $${cost.toLocaleString()}.`, 'success');
  };

  const handleSellStock = (stockId: string, quantity: number, revenue: number) => {
    if (isBusy || quantity <= 0 || (player.portfolio[stockId] || 0) < quantity) {
        addLog('system', 'Invalid transaction.');
        return;
    }
    setPlayer(p => {
        const newPortfolio = { ...p.portfolio };
        newPortfolio[stockId] -= quantity;
        if (newPortfolio[stockId] === 0) {
            delete newPortfolio[stockId];
        }
        return {
            ...p,
            bank: p.bank + revenue,
            portfolio: newPortfolio
        };
    });
     addLog('system', `Sold ${quantity} shares of ${stockId} for $${revenue.toLocaleString()}.`, 'success');
  };

  const handleCasinoLoss = (lossAmount: number) => {
    const casinoTerritory = territories.find(t => t.bonus.type === 'CASINO_LOSS_CUT' && t.locationId === player.location);
    if (!casinoTerritory || !casinoTerritory.controllingFamilyId) return;

    const controllingFamily = families.find(f => f.id === casinoTerritory.controllingFamilyId);
    if (!controllingFamily) return;

    const familyCut = Math.round(lossAmount * (casinoTerritory.bonus.value / 100));
    if (familyCut <= 0) return;
    
    setFamilies(prevFamilies => 
        prevFamilies.map(f => 
            f.id === controllingFamily.id ? { ...f, bank: f.bank + familyCut } : f
        )
    );
    
    const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'system',
        senderName: 'Casino Runner',
        message: `The house won big. We've sent a cut of $${familyCut.toLocaleString()} to the family account from a player's loss.`,
        timestamp: Date.now(),
        channel: 'family',
        familyName: controllingFamily.name,
        isSystemMessage: true,
    };
    setChatMessages(prev => [...prev.slice(-50), systemMessage]);
  };

  const handleOddsOrEvensBet = (bet: number, isWin: boolean, roll1: number, roll2: number) => {
    if (isBusy) return;
    const total = roll1 + roll2;
    const resultIs = (total % 2 === 0) ? 'even' : 'odd';
    
    const payoutBonus = getBonus('GAMBLE_PAYOUT');
    const finalBet = isWin ? Math.round(bet * (1 + payoutBonus / 100)) : bet;
    
    setActionOutcome(isWin ? 'success' : 'failure');
    if (isWin) {
        completeActiveMissionIfTypeMatches('WIN_ODDS_OR_EVENS');
    }
    
    if (isWin) {
      setPlayer(p => ({ 
        ...p,
        money: p.money + finalBet,
       }));
      addLog('crime', `The dice roll a ${roll1} and a ${roll2} for a total of ${total}. It's ${resultIs}! You won $${finalBet.toLocaleString()}.`, 'success');
    } else {
      setPlayer(p => ({ ...p, money: p.money - finalBet }));
      addLog('crime', `The dice roll a ${roll1} and a ${roll2} for a total of ${total}. It's ${resultIs}... You lost $${finalBet.toLocaleString()}.`, 'failure');
      handleCasinoLoss(finalBet);
    }
  };

  const handleHigherOrLowerEnd = (bet: number, payout: number, isWin: boolean) => {
    if (isBusy) return;
    const payoutBonus = getBonus('GAMBLE_PAYOUT');
    
    setActionOutcome(isWin ? 'success' : 'failure');
    if (isWin) {
      const finalPayout = Math.round(payout * (1 + payoutBonus / 100));
      const profit = finalPayout - bet;
      setPlayer(p => ({ ...p, money: p.money + profit }));
      addLog('crime', `You cashed out from Higher or Lower, winning a total of $${finalPayout.toLocaleString()}.`, 'success');
    } else {
      setPlayer(p => ({ ...p, money: p.money - bet }));
      addLog('crime', `You busted in Higher or Lower and lost your bet of $${bet.toLocaleString()}.`, 'failure');
      handleCasinoLoss(bet);
    }
  };

  const handleWheelSpin = useCallback(async (): Promise<WheelFortuneOutcome | null> => {
    if (isBusy) return null;

    const today = new Date().toISOString().split('T')[0];
    const currentSpins = player.lastWheelSpinDay === today ? player.dailyWheelSpins : 0;
    
    if (currentSpins >= 3) {
        addLog('system', 'You have reached your daily limit of 3 spins on the Wheel of Fortune.');
        return null;
    }

    const hasCompedSkill = player.unlockedSkills.includes('grifter_2');
    const isFreeSpin = hasCompedSkill && currentSpins === 0;

    const spinCost = 1000;
    
    if (!isFreeSpin && player.money < spinCost) {
        addLog('system', `You need $${spinCost.toLocaleString()} to spin the Wheel of Fortune.`);
        return null;
    }

    addLog('system', isFreeSpin ? `Your 'Comped' skill grants you a free spin!` : `You paid $${spinCost.toLocaleString()} and spin the big wheel...`);

    try {
        const result: WheelFortuneOutcome = await generateWheelSpinOutcome(player);
        
        const xpGainBonus = getBonus('XP_GAIN', player.location);
        const effectiveXpGained = result.prizeType === 'xp' ? Math.round(result.xpGained * (1 + xpGainBonus / 100)) : 0;

        let prizeWon = '';
        switch(result.prizeType) {
            case 'money': prizeWon = `$${result.moneyGained.toLocaleString()}`; break;
            case 'xp': prizeWon = `${effectiveXpGained} XP`; break;
            case 'respect': prizeWon = `${result.respectGained} Respect`; break;
            case 'drug': 
                if (result.drugsGained) {
                    const drug = DRUGS.find(d => d.id === result.drugsGained!.drugId);
                    if (drug) prizeWon = `${result.drugsGained.quantity} ${drug.name}`;
                }
                break;
            case 'vehicle':
                if (result.vehicleGained) {
                    const vehicle = VEHICLES.find(v => v.id === result.vehicleGained!.vehicleId);
                    if (vehicle) prizeWon = `a ${vehicle.name}`;
                }
                break;
        }

        addLog('crime', result.narrative);

        if (result.prizeType !== 'nothing' && prizeWon) {
            addLog('crime', `You won ${prizeWon} from the wheel!`, 'success');
            setActionOutcome('success');
        } else {
            addLog('crime', 'You won nothing from the wheel.', 'failure');
            setActionOutcome('failure');
        }
        
        setPlayer(p => {
            const today = new Date().toISOString().split('T')[0];
            const isNewDay = p.lastWheelSpinDay !== today;
            
            const newPlayerState = { ...p };

            switch(result.prizeType) {
                case 'money': newPlayerState.money += result.moneyGained; break;
                case 'xp': newPlayerState.criminalXP += effectiveXpGained; break;
                case 'respect': newPlayerState.respect += result.respectGained; break;
                case 'drug': 
                    if(result.drugsGained) {
                        const newDrugs = JSON.parse(JSON.stringify(p.drugs));
                        const locationDrugs = newDrugs[p.location] || {};
                        locationDrugs[result.drugsGained.drugId] = (locationDrugs[result.drugsGained.drugId] || 0) + result.drugsGained.quantity;
                        newDrugs[p.location] = locationDrugs;
                        newPlayerState.drugs = newDrugs;
                    }
                    break;
                case 'vehicle':
                    if (result.vehicleGained) {
                        const newVehicles: PlayerVehicle[] = [...p.vehicles];
                        newVehicles.push({
                            id: Date.now().toString(),
                            vehicleId: result.vehicleGained.vehicleId,
                            condition: result.vehicleGained.condition,
                        });
                        newPlayerState.vehicles = newVehicles;
                    }
                    break;
            }
            
            newPlayerState.money -= (isFreeSpin ? 0 : spinCost);
            newPlayerState.dailyWheelSpins = isNewDay ? 1 : p.dailyWheelSpins + 1;
            newPlayerState.lastWheelSpinDay = today;
            
            return newPlayerState;
        });
        
        return result;

    } catch (error) {
        console.error('Gemini API Wheel Spin Error:', error);
        addLog('system', 'The wheel mechanism jammed. Your spin was not counted.');
        return null;
    }
  }, [player, isBusy, addLog, getBonus]);

  const handleCreateFamily = (name: string) => {
      if (isBusy) return;
      if (player.money < FAMILY_CREATION_COST) {
          addLog('system', "You don't have the funds to establish a family of that stature.");
          return;
      }
      if (families.some(f => f.name.toLowerCase() === name.toLowerCase())) {
          addLog('system', `A family named "${name}" already exists. Choose a unique name.`);
          return;
      }
       if (player.familyName) {
          addLog('system', `You are already part of a family.`);
          return;
      }

      const newFamily: Family = { 
        id: `family_${name.replace(/\s+/g, '')}`, 
        name: name, 
        donId: 'player',
        description: "A new but ambitious crew.",
        bank: 0,
        totalPower: player.power,
        membershipRequests: [],
        allies: [],
        rivals: [],
       };
       
      setFamilies(f => [...f, newFamily]);
      setPlayer(p => ({ ...p, money: p.money - FAMILY_CREATION_COST, familyId: newFamily.id, familyName: newFamily.name, familyRole: 'Don' }));
      addLog('system', `You have founded the ${name} family. You are now the Don. Your influence grows.`, 'success');
      setIsCreateFamilyModalOpen(false);
  };

    const handleUpdateMemberRole = async (memberId: string, newRole: FamilyRole) => {
        const actingUserIsDon = player.familyRole === 'Don';
        if (!actingUserIsDon) {
            addLog('system', "Only the Don can change a member's role.");
            return;
        }
        
        const memberToUpdate = onlineUsers.find(u => u.id === memberId);
        if (!memberToUpdate || memberToUpdate.familyName !== player.familyName) {
            addLog('system', 'This person is not in your family.');
            return;
        }

        const oldRole = memberToUpdate.role;
        setOnlineUsers(prevUsers => 
            prevUsers.map(u => u.id === memberId ? { ...u, role: newRole } : u)
        );

        if (player.familyName) {
            const news = await generateFamilyNews(player.rank, memberToUpdate.name, oldRole, newRole);
            const systemMessage: ChatMessage = {
                id: Date.now().toString(),
                senderId: 'system',
                senderName: 'Family Announcement',
                message: news,
                timestamp: Date.now(),
                channel: 'family',
                familyName: player.familyName,
                isSystemMessage: true,
            };
            setChatMessages(prev => [...prev, systemMessage]);
        }
        addLog('system', `${memberToUpdate.name} is now a ${newRole}.`, 'success');
    };

    const handleExecuteFinalHeist = useCallback(async (heist: Heist, chosenOptions: HeistStageOption[], vehicleId?: string) => {
        if (isBusy) return;
    
        if (player.heistCooldownEnd && player.heistCooldownEnd > Date.now()) {
            addLog('system', "Your crew needs more time to lay low before the next major heist.");
            return;
        }
    
        const totalCost = chosenOptions.reduce((sum, opt) => sum + opt.cost, 0);
    
        if (player.money < totalCost) {
            addLog('system', `You need $${totalCost.toLocaleString()} to fund this heist plan.`);
            return;
        }
    
        const vehicle = player.vehicles.find(v => v.id === vehicleId);
        const vehicleInfo = vehicle ? VEHICLES.find(vData => vData.id === vehicle.vehicleId) : null;
        const vehicleBonus = vehicleInfo?.heistBonus || 0;
        const vehicleName = vehicleInfo?.name;
    
        setIsHeistModalOpen(false);
        setIsLoading(true);
        addLog('system', `This is it. You're executing the ${heist.name}...`);
    
        const chanceBonusFromOptions = chosenOptions.reduce((sum, opt) => sum + opt.successBonus, 0);
        const failureBonusFromOptions = chosenOptions.reduce((sum, opt) => sum + opt.failureBonus, 0);
        const skillBonus = getBonus('HEIST_SUCCESS', player.location);
        const finalSuccessChance = 50 + chanceBonusFromOptions + skillBonus + vehicleBonus;
        const finalFailureChance = 5 + failureBonusFromOptions;
    
        try {
            const result: FinalHeistOutcome = await generateFinalHeistOutcome(heist, player, finalSuccessChance, finalFailureChance, vehicleName);
    
            const xpGainBonus = getBonus('XP_GAIN', player.location);
            const finalXPGained = result.success ? Math.round(result.xpGained * (1 + xpGainBonus / 100)) : 0;
            
            setPlayer(p => {
                const moneyGained = result.success ? result.moneyGained : 0;
    
                return {
                    ...p,
                    money: p.money - totalCost + moneyGained,
                    criminalXP: p.criminalXP + finalXPGained,
                    heists: {
                        ...p.heists,
                        [heist.id]: {
                            heistId: heist.id,
                            lastHeistOutcome: result,
                        }
                    },
                    heistCooldownEnd: Date.now() + 4 * 60 * 60 * 1000,
                    jailedUntil: !result.success ? Date.now() + JAIL_TIME_SECONDS * 1000 : p.jailedUntil,
                };
            });
    
            let logMessage = result.narrative;
            if (result.success) {
                logMessage += ` You got away with $${result.moneyGained.toLocaleString()} and earned ${finalXPGained.toLocaleString()} XP.`;
            }
            addLog('heist', logMessage, result.success ? 'success' : 'failure');
            setActionOutcome(result.success ? 'success' : 'failure');
    
        } catch (e) {
            console.error("Error executing final heist:", e);
            addLog('heist', 'A critical error during the heist forced your crew to scatter. The score is a bust, and you were caught!', 'failure');
            setPlayer(p => ({
                ...p,
                money: p.money - totalCost,
                heistCooldownEnd: Date.now() + 4 * 60 * 60 * 1000,
                jailedUntil: Date.now() + JAIL_TIME_SECONDS * 1000,
            }));
        } finally {
            setIsLoading(false);
        }
    
    }, [player, isBusy, addLog, getBonus]);

  const handleUnlockSkill = (skill: Skill) => {
    if (isBusy) return;
    if (player.skillPoints < skill.cost) {
      addLog('system', "You don't have enough skill points.");
      return;
    }
    if (player.unlockedSkills.includes(skill.id)) {
      addLog('system', "You have already unlocked this skill.");
      return;
    }
    // Check dependencies
    for(const depId of skill.dependencies) {
        if (!player.unlockedSkills.includes(depId)) {
            addLog('system', "You must unlock previous skills in this branch first.");
            return;
        }
    }
    setPlayer(p => ({
        ...p,
        skillPoints: p.skillPoints - skill.cost,
        unlockedSkills: [...p.unlockedSkills, skill.id]
    }));
    addLog('system', `You have unlocked the skill: ${skill.name}!`, 'success');
  };
  
    const handleMarkMailAsRead = (messageId: string) => {
        setPlayer(p => ({
            ...p,
            mail: p.mail.map(m => m.id === messageId ? { ...m, isRead: true } : m)
        }));
    };

    const handleDeleteMail = (messageId: string) => {
        setPlayer(p => ({
            ...p,
            mail: p.mail.filter(m => m.id !== messageId)
        }));
    };
    
    const handleBuyLand = (amount: number) => {
        if (isBusy || amount <= 0) return;

        const landCap = RANK_LAND_CAPS[player.rank] || 0;
        const landAvailableToBuy = landCap - player.landOwned;
        
        if (amount > landAvailableToBuy) {
            addLog('system', `You cannot own that much land at your current rank. You can only buy ${landAvailableToBuy} m³ more.`);
            return;
        }
        
        const totalCost = amount * LAND_COST_PER_M3;
        if (player.money < totalCost) {
            addLog('system', "You can't afford to buy this much land.");
            return;
        }

        setPlayer(p => ({
            ...p,
            money: p.money - totalCost,
            landOwned: p.landOwned + amount,
        }));
        addLog('system', `You purchased ${amount} m³ of land for $${totalCost.toLocaleString()}.`, 'success');
    };

    const handleBuyWeedPlants = (amount: number) => {
        if (isBusy || amount <= 0) return;

        const spaceAvailable = player.landOwned - player.weedPlants;
        if (amount > spaceAvailable) {
            addLog('system', `You don't have enough land. You can only plant ${spaceAvailable} more plant(s).`);
            return;
        }
        
        const totalCost = amount * PLANT_COST_PER_M3;
        if (player.money < totalCost) {
            addLog('system', "You can't afford to buy this many plants.");
            return;
        }

        setPlayer(p => ({
            ...p,
            money: p.money - totalCost,
            weedPlants: p.weedPlants + amount,
        }));
        addLog('system', `You purchased and planted ${amount} weed plant(s) for $${totalCost.toLocaleString()}.`, 'success');
    };

    const handleOpenUserProfileModal = (user: MockUser) => {
        setSelectedUser(user);
        setIsUserProfileModalOpen(true);
    };

    const handleRespectPlayer = (userId: string) => {
        if (cooldowns['respect_cooldown'] && cooldowns['respect_cooldown'] > Date.now()) {
            addLog('system', "You've shown enough respect recently. Give it some time.");
            return;
        }
        
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(u => u ? { ...u, respect: u.respect + 1 } : null);
             addLog('system', `You showed respect to ${selectedUser.name}. Their reputation grows.`, 'success');
        }

        setCooldowns(prev => ({ ...prev, ['respect_cooldown']: Date.now() + 24 * 60 * 60 * 1000 })); // 24 hour cooldown
    };

    const handleOpenBanModal = (user: MockUser) => {
        setBanTargetUser(user);
        setIsBanConfirmModalOpen(true);
    };

    const handleConfirmBan = (reason: string) => {
        if (!banTargetUser) return;
        
        userService.banUser(banTargetUser.name, reason);
        const updatedUsers = onlineUsers.map(u => 
            u.id === banTargetUser.id ? { ...u, banned: { isBanned: true, reason: reason } } : u
        );
        setOnlineUsers(updatedUsers);
        addLog('system', `${banTargetUser.name} has been banned. Reason: ${reason}`);
        if (selectedUser?.id === banTargetUser.id) {
            setSelectedUser(prev => prev ? { ...prev, banned: { isBanned: true, reason: reason } } : null);
        }
        
        setIsBanConfirmModalOpen(false);
        setBanTargetUser(null);
    };

    const handleUnbanUser = (userId: string, username: string) => {
        userService.unbanUser(username);
        const updatedUsers = onlineUsers.map(u => 
            u.id === userId ? { ...u, banned: { isBanned: false, reason: '' } } : u
        );
        setOnlineUsers(updatedUsers);
        addLog('system', `${username} has been unbanned.`);
        if (selectedUser?.id === userId) {
            setSelectedUser(prev => prev ? { ...prev, banned: { isBanned: false, reason: '' } } : null);
        }
    };

    const handleOpenFamilyProfileModal = (family: Family) => {
        setSelectedFamily(family);
        setIsFamilyProfileModalOpen(true);
    };

    const handleUpdateFamilyDescription = (familyId: string, description: string) => {
        setFamilies(prevFamilies => prevFamilies.map(f =>
            f.id === familyId ? { ...f, description } : f
        ));
        addLog('system', 'Family description updated successfully.', 'success');
    };
    
    const handleDonateToFamily = (familyId: string, amount: number) => {
        if (isBusy || amount <= 0 || player.money < amount) {
            addLog('system', 'Invalid donation amount.');
            return;
        }
        setPlayer(p => ({...p, money: p.money - amount}));
        setFamilies(prevFamilies => prevFamilies.map(f =>
            f.id === familyId ? { ...f, bank: f.bank + amount } : f
        ));
        addLog('system', `You donated $${amount.toLocaleString()} to the family war chest.`, 'success');
    };

    const handleAttack = (target: MockUser) => {
        if (target.locationId !== player.location) {
            addLog('system', `You must be in the same country as ${target.name} to attack them.`);
            return;
        }
        
        const staminaCostBonus = getBonus('ATTACK_STAMINA_COST');
        const attackCost = 5 + staminaCostBonus; // a bonus of -1 makes it 4

        if (player.stamina < attackCost) {
            addLog('system', `You don't have enough stamina to attack. You need ${attackCost} stamina.`);
            return;
        }

        setIsOnlineUsersModalOpen(false);
        
        setPlayer(p => ({ ...p, stamina: p.stamina - attackCost }));

        const playerFamily = families.find(f => f.name === player.familyName);
        const targetFamily = families.find(f => f.name === target.familyName);

        const playerPowerBonus = playerFamily ? playerFamily.totalPower * 0.1 : 0;
        const targetPowerBonus = targetFamily ? targetFamily.totalPower * 0.1 : 0;

        const playerEffectivePower = player.power + playerPowerBonus;
        const targetEffectivePower = target.power + targetPowerBonus;
        
        const playerWon = playerEffectivePower > targetEffectivePower;
        
        const moneyExchanged = playerWon ? Math.round(target.power * 5) : Math.round(player.money * 0.1);

        const playerHealthLost = playerWon ? Math.max(1, Math.floor(target.power / 100)) : Math.max(5, Math.floor(player.power / 50));
        const targetHealthLost = playerWon ? Math.max(5, Math.floor(target.power / 50)) : Math.max(1, Math.floor(player.power / 100));

        setAttackTarget(target);
        
        setPlayer(p => ({
            ...p,
            money: playerWon ? p.money + moneyExchanged : Math.max(0, p.money - moneyExchanged),
            hp: Math.max(0, p.hp - playerHealthLost)
        }));
        
        if (playerWon) {
            addLog('crime', `You attacked ${target.name} and won! You took $${moneyExchanged.toLocaleString()} but lost ${playerHealthLost} HP.`, 'success');
        } else {
            addLog('crime', `You attacked ${target.name} and lost! They beat you down, took $${moneyExchanged.toLocaleString()} and you lost ${playerHealthLost} HP.`, 'failure');
        }

        setAttackOutcome({ playerWon, moneyExchanged, playerHealthLost, targetHealthLost });
        setIsAttackModalOpen(true);
    };

    const handleAttackTerritory = async (territoryId: string) => {
        if (isBusy || !player.familyName) {
            addLog('system', 'You must be in a family to engage in turf wars.');
            return;
        }
        const myFamily = families.find(f => f.name === player.familyName);
        if (!myFamily) return;

        const staminaCost = 10;
        if (player.stamina < staminaCost) {
            addLog('system', `You need ${staminaCost} stamina to attack a territory.`);
            return;
        }

        setPlayer(p => ({...p, stamina: p.stamina - staminaCost}));
        const targetTerritory = territories.find(t => t.id === territoryId);
        if (!targetTerritory || targetTerritory.controllingFamilyId === myFamily.id) {
            return;
        }

        const defendingFamily = families.find(f => f.id === targetTerritory.controllingFamilyId);
        
        const damage = Math.floor(player.power * (Math.random() * 0.5 + 0.75)); // 75%-125% of power
        let conquered = false;

        const newTerritories = territories.map(t => {
            if (t.id === territoryId) {
                const newInfluence = t.influence - damage;
                if (newInfluence <= 0) {
                    conquered = true;
                    return { ...t, influence: 0, controllingFamilyId: myFamily.id };
                }
                return { ...t, influence: newInfluence };
            }
            return t;
        });

        if (conquered) {
             const restoredTerritories = newTerritories.map(t => t.id === territoryId ? {...t, influence: t.maxInfluence} : t);
             setTerritories(restoredTerritories);
             const news = await generateTurfWarNews(myFamily, defendingFamily, targetTerritory, 'conquer');
             addLog('war', news, 'success');
        } else {
             setTerritories(newTerritories);
             const news = await generateTurfWarNews(myFamily, defendingFamily, targetTerritory, 'attack');
             addLog('war', news);
        }
    };

    const handleOpenMessageModal = (user: MockUser) => {
        setMessageRecipient(user);
        setIsMessageModalOpen(true);
    };

    const handleSendMessageToUser = (subject: string, body: string) => {
        if (!messageRecipient || !currentUser) return;

        // Message for sender's "Sent" folder
        const sentMessage: MailMessage = {
            id: `${Date.now()}-sent-${messageRecipient.id}`,
            sender: 'You',
            recipient: messageRecipient.name,
            subject: subject,
            body: body,
            timestamp: Date.now(),
            isRead: true, // It's a sent message
        };
        
        setPlayer(p => ({ ...p, mail: [...p.mail, sentMessage] }));

        // Message for recipient's inbox, if they are a real player
        if (!messageRecipient.isNpc) {
            const receivedMessage: MailMessage = {
                id: `${Date.now()}-received-${currentUser}`,
                sender: currentUser,
                subject: subject,
                body: body,
                timestamp: Date.now(),
                isRead: false,
            };
            userService.addMessageToUser(messageRecipient.name, receivedMessage);
        }

        addLog('system', `Message sent to ${messageRecipient.name}.`, 'success');
        setIsMessageModalOpen(false);
        setMessageRecipient(null);
    };

    const handleSendMessageFromInbox = (recipientName: string, subject: string, body: string) => {
        if (!currentUser) return;
        const recipient = onlineUsers.find(u => u.name.toLowerCase() === recipientName.toLowerCase());

        if (!recipient) {
            addLog('system', `User "${recipientName}" not found.`);
            return;
        }

        // Message for sender's "Sent" folder
        const sentMessage: MailMessage = {
            id: `${Date.now()}-sent-${recipient.id}`,
            sender: 'You',
            recipient: recipient.name,
            subject: subject,
            body: body,
            timestamp: Date.now(),
            isRead: true,
        };
        
        setPlayer(p => ({ ...p, mail: [...p.mail, sentMessage] }));

        // Message for recipient's inbox, if they are a real player
        if (!recipient.isNpc) {
            const receivedMessage: MailMessage = {
                id: `${Date.now()}-received-${currentUser}`,
                sender: currentUser,
                subject: subject,
                body: body,
                timestamp: Date.now(),
                isRead: false,
            };
            userService.addMessageToUser(recipient.name, receivedMessage);
        }

        addLog('system', `Message sent to ${recipient.name}.`, 'success');
    };

    const handleBreakOutAttempt = (targetUser: MockUser) => {
        const staminaCost = 20;
        if (player.stamina < staminaCost) {
            addLog('system', `You need ${staminaCost} stamina to attempt a breakout.`);
            return;
        }

        setPlayer(p => ({...p, stamina: p.stamina - staminaCost}));
        addLog('system', `You attempt to break ${targetUser.name} out of prison...`);
        setIsLoading(true);

        setTimeout(() => {
            const success = Math.random() < 0.5;
            if (success) {
                const xpGained = 250;
                setPlayer(p => ({ ...p, criminalXP: p.criminalXP + xpGained }));

                if (!targetUser.isNpc && currentUser) {
                    userService.updateUserJailStatus(targetUser.name, null);
                    
                    const newMail: MailMessage = {
                        id: `breakout_${Date.now()}_${targetUser.id}`,
                        sender: 'System',
                        subject: 'A Friend in Need',
                        body: `You're free! ${currentUser} busted you out of the joint.\n\nIn this world, loyalty is everything. It's good practice to show respect to those who help you out. You can do this from their profile in the Online Users list.`,
                        timestamp: Date.now(),
                        isRead: false
                    };
                    userService.addMessageToUser(targetUser.name, newMail);
                }

                setOnlineUsers(prev => prev.map(u => u.id === targetUser.id ? {...u, jailedUntil: null} : u));
                addLog('crime', `Success! You busted ${targetUser.name} out of the joint, earning ${xpGained} XP. You both slip away into the night.`, 'success');
                setActionOutcome('success');
            } else {
                setPlayer(p => ({...p, jailedUntil: Date.now() + JAIL_TIME_SECONDS * 1000}));
                addLog('crime', `Failure! A guard spots you during the attempt. You're beaten and thrown into a cell yourself!`, 'failure');
                setActionOutcome('failure');
                setIsPrisonModalOpen(false);
            }
            setIsLoading(false);
        }, 1500);
    };


    // --- Social & Family Handlers ---

    const handleSetFamilyRelation = (targetFamilyName: string, relation: 'ally' | 'rival' | 'neutral') => {
        if (!player.familyId) return;

        const targetFamily = families.find(f => f.name.toLowerCase() === targetFamilyName.toLowerCase());
        if (!targetFamily) {
            addLog('system', `Family "${targetFamilyName}" not found.`);
            return;
        }
        if (targetFamily.id === player.familyId) {
            addLog('system', `You cannot declare a relation with your own family.`);
            return;
        }

        setFamilies(prevFamilies => prevFamilies.map(f => {
            if (f.id === player.familyId) {
                const newFamily = { ...f };
                // Remove from both lists first
                newFamily.allies = newFamily.allies.filter(id => id !== targetFamily.id);
                newFamily.rivals = newFamily.rivals.filter(id => id !== targetFamily.id);

                if (relation === 'ally') {
                    newFamily.allies.push(targetFamily.id);
                    addLog('system', `The ${targetFamily.name} family are now your allies.`, 'success');
                } else if (relation === 'rival') {
                    newFamily.rivals.push(targetFamily.id);
                    addLog('system', `The ${targetFamily.name} family are now your rivals.`, 'failure');
                } else { // neutral
                    addLog('system', `You have ended your formal relation with the ${targetFamily.name} family.`);
                }
                return newFamily;
            }
            return f;
        }));
    };

    const handleFriendRequest = (userId: string) => {
        if (player.friends.includes(userId) || player.sentFriendRequests.includes(userId)) return;

        setPlayer(p => ({
            ...p,
            sentFriendRequests: [...p.sentFriendRequests, userId]
        }));
        setOnlineUsers(users => users.map(u => 
            u.id === userId && currentUser ? { ...u, friendRequests: [...u.friendRequests, { fromUserId: 'player', fromUserName: currentUser }] } : u
        ));
        addLog('system', `Friend request sent.`);
        setIsUserProfileModalOpen(false);
    };

    const handleAcceptFriendRequest = (request: FriendRequest) => {
        setPlayer(p => ({
            ...p,
            friends: [...p.friends, request.fromUserId],
            friendRequests: p.friendRequests.filter(r => r.fromUserId !== request.fromUserId),
        }));
        setOnlineUsers(users => users.map(u => 
            u.id === request.fromUserId ? { ...u, friends: [...u.friends, 'player'], sentFriendRequests: u.sentFriendRequests.filter(id => id !== 'player') } : u
        ));
        addLog('system', `You are now friends with ${request.fromUserName}.`, 'success');
    };

    const handleDeclineFriendRequest = (request: FriendRequest) => {
        setPlayer(p => ({
            ...p,
            friendRequests: p.friendRequests.filter(r => r.fromUserId !== request.fromUserId)
        }));
        addLog('system', `You declined ${request.fromUserName}'s friend request.`);
    };

    const handleRemoveFriend = (userId: string) => {
        const friendName = onlineUsers.find(u => u.id === userId)?.name || 'that user';
        setPlayer(p => ({
            ...p,
            friends: p.friends.filter(id => id !== userId)
        }));
        setOnlineUsers(users => users.map(u => 
            u.id === userId ? { ...u, friends: u.friends.filter(id => id !== 'player') } : u
        ));
        addLog('system', `You are no longer friends with ${friendName}.`);
    };
    
    const handleAddEnemy = (userId: string) => {
         if (player.enemies.includes(userId)) return;
         const enemyName = onlineUsers.find(u => u.id === userId)?.name || 'A new rival';
         setPlayer(p => ({ ...p, enemies: [...p.enemies, userId] }));
         addLog('system', `${enemyName} has been added to your enemies list.`, 'failure');
    };

    const handleRemoveEnemy = (userId: string) => {
        const enemyName = onlineUsers.find(u => u.id === userId)?.name || 'An old rival';
        setPlayer(p => ({ ...p, enemies: p.enemies.filter(id => id !== userId) }));
        addLog('system', `You have removed ${enemyName} from your enemies list.`);
    };

    const handleJoinFamilyRequest = (familyId: string) => {
        if (player.familyName || player.sentFamilyJoinRequest || !currentUser) return;

        setPlayer(p => ({ ...p, sentFamilyJoinRequest: familyId }));
        
        setFamilies(prevFamilies => prevFamilies.map(f => {
            if (f.id === familyId) {
                return {
                    ...f,
                    membershipRequests: [...f.membershipRequests, {
                        fromUserId: 'player', 
                        fromUserName: currentUser,
                        fromUserPower: player.power,
                    }]
                };
            }
            return f;
        }));
        addLog('system', `You sent a request to join The ${families.find(f => f.id === familyId)?.name} Family.`, 'success');
        setIsFamilyProfileModalOpen(false);
    };

    const handleAcceptJoinRequest = (request: MembershipRequest) => {
        addLog('system', `Simulated: Accepted ${request.fromUserName} into the family. In a real multiplayer game, their status would be updated.`);
        if (!player.familyId) return;

        setFamilies(prevFamilies => prevFamilies.map(f => 
            f.id === player.familyId 
            ? { ...f, membershipRequests: f.membershipRequests.filter(r => r.fromUserId !== request.fromUserId) } 
            : f
        ));
    };
    
    const handleDeclineJoinRequest = (request: MembershipRequest) => {
         addLog('system', `You declined ${request.fromUserName}'s request to join.`);
         if (!player.familyId) return;

         setFamilies(prevFamilies => prevFamilies.map(f => 
            f.id === player.familyId 
            ? { ...f, membershipRequests: f.membershipRequests.filter(r => r.fromUserId !== request.fromUserId) } 
            : f
        ));
    };

    const calculateHarvestableWeed = useCallback((): number => {
        const now = Date.now();
        const timeSinceLastProduction = now - player.lastProductionTimestamp;
    
        if (timeSinceLastProduction < 0 || player.weedPlants <= 0) return 0;
    
        const productionBoostPercent = getBonus('DRUG_PRODUCTION', player.location);
        const totalOutputPerDay = player.weedPlants * WEED_PRODUCTION_PER_M3_PER_DAY;
        
        const cyclesPassed = Math.floor(timeSinceLastProduction / (24 * 60 * 60 * 1000));
        const baseProductionAmount = totalOutputPerDay * cyclesPassed;
        
        const productionAmount = Math.floor(baseProductionAmount * (1 + productionBoostPercent / 100));
        
        return productionAmount;
    }, [player.lastProductionTimestamp, player.weedPlants, player.location, getBonus]);

    const handleUpdateProfileDescription = (description: string) => {
        setPlayer(p => ({ ...p, profileDescription: description }));
    };

  const getCurrentLocationName = () => {
    return locations.find(loc => loc.id === player.location)?.name || 'Unknown';
  };
  
  const myFamily = families.find(f => f.name === player.familyName);
  const effectiveMaxStamina = player.maxStamina + getBonus('MAX_STAMINA');
  
  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 text-amber-950 font-sans p-4 sm:p-6 md:p-8 pb-12">
            <header className="relative mb-8 pb-4 border-b border-amber-300">
                <div className="flex items-center justify-center gap-6 text-amber-800">
                    <div className="flex-grow h-px bg-amber-300"></div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-wider text-center font-cinzel">
                    Empire Of Families
                    </h1>
                    <div className="flex-grow h-px bg-amber-300"></div>
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center gap-2">
                    <button 
                        onClick={() => setIsRulesModalOpen(true)}
                        className="bg-amber-200 hover:bg-amber-300 text-amber-800 font-bold py-2 px-4 rounded-lg shadow-md transition-colors border border-amber-300"
                        aria-label="Open Game Rules"
                    >
                        Rules
                    </button>
                    <button 
                        onClick={() => setIsFaqModalOpen(true)}
                        className="bg-amber-200 hover:bg-amber-300 text-amber-800 font-bold py-2 px-4 rounded-lg shadow-md transition-colors border border-amber-300"
                        aria-label="Open Frequently Asked Questions"
                    >
                        F.A.Q.
                    </button>
                </div>
            </header>
            
            {arrivalNotification && <ArrivalNotification locationName={arrivalNotification} />}
            <FaqModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} />
            <RulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />
            {actionOutcome === 'success' && <SuccessAnimation onClose={() => setActionOutcome(null)} />}
            {actionOutcome === 'failure' && <FailureAnimation onClose={() => setActionOutcome(null)} />}
            {isJailed && <JailedNotification jailedUntil={player.jailedUntil!} />}
            {isTraveling && <TravelNotification player={player} onCancelTravel={handleCancelTravel} onInstantTravel={handleInstantTravel} currentUser={currentUser} />}
            {isLoading && <Loader />}
            {isRankModalOpen && <RankModal ranks={RANKS} currentRank={player.rank} onClose={() => setIsRankModalOpen(false)} />}
            {isCrimeModalOpen && (
                <CrimeModal 
                    crimes={CRIMES}
                    player={player}
                    onCrime={handleCrime}
                    generalCrimeCooldownEnd={player.generalCrimeCooldownEnd}
                    disabled={isBusy}
                    onClose={() => setIsCrimeModalOpen(false)}
                />
            )}
            {isVehicleCrimeModalOpen && (
                <VehicleCrimeModal
                    vehicleCrimes={VEHICLE_CRIMES}
                    player={player}
                    onVehicleCrime={handleVehicleCrime}
                    vehicleCrimeCooldownEnd={player.vehicleCrimeCooldownEnd}
                    disabled={isBusy}
                    onClose={() => setIsVehicleCrimeModalOpen(false)}
                />
            )}
            {isShopModalOpen && (
                <ShopModal 
                    items={SHOP_ITEMS}
                    playerMoney={player.money} 
                    playerInventory={player.inventory}
                    onlineUsers={onlineUsers}
                    onBuyItem={handleBuyItem} 
                    onHireInvestigator={handleHireInvestigator}
                    disabled={isBusy}
                    onClose={() => setIsShopModalOpen(false)}
                />
                )}
            {isBusinessModalOpen && (
                <BusinessModal
                    businesses={BUSINESSES.filter(b => b.locationId === player.location)}
                    playerMoney={player.money}
                    playerBusinesses={player.businesses}
                    onBuyBusiness={handleBuyBusiness}
                    disabled={isBusy}
                    onClose={() => setIsBusinessModalOpen(false)}
                />
                )}
            {isTravelModalOpen && <TravelModal locations={locations} player={player} onTravel={handleTravel} disabled={isBusy} onClose={() => setIsTravelModalOpen(false)} />}
            {isDrugsModalOpen && (
                <DrugsModal
                drugs={DRUGS}
                player={player}
                locations={locations}
                onBuy={handleBuyDrug}
                onSell={handleSellDrug}
                onSmuggle={handleSmuggle}
                disabled={isBusy}
                onClose={() => setIsDrugsModalOpen(false)}
                />
            )}
            {isProfileModalOpen && <ProfileModal player={player} stocks={stocks} onClose={() => setIsProfileModalOpen(false)} onOpenMail={() => setIsMailModalOpen(true)} onOpenMissions={handleOpenMissionsModal} onUpdateProfileDescription={handleUpdateProfileDescription} />}
            {isBankModalOpen && (
                <BankModal
                playerMoney={player.money}
                playerBank={player.bank}
                playerPortfolio={player.portfolio}
                stocks={stocks}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
                onBuyStock={handleBuyStock}
                onSellStock={handleSellStock}
                disabled={isBusy}
                onClose={() => setIsBankModalOpen(false)}
                />
            )}
            {isGarageModalOpen && (
                <GarageModal 
                playerVehicles={player.vehicles} 
                playerMoney={player.money}
                onSell={handleSellVehicle} 
                onRepair={handleRepairVehicle} 
                disabled={isBusy}
                onClose={() => setIsGarageModalOpen(false)} 
                />
            )}
            {isOddsOrEvensModalOpen && (
                <OddsOrEvensModal player={player} onBet={handleOddsOrEvensBet} onClose={() => setIsOddsOrEvensModalOpen(false)} disabled={isBusy} />
            )}
            {isHigherOrLowerModalOpen && (
                <HigherOrLowerModal player={player} onGameEnd={handleHigherOrLowerEnd} onClose={() => setIsHigherOrLowerModalOpen(false)} disabled={isBusy} />
            )}
            {isWheelOfFortuneModalOpen && (
                <WheelOfFortuneModal player={player} onSpin={handleWheelSpin} onClose={() => setIsWheelOfFortuneModalOpen(false)} disabled={isBusy} />
            )}
            {isCreateFamilyModalOpen && (
                <CreateFamilyModal player={player} families={families} onCreate={handleCreateFamily} onClose={() => setIsCreateFamilyModalOpen(false)} disabled={isBusy} />
            )}
            {isHeistModalOpen && (
                <HeistModal 
                    player={player}
                    playerVehicles={player.vehicles}
                    heists={HEISTS}
                    onExecuteHeist={handleExecuteFinalHeist}
                    onClose={() => setIsHeistModalOpen(false)}
                    disabled={isBusy}
                    heistCooldownEnd={player.heistCooldownEnd}
                />
            )}
            {isSkillsModalOpen && (
                <SkillsModal 
                    player={player}
                    skillTree={SKILL_TREE}
                    onUnlockSkill={handleUnlockSkill}
                    onClose={() => setIsSkillsModalOpen(false)}
                    disabled={isBusy}
                />
            )}
            {isMailModalOpen && (
                <MailModal 
                messages={player.mail} 
                currentUser={currentUser}
                onlineUsers={onlineUsers}
                onClose={() => setIsMailModalOpen(false)} 
                onDelete={handleDeleteMail}
                onMarkAsRead={handleMarkMailAsRead}
                onSendMessage={handleSendMessageFromInbox}
                />
            )}
            {isHospitalModalOpen && (
                <HospitalModal 
                    player={player}
                    onClose={() => setIsHospitalModalOpen(false)}
                    onHeal={handleHeal}
                    disabled={isBusy}
                />
            )}
            {isMissionsModalOpen && (
                <MissionsModal 
                player={player}
                missions={MISSIONS}
                onClose={() => setIsMissionsModalOpen(false)}
                onClaimReward={handleClaimMissionReward}
                />
            )}
            {isPowerModalOpen && <PowerModal player={player} onClose={() => setIsPowerModalOpen(false)} />}
            {isPropertiesModalOpen && (
                <PropertiesModal 
                player={player}
                onClose={() => setIsPropertiesModalOpen(false)}
                onBuy={handleBuyLand}
                disabled={isBusy}
                />
            )}
            {isProductionModalOpen && (
                <ProductionModal 
                player={player}
                onClose={() => setIsProductionModalOpen(false)}
                onBuy={handleBuyWeedPlants}
                disabled={isBusy}
                />
            )}
            {isOnlineUsersModalOpen && (
                <OnlineUsersModal
                onlineUsers={onlineUsers}
                player={player}
                onClose={() => setIsOnlineUsersModalOpen(false)}
                onOpenProfile={handleOpenUserProfileModal}
                onAttack={handleAttack}
                onMessage={handleOpenMessageModal}
                />
            )}
            {isUserProfileModalOpen && (
                <UserProfileModal
                user={selectedUser}
                player={player}
                currentUser={currentUser}
                onClose={() => setIsUserProfileModalOpen(false)}
                onRespect={handleRespectPlayer}
                onFriendRequest={handleFriendRequest}
                onBanUser={handleOpenBanModal}
                onUnbanUser={handleUnbanUser}
                respectCooldownEnd={cooldowns['respect_cooldown']}
                />
            )}
             <BanConfirmationModal
                isOpen={isBanConfirmModalOpen}
                username={banTargetUser?.name || ''}
                onClose={() => setIsBanConfirmModalOpen(false)}
                onConfirm={handleConfirmBan}
            />
            {isFamilyListModalOpen && (
                <FamilyListModal
                families={families}
                onlineUsers={onlineUsers}
                onClose={() => setIsFamilyListModalOpen(false)}
                onOpenFamilyProfile={handleOpenFamilyProfileModal}
                />
            )}
            {isFamilyProfileModalOpen && (
                <FamilyProfileModal
                family={selectedFamily}
                onlineUsers={onlineUsers}
                player={player}
                onClose={() => setIsFamilyProfileModalOpen(false)}
                onUpdateDescription={handleUpdateFamilyDescription}
                onJoinRequest={handleJoinFamilyRequest}
                />
            )}
            {isAttackModalOpen && (
                <AttackModal 
                player={player}
                targetUser={attackTarget}
                outcome={attackOutcome}
                onClose={() => setIsAttackModalOpen(false)}
                />
            )}
            {isMyFamilyModalOpen && myFamily && (
                <MyFamilyModal
                family={myFamily}
                player={player}
                onlineUsers={onlineUsers}
                families={families}
                onClose={() => setIsMyFamilyModalOpen(false)}
                onUpdateDescription={handleUpdateFamilyDescription}
                onDonate={handleDonateToFamily}
                onBuyFamilyShopItem={handleBuyFamilyShopItem}
                onUpdateMemberRole={handleUpdateMemberRole}
                onAcceptJoinRequest={handleAcceptJoinRequest}
                onDeclineJoinRequest={handleDeclineJoinRequest}
                onSetFamilyRelation={handleSetFamilyRelation}
                />
            )}
            {isCityMapModalOpen && (
                <CityMapModal
                isOpen={isCityMapModalOpen}
                onClose={() => setIsCityMapModalOpen(false)}
                territories={territories.filter(t => t.locationId === player.location)}
                locationName={getCurrentLocationName()}
                player={player}
                families={families}
                onAttackTerritory={handleAttackTerritory}
                disabled={isBusy}
                />
            )}
            {isMessageModalOpen && (
                <MessageModal
                recipient={messageRecipient}
                onClose={() => setIsMessageModalOpen(false)}
                onSend={handleSendMessageToUser}
                />
            )}
            {isFriendsModalOpen && (
                <FriendsModal
                player={player}
                onlineUsers={onlineUsers}
                families={families}
                onClose={() => setIsFriendsModalOpen(false)}
                onAcceptFriendRequest={handleAcceptFriendRequest}
                onDeclineFriendRequest={handleDeclineFriendRequest}
                onRemoveFriend={handleRemoveFriend}
                onAddEnemy={handleAddEnemy}
                onRemoveEnemy={handleRemoveEnemy}
                />
            )}
            {isPrisonModalOpen && (
                <PrisonModal
                isOpen={isPrisonModalOpen}
                onClose={() => setIsPrisonModalOpen(false)}
                users={onlineUsers}
                playerLocation={player.location}
                onBreakOut={handleBreakOutAttempt}
                disabled={isBusy}
                />
            )}

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Column 1 */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                <PlayerStats 
                    player={player} 
                    effectiveMaxStamina={effectiveMaxStamina}
                    username={currentUser}
                    locationName={getCurrentLocationName()}
                    onRankClick={() => setIsRankModalOpen(true)}
                    onOpenProfileModal={handleOpenProfileAndResetLoginState}
                    onOpenBankModal={handleOpenBankModal}
                    onOpenSkillsModal={handleOpenSkillsModal}
                    onOpenPowerModal={() => setIsPowerModalOpen(true)}
                    onLogout={handleLogout}
                    justLoggedIn={justLoggedIn}
                />
                <CommunityPanel
                    player={player}
                    onOpenFriendsModal={() => setIsFriendsModalOpen(true)}
                    onOpenOnlineUsersModal={() => setIsOnlineUsersModalOpen(true)}
                    onOpenFamilyListModal={() => setIsFamilyListModalOpen(true)}
                    onOpenMyFamilyModal={() => setIsMyFamilyModalOpen(true)}
                    onOpenCreateFamilyModal={() => setIsCreateFamilyModalOpen(true)}
                    disabled={isBusy}
                />
                <CasinoPanel
                    onOpenOddsOrEvens={() => setIsOddsOrEvensModalOpen(true)}
                    onOpenHigherOrLower={() => setIsHigherOrLowerModalOpen(true)}
                    onOpenWheelOfFortune={() => setIsWheelOfFortuneModalOpen(true)}
                    disabled={isBusy}
                />
                </div>

                {/* Column 2 */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                <ActivityPanel 
                    player={player} 
                    harvestableWeed={calculateHarvestableWeed()}
                    onOpenCrimeModal={() => setIsCrimeModalOpen(true)} 
                    onOpenVehicleCrimeModal={() => setIsVehicleCrimeModalOpen(true)}
                    onOpenHeistModal={() => setIsHeistModalOpen(true)}
                    onOpenProductionModal={() => setIsProductionModalOpen(true)}
                    disabled={isBusy}
                />
                <LogFeed events={gameLog} />
                <Chatbox 
                    player={player}
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onlineUsers={onlineUsers}
                    onOpenProfile={handleOpenUserProfileModal}
                />
                </div>

                {/* Column 3 */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                <CrimesPanel
                    onOpenCrimeModal={() => setIsCrimeModalOpen(true)}
                    onOpenVehicleCrimeModal={() => setIsVehicleCrimeModalOpen(true)}
                    onOpenHeistModal={() => setIsHeistModalOpen(true)}
                    disabled={isBusy}
                />
                <LocationsPanel
                    onOpenShop={() => setIsShopModalOpen(true)}
                    onOpenCityMapModal={() => setIsCityMapModalOpen(true)}
                    onOpenTravelModal={() => setIsTravelModalOpen(true)}
                    onOpenPrisonModal={() => setIsPrisonModalOpen(true)}
                    onOpenHospitalModal={() => setIsHospitalModalOpen(true)}
                    onOpenBankModal={handleOpenBankModal}
                    disabled={isBusy}
                    isJailed={isJailed}
                />
                <OperationsPanel
                    onOpenBusiness={() => setIsBusinessModalOpen(true)}
                    onOpenDrugsModal={() => setIsDrugsModalOpen(true)}
                    onOpenProductionModal={() => setIsProductionModalOpen(true)}
                    onOpenGarageModal={() => setIsGarageModalOpen(true)}
                    onOpenPropertiesModal={() => setIsPropertiesModalOpen(true)}
                    disabled={isBusy}
                />
                </div>
            </div>
            
            <GameClock />
        </div>
      )}
    </>
  );
}
