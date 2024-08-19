declare global {
    interface Config {
        PREFIX?: string
        activities?: Activities,
        status?: 'dnd' | 'online' | 'idle',
        clientId: string | undefined,
        developerId: string | undefined,
        log: Log,
        embedColor: EmbedColor
    }

}

interface Activities {
    name?: string
}

interface Log {
    guildId: string,
    guildJoinChannelId: string | undefined,
    guildLeaveChannelId: string | undefined,
    executeChannelId: string | undefined,
    uncaughtExceptionChannelId: string | undefined,
    errorChannelId: string | undefined,
}


interface EmbedColor {
    primary: string | undefined,
    invisible: string | undefined,
    alert: string | undefined
}

export {
    Config
}