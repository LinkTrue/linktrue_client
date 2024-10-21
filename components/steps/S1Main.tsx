"use client"
import { useSteps } from '@/context/StepsContext'
import { useBlockchain } from "@/context/BlockchainProvider";
import BlockchainComponent from '../ConnectWallet';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useContractMethods } from '@/hooks/useContractMethods';
import { useGlobalState } from '@/context/GlobalStateContext';
import { parseProfileData } from '@/lib/utils';
import { useLogger } from '@/context/LoggerContext';


const S1Main = () => {
    const { logException } = useLogger();
    const { nextStep } = useSteps();
    const { signer, isConnected, isConnecting } = useBlockchain();
    const { userProfile, setUserProfile } = useGlobalState();

    const { getProfileByWallet, isSmartContractInitialized } = useContractMethods();
    const [isOwner, setIsOwner] = useState<boolean>(false);

    useEffect(() => {
        if (isSmartContractInitialized && signer?.address) {
            getProfileByWallet(signer.address).then(profile => {
                const cleanedData = parseProfileData(profile);
                if (cleanedData.username) {
                    setUserProfile(
                        {
                            avatar: '',//todo what to do?
                            username: cleanedData.username,
                            web2Items: cleanedData.web2Items,
                            web3Items: cleanedData.web3Items
                        }
                    )
                    setIsOwner(true);
                }
            }).catch(err => {
                logException(err)
            })
        }
    }, [isSmartContractInitialized, signer]);


    return (
        isConnecting ?
            <div className='text-center'>
                <div className='spinner'></div>
            </div>
            :
            <div className='flex flex-col justify-start gap-y-14  p-4 text-center bg-gray-50 rounded-lg shadow-md'>
                {!isConnected &&
                    <div className="max-w-md mx-auto p-4 text-center bg-gray-50 rounded-lg shadow-md">
                        <h2 className="mb-2">Enable crypto donations with</h2>
                        <ul>
                            <li>confidence</li>
                            <li>&</li>
                            <li>full ownership</li>
                        </ul>
                    </div>
                }

                <ul className="list-inside 
            font-thin md:text-xl lg:text-2xl xl:text-2xl
            text-center font-[family-name:var(--font-geist-mono)]">
                    {isConnected &&
                        <li className="mb-2">
                            <span>
                                {
                                    isOwner ?
                                        <>
                                            Welcome {userProfile.username}!
                                            <br />
                                            <br />
                                            You can now
                                            <Link href="/profile/edit" className='text-orange-400'>
                                                <b> Adjust </b>
                                            </Link>
                                            your profile.
                                        </>
                                        :
                                        <>
                                            A Bio Link You Control, Forever.
                                        </>
                                }
                            </span>
                        </li>
                    }
                </ul>
                <span className="p-10">
                    {isConnected && isOwner ?
                        <Link href={`/${userProfile.username}`} target='_blank'>
                            View your profile{' '}
                            <i className="fas fa-external-link-alt"></i>
                        </Link> :
                        <Link href={'/@milad'} target='_blank'>
                            View a sample profile{' '}
                            <i className="fas fa-external-link-alt"></i>
                        </Link>
                    }
                </span>

                <div className="flex gap-4 items-center flex-col">
                    <div>
                        <BlockchainComponent />
                        {isConnected && !isOwner && (
                            <button
                                className="rounded-full border-2 border-white transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                                onClick={nextStep}
                            >
                                Build a profile now
                            </button>
                        )}
                    </div>
                </div>
            </div>
    );
};
export default S1Main;
