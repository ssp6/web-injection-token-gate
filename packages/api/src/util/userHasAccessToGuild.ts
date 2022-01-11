import axios from 'axios'
import { AGORA_SPACE_API_BASE } from './consts'

/**
 * Partial of the data about a guild
 */
type GuildInfo = {
    id: number
    name: string,
    urlName: string,
    description: string
}

type GuildRoleStatus = {
    roleId: number
    access: true
}

/**
 * Checks that the user has access to at least one role in
 * the agora.space guild
 *
 * @param userAddress Address of user's wallet
 * @param guildUrlName Id of guild/community as dictated by agora.space
 */
export const userHasAccessToGuild = async (userAddress: string, guildUrlName: string) => {
    try {
        const { data } = await axios.get<GuildInfo>(`${AGORA_SPACE_API_BASE}/guild/urlName/${guildUrlName}`)
        const result = await axios.get<GuildRoleStatus[]>(`${AGORA_SPACE_API_BASE}/guild/access/${data.id}/${userAddress}`)
        return result.data.some((guildRoleStatus) => guildRoleStatus.access)

    } catch (e) {
        throw new Error(`Error receiving guild status: ${e.message}`)
    }
}
