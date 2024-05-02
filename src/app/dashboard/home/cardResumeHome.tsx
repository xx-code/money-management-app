'use client'

import RangeSlider from "../../components/rangeSlider";
import Title from "../../components/title";
import Dropdown from "../../components/dropdown";
import Button from "../../components/button";

import './cardResumeHome.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { AccountDisplay } from "@/core/entities/account";


export default function CardResumeHome({ onClickAddAccount }: { onClickAddAccount: any} ) {
    const [account, setAccount] = useState<AccountDisplay|null>(null);
    const [accounts, setAccounts] = useState([]);

    async function get_all_accounts(is_refresh: boolean) {
        fetch('/api/account')
        .then((res) => res.json())
        .then((data) => {
            let accounts = Object.assign([], data.accounts);
            let balance = accounts.reduce((sum:number, current:AccountDisplay) => sum + current.balance, 0)
            accounts.unshift({
                id: "all",
                title: "Tous les comptes",
                credit_limit: 0,
                credit_value: 0,
                balance: balance
            });
            if (!is_refresh)  {
                setAccount(accounts[0]);
            }
            setAccounts(accounts);
        })
    }
    
    async function update_account_credit_limit() {
        try {
            let response = await axios.put(`/api/account/${account!.id}`, account);    
            let updated = response.data;

            setAccount({...account!, credit_limit: updated.credit_limit});
            get_all_accounts(true);
        } catch (error) {
            console.log(error);
        }       
    }
    
    useEffect(() => {
        get_all_accounts(false);
    }, [])
    
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(event.target.value);
        setAccount({...account!, id: account!.id, credit_limit: value});
    };

    const handleSliderRelease = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            update_account_credit_limit();
        } catch(err) {
            console.log(err);
        }
    }

    const handleDropDownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let account = accounts.find((value: AccountDisplay, index) => value.title == event.target.value);
        setAccount(account!);
    };
    return (
        <div className="card-resume-home">
            <Title value="Mon solde"/>
            <div className="card-resume-content">
                <div className="card-resume-dropdown">
                    {
                        account !== null ?
                        <>
                            {
                                account.id !== "all" ?
                                <>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span style={{color: "white"}}>Delete</span>
                                        <span style={{color: "white"}}>Ajouter</span>
                                    </div>
                                </>
                                :
                                <></>

                            }
                        </>
                        :
                        <></>
                    }
                    <Dropdown values={accounts.map((account: AccountDisplay, key) => account.title)} onChange={handleDropDownChange} backgroundColor={null} color="black" customClassName={""} />
                </div>
                <div className='card-resume-balance'>
                    <h6>
                        {
                            account !== null ?
                            <>$ {account.balance}</>
                            :
                            <></>
                        }
                    </h6>
                </div>
                <div className="card-resume-slider">
                    {
                        account !== null ?
                        <>
                            {
                                account.id !== "all" ? 
                                <>
                                    <p>{"Limite d'endettement"}</p>
                                    <RangeSlider min={0} max={account.credit_value} change_indicator={account.credit_limit} value={account.credit_limit} onChange={handleSliderChange} onRelease={handleSliderRelease}/>
                                </>
                                :
                                <></>
                            }
                        </>
                            :
                        <></>
                    }
                </div>
                <div className="card-resume-button">
                    {
                        account !== null ?
                        <>
                            {
                                account.id !== "all" ?
                                <>
                                    <Button backgroundColor="#6755D7" onClick={onClickAddAccount} colorText="white" title="Ajouter nouvelle Transaction"/>
                                </>
                                :
                                <></>

                            }
                        </>
                        :
                        <></>
                    }
                </div>
            </div>
        </div>
    )
}