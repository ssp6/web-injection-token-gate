import { Web3Provider } from "@ethersproject/providers"
import axios from 'axios'
import { TEthersProvider } from 'eth-hooks/models'
import { ethers } from 'ethers'
import React, { useCallback, useState, useEffect } from 'react'
import Web3Modal from "web3modal"
import { useGetUserFromProviders } from "eth-hooks"

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

const logoutOfWeb3Modal = async () => {
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
    console.log('App render')
    const [injectedProvider, setInjectedProvider] = useState<TEthersProvider>()
    const [isSigning, setIsSigning] = useState(false)
    const [jwtToken, setJwtToken] = useState()

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
        const message = "tokenValidation"
        const userSigner = user?.signer

        if (!web3Modal.cachedProvider) {
            // TODO: Show user error
            console.error('Cannot handle authentication in without provider')
            return
        }

        if (!userSigner) {
            // TODO: Show user error
            console.error('Cannot handle authentication in without signer signer')
            return
        }

        setIsSigning(true)

        try {
            // sign message using wallet
            const address = await userSigner.getAddress()
            let signature = await userSigner.signMessage(message)
            // send signature here for auth token
            // TODO: Grab guild id
            const { data } = await axios.post(
                `${API_BASE_URL}/signIn`,
                { signature, message, address, guildId: 1638 },
                {}
            )
            console.log(data)
            setJwtToken(data.body)

            // notify user of sign-in
            // TODO: Do something here, successful login!
        } catch (error) {
            // TODO: Show user error
            console.error(error)
        }

        setIsSigning(false)
    }


    return (
        <div className="App" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <h1>Membership site!</h1>

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
        </div>
    )
}

export default App