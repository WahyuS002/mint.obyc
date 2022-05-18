import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../redux/data/dataActions'
import { connect } from '../redux/blockchain/blockchainActions'
import Web3 from 'web3'

import { toast } from 'react-toastify'

import obycImg from '../images/obyc.jpg'

const truncate = (input, len) => (input.length > len ? `${input.substring(0, len)}...` : input)

const web3 = new Web3()

export default function Minting() {
    const dispatch = useDispatch()
    const blockchain = useSelector((state) => state.blockchain)
    const data = useSelector((state) => state.data)

    const [claimingNft, setClaimingNft] = useState(false)

    const [mintAmount, setMintAmount] = useState(1)
    const [canIncrement, setCanIncrement] = useState(true)
    const [canDecrement, setCanDecrement] = useState(false)

    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: '',
        SCAN_LINK: '',
        NETWORK: {
            NAME: '',
            SYMBOL: '',
            ID: 0,
        },
        NFT_NAME: '',
        SYMBOL: '',
        MAX_SUPPLY: 0,
        GAS_LIMIT: 0,
    })

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1
        if (newMintAmount === 1) {
            setCanDecrement(false)
        }
        if (newMintAmount < 1) {
            newMintAmount = 1
        }
        setMintAmount(newMintAmount)
        setCanIncrement(true)
    }

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1
        if (newMintAmount === 40) {
            setCanIncrement(false)
        }
        if (newMintAmount > 40) {
            newMintAmount = 40
        }
        setMintAmount(newMintAmount)
        setCanDecrement(true)
    }

    const getConfig = async () => {
        const configResponse = await fetch('/config/config.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
        const config = await configResponse.json()
        SET_CONFIG(config)
    }

    const getData = () => {
        if (blockchain.account !== '' && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account))
        }
    }

    const claimNFTs = () => {
        let cost = data.cost
        let gasLimit = CONFIG.GAS_LIMIT
        let totalCostWei = String(cost * mintAmount)

        if (data.paused) {
            toast.info('Minting will open soon.')
        } else {
            console.log('Current Wallet Supply : ', data.currentWalletSupply)
            if (parseInt(mintAmount) + parseInt(data.totalSupply) > parseInt(data.maxSupply)) {
                toast.warning('You have exceeded the max limit of minting.')
            } else {
                if (data.isFreeMintOpen) {
                    return freeMintTokens(gasLimit)
                } else {
                    return mintTokens(gasLimit, totalCostWei)
                }
            }
        }
    }

    const freeMintTokens = (gasLimit) => {
        if (parseInt(data.currentWalletSupply) + mintAmount > parseInt(data.maxFreeMintAmountPerAddr)) {
            toast.warning('Exceeds max free mint per wallet!')
        } else if (parseInt(data.totalSupply) + mintAmount > parseInt(data.maxFreeMintSupply)) {
            toast.warning('Exceeds max free mint supply!')
        } else {
            toast.info(`Minting your free ${CONFIG.NFT_NAME}...`)
            setClaimingNft(true)
            return blockchain.smartContract.methods
                .freeMint(mintAmount)
                .send({
                    gasLimit: gasLimit,
                    to: CONFIG.CONTRACT_ADDRESS,
                    from: blockchain.account,
                })
                .once('error', () => {
                    toast.error('Sorry, something went wrong please try again later.')
                    setClaimingNft(false)
                })
                .then(() => {
                    toast.success(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`)
                    setClaimingNft(false)
                    dispatch(fetchData(blockchain.account))
                })
        }
    }

    const mintTokens = (gasLimit, totalCostWei) => {
        if (mintAmount > parseInt(data.maxMintAmountPerTx)) {
            toast.warning('Exceeds max mint amount per tx!')
        } else if (parseInt(data.totalSupply) + mintAmount > parseInt(data.maxSupply)) {
            toast.warning('Max supply exceeded!')
        } else if (parseInt(data.currentWalletSupply) + mintAmount > 40) {
            toast.warning('Exceeds max mint per wallet!')
        } else {
            toast.info(`Minting your ${CONFIG.NFT_NAME}...`)
            setClaimingNft(true)
            return blockchain.smartContract.methods
                .mint(mintAmount)
                .send({
                    gasLimit: gasLimit,
                    to: CONFIG.CONTRACT_ADDRESS,
                    from: blockchain.account,
                    value: totalCostWei,
                })
                .once('error', (err) => {
                    console.log(err)
                    toast.error('Sorry, something went wrong please try again later.')
                    setClaimingNft(false)
                })
                .then((receipt) => {
                    console.log(receipt)
                    toast.success(`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`)
                    setClaimingNft(false)
                    dispatch(fetchData(blockchain.account))
                })
        }
    }

    const isWalletConnected = () => {
        return blockchain.account
    }

    const isContractReady = () => {
        return blockchain.smartContract
    }

    const isLoading = () => {
        return data.loading
    }

    useEffect(() => {
        getConfig()
    }, [])

    useEffect(() => {
        getData()
    }, [blockchain.account])

    return (
        <div className="flex h-[75vh]">
            <div className="mx-3 md:mx-auto my-auto md:w-1/3 bg-secondary px-3 md:px-12 py-8 rounded-xl border-2 border-primary">
                <div className="flex justify-center">
                    <div className="w-44 h-44 relative mb-5">
                        <img className="rounded-xl border-[3px] border-primary" src={obycImg} alt="" />
                        <div className="flex justify-center">
                            <span className="bg-primary px-3 py-[0.2rem] rounded-full text-white font-bold text-xs absolute -bottom-2">
                                {isWalletConnected() && isContractReady() && !isLoading() ? data.totalSupply : 'XXX'} / 7777
                            </span>
                        </div>
                    </div>
                </div>
                {isWalletConnected() && isContractReady() && !isLoading() ? (
                    <h5 className="text-center text-xl font-semibold text-gray-700 mb-4">Mint Your OBYC</h5>
                ) : (
                    <h5 className="text-center text-xl font-semibold text-gray-700 mb-4">Please connect to {CONFIG.NETWORK.NAME} network.</h5>
                )}
                <div className="mx-3 px-5 py-4 rounded-xl bg-primary mb-6">
                    <div className="flex justify-between font-semibold text-white mb-3">
                        <p>Mint Amount</p>
                        <div className="flex items-center space-x-3">
                            <button
                                className="bg-secondary hover:bg-gray-700 hover:text-white transition-all duration-300 ease-in-out rounded-full p-[0.2rem] text-primary"
                                onClick={(e) => {
                                    e.preventDefault()
                                    decrementMintAmount()
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[0.8rem] w-[0.8rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                            </button>
                            <span>{mintAmount}</span>
                            <button
                                className="bg-secondary hover:bg-gray-700 hover:text-white transition-all duration-300 ease-in-out rounded-full p-[0.2rem] text-primary"
                                onClick={(e) => {
                                    e.preventDefault()
                                    incrementMintAmount()
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[0.8rem] w-[0.8rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between font-semibold text-white">
                        <p>Total Price</p>
                        <p>
                            {isWalletConnected() && isContractReady() && !isLoading() ? (
                                <>{!data.isFreeMintOpen ? web3.utils.fromWei(web3.utils.toBN(data.cost)) * mintAmount + ' ETH' : 'Free'}</>
                            ) : (
                                '-'
                            )}
                        </p>
                    </div>
                </div>
                <div className="mx-3 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Mint Type</span>
                        <span>
                            {isWalletConnected() && isContractReady() && !isLoading() ? (
                                <>{data.paused ? 'Contract is Paused' : <>{data.isFreeMintOpen ? `Free Mint (Max ${data.maxFreeMintAmountPerAddr})` : 'Public Mint'}</>}</>
                            ) : (
                                '-'
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Price</span>
                        <span>{isWalletConnected() && isContractReady() && !isLoading() ? web3.utils.fromWei(web3.utils.toBN(data.cost)) + ' ETH' : '-'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Network</span>
                        <span>{CONFIG.NETWORK.NAME}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Smart Contract</span>
                        <a href={CONFIG.SCAN_LINK} target={'_blank'} rel="noreferrer">
                            {truncate(CONFIG.CONTRACT_ADDRESS, 12)}{' '}
                        </a>
                    </div>
                </div>
                <div className="flex justify-center">
                    {claimingNft && (
                        <button className="bg-[#50A873] hover:bg-emerald-600 transition-all duration-300 ease-in-out text-white px-8 py-2 font-semibold text-lg rounded-xl uppercase cursor-not-allowed">
                            Minting . . .
                        </button>
                    )}
                    {isWalletConnected() && isContractReady() && !isLoading() && !claimingNft ? (
                        <button
                            className="bg-[#50A873] hover:bg-emerald-600 transition-all duration-300 ease-in-out text-white px-8 py-2 font-semibold text-lg rounded-xl uppercase"
                            onClick={(e) => {
                                e.preventDefault()
                                claimNFTs()
                                getData()
                            }}
                        >
                            Mint
                        </button>
                    ) : (
                        <>
                            {isLoading() && !claimingNft ? (
                                <button className="bg-[#50A873] hover:bg-emerald-600 transition-all duration-300 ease-in-out text-white px-8 py-2 font-semibold text-lg rounded-xl uppercase cursor-not-allowed">
                                    Loading . . .
                                </button>
                            ) : (
                                <>
                                    {!claimingNft && (
                                        <button
                                            className="bg-[#50A873] hover:bg-emerald-600 transition-all duration-300 ease-in-out text-white px-8 py-2 font-semibold text-lg rounded-xl uppercase"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                dispatch(connect())
                                                getData()
                                            }}
                                        >
                                            Connect Wallet
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
