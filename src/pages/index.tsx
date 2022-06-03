import React from "react"
import fontawesome from "@fortawesome/fontawesome"
import { faTimes } from "@fortawesome/fontawesome-free-solid"
import { Web3ReactProvider } from "@web3-react/core"
import { MetaMaskProvider } from "../hooks/useMetamask"
import Web3 from "web3"
import App from "../partials/app"

function getLibrary (provider, _connector) {
  return new Web3(provider)
}

fontawesome.library.add(faTimes)

const Home = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <App />
      </MetaMaskProvider>
    </Web3ReactProvider>
  )
}

export default Home
