'use client';

import Title from "../../components/title";
import { Transaction } from "../../../core/entities/transaction";
import CardResumeHome from "./cardResumeHome";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";
import Button from "../../components/button";
import ListTransaction from "./listTransaction";
import { ElementRef, useEffect, useRef, useState } from "react";
import TextInput from "@/app/components/textInput";
import axios from "axios";
import { determined_start_end_date } from "@/core/entities/budget";
import TransactionPagination from "./transactionPagination";


export default function Home() {
  const dialogRef = useRef<ElementRef<'dialog'>>(null);
  let [title_account, setTitleAccount] = useState('');
  let [credit_value, setCreditValue] = useState(0);
  let [credit_limit, setCreditLimit] = useState(0);
  let [pagination, setPagination] = useState({current: 1, max_pages: 1});
  let [transactions, setTransactions] = useState<Transaction[]>([]);

  let [total_spend, setTotalSpend] = useState<{past_month: string, current_month: string}>({past_month: "------", current_month: "------"});
  let [total_gains, setTotalGains] = useState<{past_month: string, current_month: string}>({past_month: "------", current_month: "------"});


  function handleTitleAccount(event: any) {
    setTitleAccount(event.target.value);
  }

  function handleCreditValue(event: any) {
    setCreditValue(event.target.value);
  }

  function handleCreditLimit(event: any) {
    setCreditLimit(event.target.value);
  }

  function change_list_transaction(page: number) {
    if (page >= 1 || page <= pagination.max_pages) {
      get_transactions(page)
    }
  }

  function get_total_balance(type_transaction: string): Promise<{last_month: number, current_month: number}> {
    return new Promise(async (resolve, reject) => {
      try {
        let today = new Date();
        let past = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        
        let current_month_date = determined_start_end_date(today, "Month", 1);
        let past_month_date = determined_start_end_date(past, "Month", 1);
  
        const response_past = await axios.post('/api/transaction/get_balance_by', { type: type_transaction, date_start: past_month_date.start_date.toString(), date_end: past_month_date.end_date.toString() });
        const balance_last_month = response_past.data.balance;
  
        const response_current = await axios.post('/api/transaction/get_balance_by', { type: type_transaction, date_start: current_month_date.start_date.toString(), date_end: current_month_date.end_date.toString() });
        const balance_current_month = response_current.data.balance;
  
        resolve({last_month: balance_last_month, current_month: balance_current_month});
      } catch (error) {
        reject(error);
      }
    })
  }

  async function get_total_spend() {
    try { 
      let balance = await get_total_balance('Debit')
      console.log(balance)
      setTotalSpend({past_month: balance.last_month.toString(), current_month: balance.current_month.toString()});
    } catch (error) {
      console.log(error);
    }
  }

  async function get_total_gain() {
    try {
      let balance = await get_total_balance('Credit')
      console.log(balance)
      setTotalGains({past_month: balance.last_month.toString(), current_month: balance.current_month.toString()});
    } catch (error) {
      console.log(error);
    }
  }

  async function get_transactions(current_page: number) {
    try {
      let response = await axios.post('/api/pagination_transactions', {
        page: current_page,
        size: 10,
        account_filter: [],
        category_filter: [],
        tag_filter: []
      });

      setPagination({current: response.data.current_page, max_pages: response.data.max_pages})
      setTransactions(response.data.transactions)
    } catch(err) {
      console.log(err);
    }
  }

  async function submit() {
    let new_account = {
      title: title_account,
      credit_value: credit_value,
      credit_limit: credit_limit
    };

    let response = await axios.post('/api/account', new_account);

    closeModal();
  }

  useEffect(() => {
    get_transactions(pagination.current);
    get_total_gain();
    get_total_spend();
  }, []);

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
              <CardResumeSpend title="Total depense" last_month={total_spend.past_month} current_month={total_gains.current_month} />
              <CardResumeSpend title="Total gains" last_month={total_gains.past_month} current_month={total_gains.current_month} />
            </div>

            <div style={{ marginTop: '2em' }}>
              <div className="flex justify-between items-center">
                <Title value="Historique de transactions" />
                <Button title="Voir tout" onClick={() => { }} backgroundColor="#6755D7" colorText="white" />
              </div>
              <ListTransaction transactions={transactions} />
              <TransactionPagination 
                current_page={pagination.current} 
                max_page={pagination.max_pages} 
                precedent={() => change_list_transaction(pagination.current - 1)} 
                next={() => change_list_transaction(pagination.current + 1)}/>
            </div>
            
          </div>
        </div>
      </div>
      <dialog ref={dialogRef} onClose={closeModal}>
        <h3>Ajouter nouveau compte</h3>
        <button onClick={closeModal} className="close-button" />
        <TextInput title="Nom du compte" type="text" value={title_account} onChange={handleTitleAccount} name={""} options={[]} onClickOption={undefined} error={null} overOnBlur={undefined} />
        <TextInput title="Valeur de carte credit" type="number" value={credit_value} onChange={handleCreditValue} name={""} options={[]} onClickOption={undefined} error={null} overOnBlur={undefined} />
        <TextInput title="Limite de la carte" type="number" value={credit_limit} onChange={handleCreditLimit} name={""} options={[]} onClickOption={undefined} error={null} overOnBlur={undefined} />
        <div>
          <Button title="Creer compte" onClick={submit} backgroundColor="#6755D7" colorText="white" />
        </div>
      </dialog>
    </>
  );
}
