

import { GoogleGenAI, Type } from "@google/genai";
import { Crime, Player, CrimeOutcome, SmugglingOutcome, Location, Drug, VehicleCrime, VehicleCrimeOutcome, WheelFortuneOutcome, HeistStage, FinalHeistOutcome, Heist, HeistStageOption, Family, Territory, FamilyRole } from '../types';
import { VEHICLES, SHOP_ITEMS, DRUGS } from '../constants';

// Safely get the API key in a browser environment
 const apiKey = import.meta.env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const crimeResultSchema = {
    type: Type.OBJECT,
    properties: {
        moneyGained: {
            type: Type.INTEGER,
            description: "The amount of money the player gained. MUST be 0 on failure."
        },
        xpGained: {
            type: Type.INTEGER,
            description: "The amount of Criminal Experience (XP) points the player gained. MUST be 0 on failure."
        },
        healthLost: {
            type: Type.INTEGER,
            description: "The amount of health points the player lost. Can be 0."
        },
        narrative: {
            type: Type.STRING,
            description: "A short, engaging, second-person narrative (2-4 sentences) describing what happened during the crime, from the player's perspective."
        },
        jailed: {
            type: Type.BOOLEAN,
            description: "Whether the player is sent to jail. MUST be false on success. On failure, this MUST be true."
        },
    },
    required: ["moneyGained", "xpGained", "healthLost", "narrative", "jailed"]
};

const finalHeistOutcomeSchema = {
    type: Type.OBJECT,
    properties: {
        success: {
            type: Type.BOOLEAN,
            description: 'Whether the final heist was successful or not.'
        },
        narrative: {
            type: Type.STRING,
            description: "A dramatic, cinematic, second-person narrative (3-5 sentences) of the heist's final execution and outcome. Describe the action and the result."
        },
        moneyGained: {
            type: Type.INTEGER,
            description: "The amount of money stolen. Must be within the heist's reward range. Should be 0 on failure."
        },
        xpGained: {
            type: Type.INTEGER,
            description: "The amount of XP gained. Must be within the heist's reward range. Should be 0 on failure."
        }
    },
    required: ["success", "narrative", "moneyGained", "xpGained"]
};

const vehicleCrimeResultSchema = {
    type: Type.OBJECT,
    properties: {
        xpGained: {
            type: Type.INTEGER,
            description: "The amount of Criminal Experience (XP) points gained on success. MUST be 0 on failure."
        },
        healthLost: {
            type: Type.INTEGER,
            description: "The amount of health points the player lost. Usually happens on failure. Can be 0."
        },
        narrative: {
            type: Type.STRING,
            description: "A short, engaging, second-person narrative (2-4 sentences) describing what happened during the vehicle theft, from the player's perspective."
        },
        vehicleGained: {
            type: Type.OBJECT,
            properties: {
                vehicleId: { type: Type.STRING, description: "The ID of the vehicle type that was stolen." },
                condition: { type: Type.INTEGER, description: "The condition of the stolen vehicle, as a percentage. Must be between 20 and 90." }
            },
            description: "An object containing details of the vehicle gained. This entire object MUST BE NULL if the crime fails.",
        }
    },
    required: ["xpGained", "healthLost", "narrative", "vehicleGained"]
};


const smugglingOutcomeSchema = {
    type: Type.OBJECT,
    properties: {
        success: {
            type: Type.BOOLEAN,
            description: "Whether the smuggling attempt was successful."
        },
        narrative: {
            type: Type.STRING,
            description: "A short, engaging, second-person narrative (2-4 sentences) describing the smuggling attempt, from the player's perspective. If it fails, describe how the shipment was intercepted. If successful, describe the shipment arriving safely at the destination port, ready for pickup."
        }
    },
    required: ["success", "narrative"]
};

const wheelFortuneOutcomeSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: { type: Type.STRING, description: "A fun, exciting, second-person narrative for the wheel spin result (2-3 sentences)." },
        prizeType: { type: Type.STRING, enum: ['money', 'xp', 'respect', 'drug', 'vehicle', 'nothing'], description: "The type of prize won. This is the MOST important field." },
        moneyGained: { type: Type.INTEGER, description: "Amount of money won. MUST be non-zero ONLY if prizeType is 'money'. Must be 0 otherwise." },
        xpGained: { type: Type.INTEGER, description: "Amount of XP won. MUST be non-zero ONLY if prizeType is 'xp'. Must be 0 otherwise." },
        respectGained: { type: Type.INTEGER, description: "Amount of respect won. MUST be non-zero ONLY if prizeType is 'respect'. Must be 0 otherwise." },
        drugsGained: {
             type: Type.OBJECT,
             properties: {
                drugId: { type: Type.STRING, enum: ['weed', 'pills'], description: "The ID of the drug won." },
                quantity: { type: Type.INTEGER, description: "The quantity of the drug won." }
             },
             description: "Details of the drugs won. This entire object MUST BE NULL if prizeType is not 'drug'.",
        },
        vehicleGained: {
             type: Type.OBJECT,
             properties: {
                vehicleId: { type: Type.STRING, enum: ['rusty_sedan'], description: "The ID of the vehicle type won." },
                condition: { type: Type.INTEGER, description: "The condition of the vehicle as a percentage. Must be between 50 and 95." }
             },
             description: "Details of the vehicle won. MUST BE NULL if prizeType is not 'vehicle'.",
        }
    },
    required: ["narrative", "prizeType", "moneyGained", "xpGained", "respectGained", "drugsGained", "vehicleGained"],
};

