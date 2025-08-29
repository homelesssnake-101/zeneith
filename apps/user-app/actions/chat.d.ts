export declare function getChats(personNumber: string): Promise<{
    id: string;
    toPhone: string;
    fromPhone: string;
    message: string | null;
    imageUrl: string | null;
    imageCaption: string | null;
    timestamp: Date;
    time: string;
    status: string;
    type: string;
}[]>;
//# sourceMappingURL=chat.d.ts.map