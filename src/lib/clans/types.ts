export type ClanTagsType = {
    [key: string]: {
        [key: string]: string;
    };
};

export type ClanType = {
    tag: string;
    name: string;
    type: string;
    description: string;
    location: {
        id: number;
        name: string;
        isCountry: boolean;
        countryCode: string;
    };
    isFamilyFriendly: boolean;
    badgeUrls: {
        small: string;
        medium: string;
    };
    clanLevel: number;
    clanPoints: number;
    clanBuilderBasePoints: number;
    clanCapitalPoints: number;
    capitalLeague: {
        id: number;
        name: string;
    };
    requiredTrophies: number;
    warFrequency: string;
    warWinStreak: number;
    warWins: number;
    warTies: number;
    warLosses: number;
    isWarLogPublic: boolean;
    warLeague: {
        id: number;
        name: string;
    };
    members: number;
    memberList: ClanMemberType[];
    labels: {
        id: number;
        name: string;
        iconUrls: {
            small: string;
            medium: string;
        };
    }[];
    requiredBuilderBaseTrophies: number;
    requiredTownHallLevel: number;
    clanCapital: {
        capitalHallLevel: number;
        districts: {
            id: number;
            name: string;
            districtHallLevel: number;
        }[];
    };
    chatLanguage: {
        id: number;
        name: string;
        languageCode: string;
    };
};

export type ClanMemberType = {
    tag: string;
    name: string;
    role: string;
    townHallLevel: number;
    expLevel: number;
    league: {
        id: number;
        name: string;
        iconUrls: {
            small: string;
            tiny: string;
            medium: string;
        };
    };
    trophies: number;
    builderBaseTrophies: number;
    clanRank: number;
    previousClanRank: number;
    donations: number;
    donationsReceived: number;
    playerHouse: {
        elements: {
            type: string;
            id: number;
        }[];
    };
    builderBaseLeague: {
        id: number;
        name: string;
    };
};