const turfWarNewsSchema = {
    type: Type.OBJECT,
    properties: {
        newsReport: {
            type: Type.STRING,
            description: "A short, gritty, news-ticker style report about the turf war event (1-2 sentences). Example: 'Gunfire echoed through the docks as The Gravano Crew made a violent push into Scorpion territory.'"
        }
    },
    required: ["newsReport"]
}

const familyNewsSchema = {
    type: Type.OBJECT,
    properties: {
        newsReport: {
            type: Type.STRING,
            description: "A short, gritty, official-sounding announcement for a private family chat (1-2 sentences). Example: 'The Don has spoken. VitoTheBlade is now a Caporegime. Show your respect.'"
        }
    },
    required: ["newsReport"]
};


export async function generateCrimeOutcome(crime: Crime, player: Player, wasSuccessful: boolean): Promise<Omit<CrimeOutcome, 'success'>> {
    if (!apiKey) {
        return {
            moneyGained: 0,
            xpGained: 0,
            healthLost: 0,
            narrative: "The connection to the underworld's network is down (API Key is not configured). You retreat without incident.",
            jailed: false
        };
    }

    const outcomeText = wasSuccessful ? "succeeded" : "failed";
    const prompt = `
        You are the game master for a text-based mafia MMO called "Empire Of Families". A player attempted the crime "${crime.name}" and ${outcomeText}.
        Your task is to generate a narrative and the resulting stats for this pre-determined outcome.

        - **Player's Stats**: Rank is ${player.rank}, Power is ${player.power}.
        - **Crime Details**: Name is "${crime.name}", Difficulty is ${crime.difficulty}.
        - **Outcome**: The crime was a ${outcomeText}.

        **CRITICAL INSTRUCTIONS**: 
        1.  Adhere strictly to the provided JSON schema for your response.
        2.  The 'narrative' must be a short, engaging, second-person story (2-4 sentences) describing the ${outcomeText}.
        3.  If it was a success: 'moneyGained' MUST be within [${crime.moneyRange[0]}, ${crime.moneyRange[1]}]. 'xpGained' should be a small, reasonable amount. 'healthLost' can be 0. 'jailed' MUST be false.
        4.  If it was a failure: 'moneyGained' and 'xpGained' MUST be 0. 'healthLost' can be greater than 0. The player IS ALWAYS sent to jail. Your narrative must reflect the player being caught. Set 'jailed' to true.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: crimeResultSchema,
                temperature: 0.9,
            }
        });

        const jsonStr = response.text.trim();
        const outcome = JSON.parse(jsonStr) as Omit<CrimeOutcome, 'success'>;
        return outcome;

    } catch (error) {
        console.error("Gemini API Error in generateCrimeOutcome:", error);
        return {
            moneyGained: 0,
            xpGained: 0,
            healthLost: 2,
            narrative: "You get a bad feeling and decide to lay low. Something's not right on the street tonight. You lose a little health from the stress.",
            jailed: false
        };
    }
}

export async function generateVehicleCrimeOutcome(crime: VehicleCrime, player: Player, wasSuccessful: boolean): Promise<Omit<VehicleCrimeOutcome, 'success'>> {
    if (!apiKey) {
        return {
            xpGained: 0,
            healthLost: 0,
            narrative: "The connection to the underworld's network is down (API Key is not configured). You retreat without incident.",
            vehicleGained: null
        };
    }
    const targetVehicle = VEHICLES.find(v => v.id === crime.targetVehicleId);
    const outcomeText = wasSuccessful ? "succeeded" : "failed";

    const prompt = `
        You are the game master for a text-based mafia MMO called "Empire Of Families". A player attempted to steal a ${targetVehicle?.name} and ${outcomeText}.
        Your task is to generate a narrative and the resulting stats for this pre-determined outcome.

        - **Player's Stats**: Rank is ${player.rank}, Power is ${player.power}.
        - **Crime Details**: Name is "${crime.name}", Difficulty is ${crime.difficulty}.
        - **Outcome**: The theft was a ${outcomeText}.

        **CRITICAL INSTRUCTIONS**: 
        1.  Adhere strictly to the provided JSON schema for your response.
        2.  The 'narrative' must be in the second person ("You...").
        3.  If it was a success: you MUST return a 'vehicleGained' object with the vehicle's ID ('${crime.targetVehicleId}') and a random condition between 20 and 90. 'xpGained' should be a reasonable amount.
        4.  If it was a failure: 'vehicleGained' MUST be null, 'healthLost' can be greater than 0, and 'xpGained' must be 0. The player IS ALWAYS sent to jail, so your narrative must reflect them being caught.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: vehicleCrimeResultSchema,
                temperature: 0.9,
            }
        });

        const jsonStr = response.text.trim();
        const outcome = JSON.parse(jsonStr) as Omit<VehicleCrimeOutcome, 'success'>;
        return outcome;
    } catch (error) {
        console.error("Gemini API Error in generateVehicleCrimeOutcome:", error);
        return {
            xpGained: 0,
            healthLost: 5,
            narrative: "You try to jimmy the lock, but the car alarm blares. You take off running, tripping and scraping your knee in the process.",
            vehicleGained: null,
        };
    }
}

