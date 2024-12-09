'use client'

import Title from "../../../components/title";
import Dropdown from "../../../components/dropdown";

import './cardResumeHome.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, Money } from "@/core/domains/helpers";

import './cardResumeHome.css';
import DropdownInteractif from "@/app/components/dropdownInteractif";
import TextInput from "@/app/components/textInput";
// @ts-ignore
library.add(fas)

export type CardResumeAccount = {
    accountId: string
    accountTitle: string
    accountBalance: Money
}

type Props = {
    accountSelected: number
    accounts: CardResumeAccount[]
    onSelectAccount: (accountId: string) => void 
    deleteAccount: (accountId: string) => void
}

export default function CardResumeHome({ accounts, accountSelected=-1, deleteAccount, onSelectAccount }: Props) {
    return (
        <>
            <div className="card-resume-home">
                <div className="flex justify-between content-center">
                    <Title value="Mon solde"/>
                    <span className="button-add-account" onClick={() => {}}>Ajouter nouveau compte</span>
                </div>
                {
                    accounts.length > 1 ? 
                    <div className="card-resume-content">
                        <div className="card-resume-dropdown">
                            <Dropdown 
                                values={accounts.map(account => ({returnValue: account.accountId, value: account.accountTitle}))} valueSelected={accountSelected !== -1 ? accounts[accountSelected].accountId : ""}
                                onChange={(event: any) => onSelectAccount(event.target.value)} 
                                backgroundColor={null} color="white" customClassName={""} />
                        </div>
                        <div className='card-resume-balance'>
                            <h6>
                                {
                                    accountSelected !== -1 ?
                                    <>{accounts[accountSelected].accountBalance.toString()}</>
                                    :
                                    <></>
                                }
                            </h6>
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className="flex">
                                <a className="card-resume-btn-icon" style={{backgroundColor: "#4FDC4C"}} href="/transaction/new-transaction">
                                    <FontAwesomeIcon icon={["fas", "plus"]} />
                                </a>
                                <div className="card-resume-btn-icon"  style={{backgroundColor: "#b2bac4"}}>
                                    <FontAwesomeIcon icon={["fas", "snowflake"]} />
                                </div>
                                <div className="card-resume-btn-icon"  style={{backgroundColor: "#6755D7"}}>
                                    <FontAwesomeIcon icon={["fas", "right-left"]} />
                                </div>
                            </div>
                            {
                                accountSelected > 0?
                                    <div className="flex">
                                        <div className="card-resume-btn-icon"  style={{backgroundColor: "#3A77EF"}}>
                                            <FontAwesomeIcon icon={["fas", "pen-to-square"]} />
                                        </div>
                                        <div className="card-resume-btn-icon"  style={{backgroundColor: "#DC4C4C"}} onClick={() => deleteAccount(accounts[accountSelected].accountId)}>
                                            <FontAwesomeIcon icon={["fas", "trash"]} />
                                        </div>
                                    </div>
                                :
                                    <></>
                            }
                        </div>
                    </div> 
                    :
                    <div className="card-resume-content-hodler flex flex-col content-center items-center" onClick={() => {}}>
                        <FontAwesomeIcon color="#1E3050" icon={["fas", "plus"]} fontSize={"7em"} />
                        <p style={{color: "#1E3050"}}>Cliquer pour ajouter un nouveau comptes</p>
                    </div>
                }
            </div>
        </>
    )
}