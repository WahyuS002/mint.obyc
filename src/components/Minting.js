import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../redux/data/dataActions'

import obycImg from '../images/obyc.png'

const truncate = (input, len) => (input.length > len ? `${input.substring(0, len)}...` : input)

export default function Minting() {
    const dispatch = useDispatch()
    const blockchain = useSelector((state) => state.blockchain)

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
                            <span className="bg-primary px-3 py-[0.2rem] rounded-full text-white font-bold text-xs absolute -bottom-2">7777 / 7777</span>
                        </div>
                    </div>
                </div>
                <div className="mx-3 px-5 py-4 rounded-xl bg-primary mb-6">
                    <div className="flex justify-center">
                        <div className="font-bold text-white text-2xl">Sold Out!!</div>
                    </div>
                </div>
                <div className="mx-3 mb-6 space-y-2 text-sm">
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
                    <button className="bg-[#50A873] hover:bg-emerald-600 transition-all duration-300 ease-in-out text-white px-8 py-2 font-semibold text-lg rounded-xl uppercase">
                        Buy on Opensea
                    </button>
                </div>
            </div>
        </div>
    )
}
