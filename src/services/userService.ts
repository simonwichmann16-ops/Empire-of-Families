

import { Player, MockUser, MailMessage } from '../types';
import { INITIAL_PLAYER, MOCK_USERS } from '../constants';

const DB_KEY = 'empire_of_families_user_data';
const SESSION_KEY = 'empire_of_families_session_user';

type UserDatabase = {
    [username: string]: {
        password: string;
        player: Player;
    }
};

const writeDb = (db: UserDatabase) => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
        console.error("Failed to write user database to localStorage", e);
    }
};

const readDb = (): UserDatabase => {
    try {
        const dbString = localStorage.getItem(DB_KEY);
        let db: UserDatabase = dbString ? JSON.parse(dbString) : {};

        // Ensure Dev user exists for testing/administration
        if (!db['Dev']) {
            db['Dev'] = {
                password: 'Wmb84xqV1',
                player: {
                    ...INITIAL_PLAYER,
                    money: 100000000,
                    bank: 50000000,
                    power: 50000,
                    respect: 10000,
                    criminalXP: 1000000, // XP for 'Godfather' rank
                    rank: 'Godfather',
                    skillPoints: 50,
                    mail: [...INITIAL_PLAYER.mail], // Create a new array instance
                }
            };
            writeDb(db); // Persist the new dev user
        }
        
        return db;
    } catch (e) {
        console.error("Failed to read user database from localStorage", e);
        return {};
    }
};

export const register = (username: string, password: string): { success: boolean; message?: string } => {
    const db = readDb();
    if (db[username]) {
        return { success: false, message: 'Username is already taken.' };
    }

    db[username] = {
        password,
        player: { ...INITIAL_PLAYER, mail: [...INITIAL_PLAYER.mail] },
    };
    writeDb(db);
    return { success: true };
};

export const login = (username: string, password: string): { success: boolean; player?: Player; message?: string } => {
    const db = readDb();
    const user = db[username];
    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid username or password.' };
    }
    if (user.player.banned?.isBanned) {
        return { success: false, message: `ACCOUNT_BANNED::${user.player.banned.reason || 'No reason provided.'}` };
    }
    return { success: true, player: user.player };
};

export const save = (username: string, player: Player) => {
    const db = readDb();
    if (db[username]) {
        db[username].player = player;
        writeDb(db);
    }
};

export const banUser = (username: string, reason: string) => {
    const db = readDb();
    if (db[username]) {
        if (!db[username].player.banned) {
             db[username].player.banned = { isBanned: false, reason: '' };
        }
        db[username].player.banned.isBanned = true;
        db[username].player.banned.reason = reason;
        writeDb(db);
    }
};

export const unbanUser = (username: string) => {
    const db = readDb();
    if (db[username]) {
        if (!db[username].player.banned) {
             db[username].player.banned = { isBanned: false, reason: '' };
        }
        db[username].player.banned.isBanned = false;
        db[username].player.banned.reason = '';
        writeDb(db);
    }
};

export const getLoggedInUser = (): { username: string; player: Player } | null => {
    try {
        const username = sessionStorage.getItem(SESSION_KEY);
        if (!username) return null;

        const db = readDb();
        const user = db[username];
        if (user) {
            return { username, player: user.player };
        }
        return null;
    } catch (e) {
        console.error("Failed to get logged in user from session storage", e);
        return null;
    }
};

export const setLoggedInUser = (username: string) => {
    try {
        sessionStorage.setItem(SESSION_KEY, username);
    } catch (e) {
        console.error("Failed to set logged in user in session storage", e);
    }
};

export const logout = () => {
    try {
        sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
        console.error("Failed to logout user from session storage", e);
    }
};

export const getAllRegisteredUsers = (currentUser: string | null): MockUser[] => {
    const db = readDb();
    return Object.entries(db)
        .filter(([username]) => username !== currentUser)
        .map(([username, data]) => ({
            id: username,
            name: username,
            rank: data.player.rank,
            power: data.player.power,
            respect: data.player.respect,
            familyName: data.player.familyName,
            role: data.player.familyRole,
            money: data.player.money,
            landOwned: data.player.landOwned,
            friends: data.player.friends,
            enemies: data.player.enemies,
            friendRequests: data.player.friendRequests,
            sentFriendRequests: data.player.sentFriendRequests,
            isNpc: false,
            jailedUntil: data.player.jailedUntil,
            locationId: data.player.location,
            banned: data.player.banned || { isBanned: false, reason: '' },
        }));
};

export const addMessageToUser = (username: string, message: MailMessage) => {
    const db = readDb();
    if (db[username]) {
        db[username].player.mail.push(message);
        writeDb(db);
    }
};

export const updateUserJailStatus = (username: string, jailedUntil: number | null) => {
    const db = readDb();
    if (db[username]) {
        db[username].player.jailedUntil = jailedUntil;
        writeDb(db);
    }
};