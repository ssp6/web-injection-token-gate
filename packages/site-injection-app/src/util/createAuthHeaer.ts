export const createAuthHeader = (authToken: string) => ({
    'Authorization': `Bearer ${authToken}`
})
