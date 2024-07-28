'use client'

import RangeSlider from "../../components/rangeSlider";
import Title from "../../components/title";
import Dropdown from "../../components/dropdown";

import './cardResumeHome.css';
import { AccountDisplay } from "@/core/entities/account";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from "react";
// @ts-ignore
library.add(fas)


export default function CardResumeHome({account, accounts, onDeleteAccount, onEditAccount, onMakeTransfert, onAddNewAccount, onAddNewTransaction, handleSelectAccount, handleSliderChange, handleSliderRelease}: 
    {account: AccountDisplay|null, accounts: AccountDisplay[], onDeleteAccount: any, onEditAccount:any, onMakeTransfert:any, onAddNewAccount: any, onAddNewTransaction: any,
    handleSelectAccount: any, handleSliderChange: any, handleSliderRelease: any}) {

    const [oldAccount, setOldAccount] = useState(account)
    const [oldAccounts, setOldAccounts] = useState(accounts)

    const checkSameAccounts = () => {
        let is_same = false
        // Todo: optimiser
        oldAccounts.forEach(acc_1 => {
            accounts.forEach(acc_2 => {
                is_same = acc_1.balance === acc_2.balance
            } )
        })
        return is_same
    }

    useEffect(() => {
        if (oldAccount?.balance !== account?.balance) {
            setOldAccount(account)
        }
        if (!checkSameAccounts()) {
            setOldAccounts(accounts)
        }
    }, [account, accounts])

    return (
        <>
            <div className="card-resume-home">
                <div className="flex justify-between content-center">
                    <Title value="Mon solde"/>
                    <span className="button-add-account" onClick={onAddNewAccount}>Ajouter nouveau compte</span>
                </div>
                {
                    accounts.length > 1 ? 
                    <div className="card-resume-content">
                        <div className="card-resume-dropdown">
                            <Dropdown values={oldAccounts.map((account: AccountDisplay, key) => account.title)} onChange={handleSelectAccount} backgroundColor={null} color="white" customClassName={""} />
                        </div>
                        <div className='card-resume-balance'>
                            <h6>
                                {
                                    oldAccount !== null ?
                                    <>$ {oldAccount.balance}</>
                                    :
                                    <></>
                                }
                            </h6>
                        </div>
                        <div className="card-resume-slider">
                            {
                                oldAccount !== null ?
                                <>
                                    {
                                        oldAccount.id !== "all" ? 
                                        <>
                                            <p>{"Limite d'endettement"}</p>
                                            <RangeSlider min={0} max={oldAccount.credit_value} change_indicator={oldAccount.credit_limit} value={oldAccount.credit_limit} onChange={handleSliderChange} onRelease={handleSliderRelease}/>
                                        </>
                                        :
                                        <></>
                                    }
                                </>
                                    :
                                <></>
                            }
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className="flex">
                                <div className="card-resume-btn-icon" style={{backgroundColor: "#4FDC4C"}} onClick={onAddNewTransaction}>
                                    <FontAwesomeIcon icon={["fas", "plus"]} />
                                </div>
                                <div className="card-resume-btn-icon"  style={{backgroundColor: "#6755D7"}} onClick={onMakeTransfert}>
                                    <FontAwesomeIcon icon={["fas", "right-left"]} />
                                </div>
                            </div>
                            <div className="flex">
                                <div className="card-resume-btn-icon"  style={{backgroundColor: "#3A77EF"}}  onClick={onEditAccount}>
                                    <FontAwesomeIcon icon={["fas", "pen-to-square"]} />
                                </div>
                                <div className="card-resume-btn-icon"  style={{backgroundColor: "#DC4C4C"}}  onClick={onDeleteAccount}>
                                    <FontAwesomeIcon icon={["fas", "trash"]} />
                                </div>
                            </div>
                        </div>
                    </div> 
                    :
                    <div className="card-resume-content-hodler flex flex-col content-center items-center" onClick={onAddNewAccount}>
                        <FontAwesomeIcon color="#1E3050" icon={["fas", "plus"]} fontSize={"7em"} />
                        <p style={{color: "#1E3050"}}>Cliquer pour ajouter un nouveau comptes</p>
                    </div>
                }
            </div>
        </>
    )
}