import axios from 'axios'
import { AGORA_SPACE_API_BASE } from './consts'

type GuildRoleStatus = {
    roleId: number
    access: true
}

/**
 * Checks that the user has access to at least one role in
 * the agora.space guild
 *
 * @param userAddress Address of user's wallet
 * @param guildId Id of guild/community as dictated by agora.space
 */
export const userHasAccessToGuild = async (userAddress: string, guildId: number) => {
    try {
        const data = await axios.get<GuildRoleStatus[]>(`${AGORA_SPACE_API_BASE}/guild/access/${guildId}/${userAddress}`)
        return data.data.some((guildRoleStatus) => guildRoleStatus.access)

    } catch (e: any) {
        throw new Error(`Error receiving guild status: ${e.message}`)
    }
}
