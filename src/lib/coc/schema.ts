import { z } from "zod";

export const clanForm: {
    [key: string]: {
        desc: string;
        type: "text" | "number";
        placeholder: string;
    };
} = {
    tag: {
        desc: "Clan Tag (include #)",
        type: "text",
        placeholder: "#ABCDEFGHI"
    },
    clanCode: {
        desc: "Clan Code",
        type: "text",
        placeholder: "Clan Code"
    },
    clanRoleID: {
        desc: "Clan Role ID",
        type: "text",
        placeholder: "Clan Role ID"
    },
    memberRoleID: {
        desc: "Member Role ID",
        type: "text",
        placeholder: "Member Role ID"
    },
    elderRoleID: {
        desc: "Elder Role ID",
        type: "text",
        placeholder: "Elder Role ID"
    },
    coleaderRoleID: {
        desc: "Co-Leader Role ID",
        type: "text",
        placeholder: "Co-Leader Role ID"
    },
    leaderRoleID: {
        desc: "Leader Role ID",
        type: "text",
        placeholder: "Leader Role ID"
    },
    leaderID: {
        desc: "Leader ID",
        type: "text",
        placeholder: "Leader ID"
    },
    channelID: {
        desc: "Channel ID",
        type: "text",
        placeholder: "Channel ID"
    },
    attacksRequirement: {
        desc: "Attacks Requirement",
        type: "number",
        placeholder: "Attacks Requirement"
    },
    donationsRequirement: {
        desc: "Donations Requirement",
        type: "number",
        placeholder: "Donations Requirement"
    },
    clangamesRequirement: {
        desc: "Clan Games Requirement",
        type: "number",
        placeholder: "Clan Games Requirement"
    }
};

export const clanFormSchema = z.object({
    tag: z.string().min(5).startsWith("#"),
    clanCode: z.string().length(2).nonempty(),
    clanRoleID: z.string().max(19).nonempty(),
    memberRoleID: z.string().max(19).nonempty(),
    elderRoleID: z.string().max(19).nonempty(),
    coleaderRoleID: z.string().max(19).nonempty(),
    leaderRoleID: z.string().max(19).nonempty(),
    leaderID: z.string().max(19).nonempty(),
    channelID: z.string().max(19).nonempty(),
    attacksRequirement: z.number().int(),
    donationsRequirement: z.number().int(),
    clangamesRequirement: z.number().int()
});
