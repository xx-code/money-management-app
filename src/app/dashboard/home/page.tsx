'use client';

import Title from "../../components/title";
import CardResumeHome from "./cardResumeHome";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";
import Button from "../../components/button";
import ListTransaction from "./listTransaction";
import { ElementRef, useRef, useState } from "react";
import { ICreationAccountUseCaseResponse, CreationAccountUseCaseRequest, CreationAccountUseCase } from '../../../core/interactions/account/creationAccountUseCase';
import TextInput from "@/app/components/textInput";
import { SqlAccountRepository } from "@/infrastructure/sql/sqlAccountRepository";
import UUIDMaker from "@/services/crypto";

export default function Home() {
  const dialogRef = useRef<ElementRef<'dialog'>>(null);
  let [title_account, setTitleAccount] = useState('');
  let [credit_value, setCreditValue] = useState(0);
  let [credit_limit, setCreditLimit] = useState(0);

  const creation_account_response: ICreationAccountUseCaseResponse = {
    success: (account_id) => { dialogRef.current?.close() },
    fail: (err) => { console.log(err) }
  }

  function handleTitleAccount(event: any) {
    setTitleAccount(event.target.value);
  }

  function handleCreditValue(event: any) {
    setCreditValue(event.target.value);
  }

  function handleCreditLimit(event: any) {
    setCreditLimit(event.target.value);
  }

  async function submit() {
    let new_account: CreationAccountUseCaseRequest = {
      title: title_account,
      credit_value: credit_value,
      credit_limit: credit_limit
    };
  }

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close()
  }

  return (
    <>
      <div className="flex">
        <div>
          <CardResumeHome onClickAddAccount={openModal} />
          <CardStat />
        </div>
        <div style={{ marginLeft: '2rem' }}>
          <div style={{ marginTop: '2em' }}>
            <Title value="Resume" />
            <div className="flex">
              <CardResumeSpend title="Total depense" last_month="885.00" current_month="885.12" />
              <CardResumeSpend title="Total gains" />
            </div>

            <div style={{ marginTop: '2em' }}>
              <div className="flex justify-between items-center">
                <Title value="Historique de transactions" />
                <Button title="Voir tout" onClick={() => { }} backgroundColor="#6755D7" colorText="white" />
              </div>
              <ListTransaction transactions={[1]} />
            </div>
          </div>
        </div>
      </div>
      <dialog ref={dialogRef} onClose={closeModal}>
        <h3>Ajouter nouveau compte</h3>
        <button onClick={closeModal} className="close-button" />
        <TextInput title="Nom du compte" type="text" value={title_account} onChange={handleTitleAccount} />
        <TextInput title="Valeur de carte credit" type="number" value={credit_value} onChange={handleCreditValue} />
        <TextInput title="Limite de la carte" type="number" value={credit_limit} onChange={handleCreditLimit} />
        <div>
          <Button title="Creer compte" onClick={submit} backgroundColor="#6755D7" colorText="white" />
        </div>
      </dialog>
    </>
  );
}