export async function generateSmugglingOutcome(drug: Drug, quantity: number, origin: Location, destination: Location, player: Player, methodBonus: number): Promise<SmugglingOutcome> {
    if (!apiKey) {
        return {
            success: false,
            narrative: "The connection to the underworld's network is down (API Key is not configured). The shipment is lost."
        };
    }

    const prompt = `
        You are the game master for a text-based mafia MMO. A player is attempting to smuggle drugs. Determine the outcome.

        - **Player's Stats**: Rank is ${player.rank}, Power is ${player.power}.
        - **Shipment**: ${quantity} units of ${drug.name}.
        - **Route**: From ${origin.name} to ${destination.name}.
        - **Method Bonus**: The chosen smuggling method provides a ${methodBonus}% bonus to success chance.

        Consider the player's stats, the risk of the route (longer distances are riskier), and the method bonus.
        - A powerful, high-ranking player has a better chance of success.
        - Write a short, second-person narrative describing what happened. If it fails, describe how the shipment was intercepted (e.g., customs, rival gang). If successful, describe its safe arrival.

        **CRITICAL INSTRUCTIONS**: Adhere strictly to the provided JSON schema.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: smugglingOutcomeSchema,
                temperature: 1.0,
            }
        });

        const jsonStr = response.text.trim();
        const outcome = JSON.parse(jsonStr) as SmugglingOutcome;
        return outcome;

    } catch (error) {
        console.error("Gemini API Error in generateSmugglingOutcome:", error);
        return {
            success: false,
            narrative: "An unexpected customs inspection at the port dooms your shipment. The goods are seized and your contact goes dark."
        };
    }
}

export async function generateWheelSpinOutcome(player: Player): Promise<WheelFortuneOutcome> {
    const prompt = `
        You are a casino game master for a text-based mafia MMO. The player is spinning the "Wheel of Fortune". Generate a random, fun outcome based on the following weighted probabilities.
        
        **ABSOLUTELY CRITICAL INSTRUCTIONS**: 
        1. You MUST select ONLY ONE prize from the list below based on its exact probability.
        2. You MUST set the 'prizeType' field to match the chosen prize category.
        3. You MUST ensure that ONLY the field corresponding to the 'prizeType' has a non-zero/non-null value. All other prize fields MUST be 0 or null. This is extremely important to prevent game bugs.
        
        **Prize List & Probabilities**:
        - **$1000 Money:** 30% chance. (prizeType: 'money', moneyGained: 1000)
        - **5 units of Weed:** 20% chance. (prizeType: 'drug', drugsGained: { drugId: 'weed', quantity: 5 })
        - **5000€:** 10% chance. (prizeType: 'money', moneyGained: 5000)
        - **A low-tier random vehicle:** 10% chance. (prizeType: 'vehicle', vehicleGained: { vehicleId: 'rusty_sedan', condition: (random 50-95) })
        - **500 XP:** 10% chance. (prizeType: 'xp', xpGained: 500)
        - **5 units of Pills:** 10% chance. (prizeType: 'drug', drugsGained: { drugId: 'pills', quantity: 5 })
        - **1 Respect:** 5% chance. (prizeType: 'respect', respectGained: 1)
        - **Nothing:** 5% chance. (prizeType: 'nothing', all gain fields are 0 or null)
        
        **Example of a correct response for winning money**:
        { "prizeType": "money", "moneyGained": 1000, "xpGained": 0, "respectGained": 0, "drugsGained": null, "vehicleGained": null, "narrative": "..." }

        **Example of a correct response for winning a vehicle**:
        { "prizeType": "vehicle", "moneyGained": 0, "xpGained": 0, "respectGained": 0, "drugsGained": null, "vehicleGained": { "vehicleId": "rusty_sedan", "condition": 88 }, "narrative": "..." }

        Now, generate the outcome for the player's spin. Player rank for context: ${player.rank}.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: wheelFortuneOutcomeSchema,
                temperature: 1.2,
            }
        });

        const jsonStr = response.text.trim();
        const outcome = JSON.parse(jsonStr) as WheelFortuneOutcome;
        return outcome;

    } catch (error) {
        console.error("Gemini API Error in generateWheelSpinOutcome:", error);
        return {
            prizeType: 'nothing',
            narrative: "The wheel spins... and lands on a dud. Better luck next time!",
            moneyGained: 0,
            xpGained: 0,
            respectGained: 0,
            drugsGained: null,
            vehicleGained: null,
        };
    }
}


