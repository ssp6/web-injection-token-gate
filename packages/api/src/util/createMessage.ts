/**
 * Creates message for signing into backend
 *
 * @param guildUrlName
 * @param timeStamp
 */
export const createMessage = (guildUrlName: string, timeStamp: number) =>
    `Sign into ${guildUrlName} at ${timeStamp}`
