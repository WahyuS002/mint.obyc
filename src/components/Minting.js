import React from 'react'

export default function Minting() {
    return (
        <div className="flex h-[75vh]">
            <div className="m-auto w-1/3 bg-secondary px-12 py-8 rounded-xl border-2 border-primary">
                <div className="flex justify-center">
                    <div className="w-44 h-44 relative mb-5">
                        <img className="rounded-xl" src="https://moonlightbirdy.com/static/media/minting.5ad8abddcdf9f838db0f.png" alt="" />
                        <div className="flex justify-center">
                            <span className="bg-primary px-3 py-[0.2rem] rounded-full text-white font-bold text-xs absolute -bottom-2">XXX / 7.777</span>
                        </div>
                    </div>
                </div>
                <h5 className="text-center text-xl font-semibold text-gray-700 mb-4">Mint Your Okay Bears Yacht Club</h5>
                <div className="mx-3 px-5 py-4 rounded-xl bg-primary mb-6">
                    <div className="flex justify-between font-semibold text-white mb-3">
                        <p>Mint Amount</p>
                        <div className="flex items-center space-x-3">
                            <button className="bg-secondary rounded-full p-[0.2rem] text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[0.8rem] w-[0.8rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                                </svg>
                            </button>
                            <span>5</span>
                            <button className="bg-secondary rounded-full p-[0.2rem] text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[0.8rem] w-[0.8rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between font-semibold text-white">
                        <p>Price</p>
                        <p>0.01 ETH</p>
                    </div>
                </div>
                <div className="mx-3 mb-6 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Price</span>
                        <span>0.001 ETH</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Network</span>
                        <span>Ethereum</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Smart Contract</span>
                        <span>0x13kdsldsk.. </span>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="bg-[#50A873] text-white px-8 py-2 font-semibold text-lg rounded-xl uppercase">Mint</button>
                </div>
            </div>
        </div>
    )
}