export async function generateFinalHeistOutcome(heist: Heist, player: Player, finalSuccessChance: number, finalFailureChance: number, vehicleName?: string): Promise<FinalHeistOutcome> {
    if (!apiKey) {
        return { success: false, narrative: "The plan went sideways. The connection to your crew dropped at a critical moment.", moneyGained: 0, xpGained: 0 };
    }
    const prompt = `
        You are a dramatic storyteller for a text-based mafia MMO. A player is executing the final stage of a heist.
        
        Heist: "${heist.name}" - ${heist.description}
        Player Rank: ${player.rank}
        Vehicle: ${vehicleName || 'None'}
        
        The player's final success chance is ${finalSuccessChance}% and their critical failure chance (resulting in capture/jail) is ${finalFailureChance}%.
        
        Generate the outcome.
        - If it's a success, write a cinematic narrative of the escape and award money and XP within the heist's reward range of $${heist.finalReward.money[0]}-${heist.finalReward.money[1]} and ${heist.finalReward.xp[0]}-${heist.finalReward.xp[1]} XP.
        - If it's a failure, write a narrative of what went wrong, which resulted in the player being caught and sent to jail. The money and XP should be 0.
        - Ensure the narrative is exciting and in the second person ("You...").
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: finalHeistOutcomeSchema,
                temperature: 1.0,
            }
        });

        const jsonStr = response.text.trim();
        const outcome = JSON.parse(jsonStr) as FinalHeistOutcome;
        return outcome;

    } catch (error) {
        console.error("Gemini API Error in generateFinalHeistOutcome:", error);
        return {
            success: false,
            narrative: "A silent alarm you didn't account for floods the building with cops. You barely escape with your life, but the score is a bust.",
            moneyGained: 0,
            xpGained: 0,
        };
    }
}

export async function generateTurfWarNews(attackingFamily: Family, defendingFamily: Family | undefined, territory: Territory, type: 'attack' | 'conquer'): Promise<string> {
    const prompt = `
        You are a news reporter for a gritty, underground newspaper in a mafia-themed game. Write a short, punchy news report (1-2 sentences) about a turf war event.
        
        Event: The "${attackingFamily.name}" family has just ${type === 'attack' ? 'attacked' : 'conquered'} the "${territory.name}" territory.
        ${defendingFamily ? `The territory was previously held by The "${defendingFamily.name}" family.` : 'The territory was previously neutral.'}
        
        Keep it concise and in the style of a news ticker.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: turfWarNewsSchema
            }
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.newsReport || 'The streets are talking about a major power shift in the city.';
    } catch (error) {
        console.error("Gemini API Error in generateTurfWarNews:", error);
        return `${attackingFamily.name} forces were seen making a move on ${territory.name}. Blood is sure to follow.`;
    }
}

export async function generateFamilyNews(donRank: string, memberName: string, oldRole: FamilyRole | null, newRole: FamilyRole): Promise<string> {
    const prompt = `
        You are a consigliere in a mafia family, writing an internal announcement for the family's private chat.
        The Don (who has a rank of ${donRank}) has just changed a member's role.
        
        - Member: ${memberName}
        - Old Role: ${oldRole || 'Unassigned'}
        - New Role: ${newRole}
        
        Write a short, formal, in-character announcement (1-2 sentences) about this promotion or demotion. For example: "By order of the Don, ${memberName} will now serve as a ${newRole}. See that they are shown the proper respect."
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: familyNewsSchema
            }
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.newsReport || `An announcement from the Don: ${memberName} is now a ${newRole}.`;
    } catch (error) {
        console.error("Gemini API Error in generateFamilyNews:", error);
        return `Word from the top: ${memberName}'s position has been changed to ${newRole}.`;
    }
}
