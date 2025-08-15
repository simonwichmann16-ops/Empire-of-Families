
export const getWealthTier = (money: number): string => {
    if (money >= 500000000) return '1%';
    if (money >= 1000000) return 'Extremely Wealthy';
    if (money >= 100000) return 'Wealthy';
    if (money >= 10000) return 'Lavish';
    if (money >= 1000) return 'Livable';
    return 'Poor';
};
