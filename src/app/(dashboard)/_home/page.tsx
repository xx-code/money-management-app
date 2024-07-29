'use client';

import './cardResumeHome.css';

import Title from "../../components/title";
import { Transaction, TransactionType } from "../../../core/entities/transaction";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";
import ListTransaction from "./listTransaction";
import { useEffect, useState } from "react";
import axios from "axios";
import { determined_start_end_date } from "@/core/entities/budget";
import TransactionPagination from "./transactionPagination";
import ModalAddNewAccount from "@/app/components/modalAddNewAccount";
import ModalTransfertTransaction from '@/app/components/modalTransfertTransaction';
import { ModalAddNewTransaction } from "@/app/components/modalAddNewTransaction";
import { AccountDisplay } from "@/core/entities/account";
import DateParser from "@/core/entities/date_parser";
import { Category } from "@/core/entities/category";
import CardResumeHome from './cardResumeHome';
import TopNav from '../topNav';


export default function Home() {
  const [pagination, setPagination] = useState({current: 1, max_pages: 1});
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [total_spend, setTotalSpend] = useState<{past_month: string, current_month: string}>({past_month: "------", current_month: "------"});
  const [total_gains, setTotalGains] = useState<{past_month: string, current_month: string}>({past_month: "------", current_month: "------"});

  const [openAccountModal, setOpenAccountModal] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [openTransfertModal, setOpenTransfertModal] = useState(false);

  const [selectedTransaction, setUpdateTransaction] = useState<Transaction|null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [account, setAccount] = useState<AccountDisplay|null>(null);
  const [accounts, setAccounts] = useState<AccountDisplay[]>([]);


  async function get_total_spend() {
    try { 
      let balance = await get_total_balance('Debit');
      setTotalSpend({past_month: balance.last_month.toString(), current_month: balance.current_month.toString()});
    } catch (error) {
      console.log(error);
    }
  }

  async function get_total_gain() {
    try {
      let balance = await get_total_balance('Credit');
      setTotalGains({past_month: balance.last_month.toString(), current_month: balance.current_month.toString()});
    } catch (error) {
      console.log(error);
    }
  }

  async function get_transactions(current_page: number) {
    try {
      let height_win_need = window.innerHeight/2;

      let size = Math.floor(height_win_need / 100);

      let account_filter:any = []

      /*if (account !== null && account.id !== "all") {
        account_filter = [account.id]
      }*/
 
      let response = await axios.post('/api/pagination_transactions', {
        page: current_page,
        size: size,
        account_filter: account_filter,
        category_filter: [],
        tag_filter: []
      });

      setPagination({current: response.data.current_page, max_pages: response.data.max_pages});
      let transactions: Transaction[] = [];
      for (let transaction of response.data.transactions) {
        transaction.record.date = (new DateParser(transaction.record.date['year'], transaction.record.date['month'], transaction.record.date['day'])).toString();
        transactions.push(transaction);
      }
      setTransactions(transactions);
    } catch(err) {
      console.log(err);
    }
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
        const balance_last_month = Math.round(response_past.data.balance * 100)/100;
  
        const response_current = await axios.post('/api/transaction/get_balance_by', { type: type_transaction, date_start: current_month_date.start_date.toString(), date_end: current_month_date.end_date.toString() });
        const balance_current_month = Math.round(response_current.data.balance * 100)/100;
  
        resolve({last_month: balance_last_month, current_month: balance_current_month});
      } catch (error) {
        reject(error);
      }
    })
  }


  async function update_account_credit_limit() {
    try {
        let response = await axios.put(`/api/account/${account!.id}`, account);    
        let updated = response.data;

        setAccount({...account!, credit_limit: updated.credit_limit});
    } catch (error) {
        console.log(error);
    }       
  }

  async function delete_account() {
    let is_ok = await confirm('Si la catégorie est utilisée, cela va faire disparaître les transactions !!!');
    if (is_ok) {
      try {
        let response = await axios.delete(`/api/account/${account!.id}`);
        let deleted = response.data
        console.log(deleted);
      } catch (error) {
        console.log(error);
      }
    }
  }


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
      let account: AccountDisplay|undefined = accounts.find((value: AccountDisplay, index) => value.title == event.target.value);
      setAccount(account!);
  };


  function updateTransaction(transaction: Transaction) {
    setUpdateTransaction(transaction);
    setOpenTransactionModal(true);
  }

  async function delete_transaction(id: string) {
    let isOK = confirm('Voulez vous supprimer cette transaction');
    if (isOK) {
      try {
        await axios.delete(`/api/transaction/${id}`);
        setup_data(false);
      } catch (err: any) {
        console.log(err);
        alert(err.data);
      }
    }
  }

  async function get_all_categories() {
      try {
          const response_categories = await axios.get('/api/category');
          let categories: Category[] = response_categories.data.categories;
          setCategories(categories);
      } catch(error) {
          console.log(error);
      }
  }

  async function get_all_tags() {
      try {
          const response_categories = await axios.get('/api/tag');
          let tags: string[] = response_categories.data.tags;
          setTags(tags)
      } catch(error) {
          console.log(error);
      }
  }

  async function get_all_accounts(do_refresh: boolean) {
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
              balance: Math.round(balance * 100)/100
          });
          if (!do_refresh)  {
              setAccount(accounts[0]);
          }
          setAccounts(accounts);
      })
  }

  function closeModalTransaction() {
    setup_data(true);
    setOpenTransactionModal(false);
    setUpdateTransaction(null);
  }

  async function closeModalAccount() {
    await setup_data(false);
    setOpenAccountModal(false);
  }

  function closeModalTransfert() {
    setup_data(true);
    setOpenTransfertModal(false);
  }


  async function setup_data(refresh:boolean) {
    get_transactions(pagination.current);
    get_total_gain();
    get_total_spend();
    get_all_accounts(refresh);
    get_all_categories();
    get_all_tags();
  }

  useEffect(() => {
    setup_data(false)
  }, []);

  return (
    <>
      <TopNav title='Bonjour, Auguste!'/>
      <div className="flex">
        <div>
          <CardResumeHome 
            onAddNewAccount={() => setOpenAccountModal(true)}
            account={account}
            accounts={accounts}
            onAddNewTransaction={() => setOpenTransactionModal(true)}
            handleSelectAccount={handleDropDownChange}
            handleSliderChange={handleSliderChange}
            handleSliderRelease={handleSliderRelease} 
            onDeleteAccount={delete_account} 
            onEditAccount={undefined} 
            onMakeTransfert={() => setOpenTransfertModal(true)}          
          />
          <CardStat />
        </div>
        <div style={{ marginLeft: '2rem' }}>
          <div style={{ marginTop: '2em' }}>
            <Title value="Resume" />
            <div className="flex">
              <CardResumeSpend title="Total depense" last_month={total_spend.past_month} current_month={total_spend.current_month} />
              <CardResumeSpend title="Total gains" last_month={total_gains.past_month} current_month={total_gains.current_month} />
            </div>

            <div style={{ marginTop: '2em' }}>
              <div className="flex justify-between items-center">
                <Title value="Historique de transactions" />
                <a style={{color: "#6755d7", textDecoration: "underline"}} href='/transactions'>Voir tout</a>
              </div>
              <ListTransaction transactions={transactions} onEdit={updateTransaction} onDelete={delete_transaction} />
              <TransactionPagination 
                current_page={pagination.current} 
                max_page={pagination.max_pages} 
                precedent={() => change_list_transaction(pagination.current - 1)} 
                next={() => change_list_transaction(pagination.current + 1)}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalTransfertTransaction isOpen={openTransfertModal} accounts={accounts.filter(account => account.id !== 'all')} onClose={closeModalTransfert} onAdd={async () => { await setup_data(false)}} />
      <ModalAddNewAccount isOpen={openAccountModal} onClose={closeModalAccount} onAdd={async () => { await setup_data(false)}} />
      <ModalAddNewTransaction accounts={accounts.filter(account => account.id !== 'all')} isOpen={openTransactionModal} onClose={closeModalTransaction} onAdd={async () => { await setup_data(false)}} tags={tags} categories={categories} transaction={selectedTransaction} />
    </>
  );
}
