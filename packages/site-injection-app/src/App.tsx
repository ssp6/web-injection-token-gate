import axios from 'axios'
import { TEthersProvider } from 'eth-hooks/models'
import { ethers } from 'ethers'
import React, { useCallback, useState, useEffect } from 'react'
import Web3Modal from "web3modal"
import { useGetUserFromProviders } from "eth-hooks"
import jwtDecode from "jwt-decode"
import { usePersistedString } from './hooks/usePersistedString'
import { JsonPayload } from './JsonPayload'
import { createAuthHeader } from './util/createAuthHeaer'
import { createMessage } from './util/createMessage'

const web3Modal = new Web3Modal({
    cacheProvider: true,
    // TODO: Add back WalletConnectProvider if required
    // providerOptions: {
    //     walletconnect: {
    //         package: WalletConnectProvider, // required
    //         options: {
    //             infuraId: INFURA_ID,
    //         },
    //     },
    // },
})

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const AUTH_TOKEN_KEY = 'jwtAuthToken'

const clearPersistedData = () => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

const logoutOfWeb3Modal = async () => {
    clearPersistedData()
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
        window.location.reload()
    }, 1)
}

// Reload provider when account is changed
window.ethereum && window.ethereum.on("accountsChanged", (accounts: string[]) => {
    web3Modal.cachedProvider &&
    setTimeout(() => {
        window.location.reload()
    }, 1)
})

function App() {
    const [injectedProvider, setInjectedProvider] = useState<TEthersProvider>()
    const [isSigning, setIsSigning] = useState(false)
    const [jwtToken, setJwtToken] = usePersistedString(AUTH_TOKEN_KEY, null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkIfUserHasAccess = async () => {
            if (!jwtToken) {
                return
            }
            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/userHasAccess`,
                    // @ts-expect-error - declared in html
                    { guildUrlName: document.guildUrlName },
                    {
                        headers: createAuthHeader(jwtToken),
                    },
                )
                // TODO: Update to something more secure
                setJwtToken(data.authToken.slice(1, -1))
            } catch (e) {
                // Do nothing - they'll just be presented with login flow again
                console.log("checkIfUserHasAccess: ", e)
                setJwtToken(null)
            }
        }
        checkIfUserHasAccess()
    }, [])

    const user = useGetUserFromProviders(injectedProvider)

    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect()
        setInjectedProvider(new ethers.providers.Web3Provider(provider))

        provider.on("chainChanged", (chainId: string) => {
            console.log(`chain changed to ${chainId}! updating providers`)
            setInjectedProvider(new ethers.providers.Web3Provider(provider))
        })

        provider.on("accountsChanged", () => {
            console.log(`account changed!`)
            setInjectedProvider(new ethers.providers.Web3Provider(provider))
        })

        // Subscribe to session disconnection
        provider.on("disconnect", (code: string, reason: string) => {
            console.log(code, reason)
            logoutOfWeb3Modal()
        })
    }, [setInjectedProvider])

    // Ensures stays signed in after cached
    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal()
        }
    }, [loadWeb3Modal])

    const handleSignIn = async () => {
        const userSigner = user?.signer

        // @ts-expect-error - declared in html
        const { guildUrlName } = document
        if (!guildUrlName) {
            console.error('Error in injection, guildUrlName is not set')
            setError('Error in injection, guildUrlName is not set')
            return
        }

        if (!web3Modal.cachedProvider) {
            console.error('Cannot handle authentication without provider')
            setError('Cannot handle authentication without provider')
            return
        }

        if (!userSigner) {
            console.error('Cannot handle authentication without user signer')
            setError('Cannot handle authentication without user signer')
            return
        }

        setIsSigning(true)

        const timeStamp = Date.now()
        try {
            // sign message using wallet
            const address = await userSigner.getAddress()
            const message = createMessage(guildUrlName, timeStamp)
            let signature = await userSigner.signMessage(message)
            const { data } = await axios.post(
                `${API_BASE_URL}/signIn`,
                { signature, address, guildUrlName, timeStamp },
            )
            // TODO: Update to something more secure
            setJwtToken(data.authToken)
        } catch (e) {
            console.error(e)
            setError(e.message)
        }

        setIsSigning(false)
        setError(null)
        setJwtToken(null)
    }

    // Remove cover if jwt
    useEffect(() => {
        // TODO: Update to something more secure
        if (jwtToken) {
            const decodedJwt = jwtDecode<JsonPayload>(jwtToken)
            if (!decodedJwt?.hasAccess) {
                setError('You do not have access to this community')
                return
            }
            // @ts-expect-error
            document.getElementById("fill-page-container").style.display = "none"
            // @ts-expect-error
            document.getElementsByTagName("body")[0].style = "max-height: 100%; width: 100%; overflow: unset"
            setError(null)
        }
    }, [jwtToken])

    return (
        <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', maxWidth: '100%' }}>
            <h1>Membership required to access</h1>

            {!injectedProvider ?
                <button
                    onClick={loadWeb3Modal}
                    key="connnectWalletButton"
                >
                    <h3>Connect Wallet</h3>
                </button>
                :
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                        onClick={logoutOfWeb3Modal}
                        key="disconnnectWalletButton"
                    >
                        <h3>Disconnect Wallet</h3>
                    </button>

                    <button
                        onClick={handleSignIn}
                        key="signInButton"
                        style={{ marginTop: 16, alignSelf: 'stretch' }}
                    >
                        <h3>Sign In!</h3>
                    </button>
                </div>
            }

            {isSigning && <h3 style={{ marginTop: 16 }}>Loading...</h3>}
            {error && <h4 style={{ overflowWrap: 'break-word', marginTop: 16 }}>{error}</h4>}
        </div>
    )
}

export default App
