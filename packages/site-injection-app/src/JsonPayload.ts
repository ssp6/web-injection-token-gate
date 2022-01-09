/**
 * Payload of JWT given/received from backend
 */
export type JsonPayload = {
    /**
     * If the user has access to the community
     * TODO: Make something more secure the boolean
     */
    hasAccess: boolean
    /**
     * Users wallet public address
     */
    address: string
}
