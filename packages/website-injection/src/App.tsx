import { Web3Provider } from "@ethersproject/providers"
import { TEthersProvider } from 'eth-hooks/models'
import React, { useCallback, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from "web3modal"
// TODO: Possibly add back wallet connect if required
// import WalletConnectProvider from "@walletconnect/web3-provider"
import { useGetUserFromProviders } from "eth-hooks"

const provider = new ethers.providers.Web3Provider(window.ethereum)
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

const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
        window.location.reload()
    }, 1)
}

// Reload provider when account is changed
window.ethereum && window.ethereum.on("accountsChanged", (accounts: string[]) => {
    // TODO: Remove
    console.log(`Changed accounts: ${accounts}`)
    web3Modal.cachedProvider &&
    setTimeout(() => {
        window.location.reload()
    }, 1)
})

function App() {
    console.log('App render')
    const [injectedProvider, setInjectedProvider] = useState<TEthersProvider>()

    // useWeb3Modal({ cacheProvider: true }, (p) => setInjectedProvider(p))
    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect()
        setInjectedProvider(new Web3Provider(provider))
    }, [setInjectedProvider])

    // Ensures stays signed in after cached
    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal()
        }
    }, [loadWeb3Modal])

    // const address = useGetUserFromProviders(injectedProvider)

    return (
        <div className="App">
            <header className="App-header">
                <h1>Membership site!</h1>

                {!injectedProvider ?
                    <button
                        onClick={loadWeb3Modal}
                        key="loginbutton"
                    >
                        <h3>Connect Wallet</h3>
                    </button>
                    :
                    <button
                        onClick={logoutOfWeb3Modal}
                        key="logoutButton"
                    >
                        <h3>Disconnect Wallet</h3>
                    </button>
                }
            </header>
        </div>
    )
}

export default App
