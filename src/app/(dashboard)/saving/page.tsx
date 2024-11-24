'use client'

import Button from "@/app/components/button";
import TopNav from "../topNav";
import ModalAddSavingGoal from "@/app/components/modalAddSavingGoal";
import { useEffect, useState } from "react";
import axios from "axios";
import { SaveGoalDisplay } from "@/core/entities/save_goal";
import CardSaving from "@/app/components/cardSaving";
import ModalIncreaseSavingGoal from "@/app/components/modalIncreaseSaveGoal";
import { Account } from "@/core/entities/account";
import { RequestDeleteSaveGoal } from "@/core/interactions/saveGoal/deleteSaveGoal";
import ModalDeleteSavingGoal from "@/app/components/modalDeleteSaveGoal";
import { SavingRepository } from "@/core/repositories/savingRepository";

export default function Saving() {
    const [openSavingGoal, setOpenSavingGoal] = useState(false)
    const [openIncreaseSaveGoal, setOpenIncreaseSaveGoal] = useState(false)
    const [openDeleteSaveGoal, setOpenDeteleSaveGoal] = useState(false)
    const [saveGoals, setSaveGoals] = useState<SaveGoalDisplay[]>([])
    const [saveGoal, setSaveGoal] = useState<SaveGoalDisplay|null>(null)
    const [accounts, setAccounts] = useState<Account[]>([])

    const getAllSaveGoal = async () => {
        try {
            let res = await axios.get(`/api/save-goal`);
            let resSaveGoals: SaveGoalDisplay[] = res.data
            
            setSaveGoals(resSaveGoals)
          } catch (err: any) {
            console.log(err);
            alert(err.data);
          }
    }

    async function getAllAccount() {
        try {
            let res = await axios.get('/api/account')
            let accounts: Account[] = res.data.accounts

            setAccounts(accounts);
        } catch(err: any) {
            alert(err.response.data)
        }
    }

    async function deleteSaveGoal(id: string) {
        try {
            let req: RequestDeleteSaveGoal = {
                account_tranfert_ref: id,
                save_goal_ref: id
            }
            let res = await axios.delete(`/api/save-goal/${id}`)
            getAllSaveGoal()
        } catch(err: any) {
            alert(err.response.data)
        }
    }

    const openModalIncreaseSaving = (saveGoal: SaveGoalDisplay) => {
        setSaveGoal(saveGoal)
        setOpenIncreaseSaveGoal(true)
    }

    const onpenModaldeleteSaveGoald = (saveGoal: SaveGoalDisplay) => {
        setSaveGoal(saveGoal)
        setOpenDeteleSaveGoal(true)
    }

    const setup = async () => {
        await getAllAccount()
        await getAllSaveGoal()
    }
  

    useEffect(() => {
        setup()
    }, [])

    return (
        <>
            <TopNav title="But d'epargne" />
            <div style={{ marginTop: '2rem' }}>
                <div>
                    <div style={{display: 'flex'}}>
                        <Button title={"Ajouter un but"} backgroundColor={"#6755D7"} colorText={"white"} onClick={() => setOpenSavingGoal(true)} />
                    </div>
                    <div style={{marginTop:  '3rem'}}>
                        {
                            saveGoals.map((val, index) => {
                                return (
                                    <CardSaving key={index} savingGoald={val} onIncrease={() => openModalIncreaseSaving(val)} onTransfert={() => {}} onUpdate={() => {}} onDelete={() => onpenModaldeleteSaveGoald(val)} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <ModalAddSavingGoal isOpen={openSavingGoal} onClose={()  => setOpenSavingGoal(false)} onAdd={getAllSaveGoal} />
            <ModalIncreaseSavingGoal isOpen={openIncreaseSaveGoal}  onClose={()  => setOpenIncreaseSaveGoal(false)} onAdd={getAllSaveGoal} accounts={accounts} saveGoal={saveGoal} />
            <ModalDeleteSavingGoal isOpen={openDeleteSaveGoal}onClose={() => setOpenDeteleSaveGoal(false)} onAdd={getAllSaveGoal} accounts={accounts} saveGoal={saveGoal} />
        </>
    )
}