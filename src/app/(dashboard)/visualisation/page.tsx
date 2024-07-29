'use client'

import Title from '@/app/components/title';
import TopNav from '../topNav';
import './index.css';
import { useEffect, useState } from 'react';
import { ModalAddNewFutureTransaction } from './modalAddNewFutureTransaction';
import { Category } from '@/core/entities/category';
import { AccountDisplay } from '@/core/entities/account';
import axios from 'axios';
import { Transaction, TransactionType } from '@/core/entities/transaction';
import { FutureTransaction } from '@/core/entities/future_transaction';
import DateParser from '@/core/entities/date_parser';
import ListFutureTransaction from './listFutureTransaction';
import Button from '@/app/components/button';
import { useRouter } from 'next/navigation';

export default function Visualisation() {
    const [openTransactionModal, setOpenTransactionModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [accounts, setAccounts] = useState<AccountDisplay[]>([]);
    const [fixBalances, setFixBalances] = useState<{gains: number, spend: number}>({gains: 0, spend: 0}) 
    const [selectedFutureTransaction, setUpdateFutureTransaction] = useState<FutureTransaction|null>(null);
    const [futureTransactions, setFutureTransactions] = useState<FutureTransaction[]>([])
    const router = useRouter()
    
    function updateTransaction(future_transaction: FutureTransaction) {
        setUpdateFutureTransaction(future_transaction);
        setOpenTransactionModal(true);
    }

    function closeModalTransaction() {
        setOpenTransactionModal(false);
        setUpdateFutureTransaction(null);
    }

    function onAddTransaction() {
        get_transactions();
    }

    async function deleteTransaction(id: string) {
        let isOK = confirm('Voulez vous supprimer cette transaction');
        if (isOK) {
          try {
            await axios.delete(`/api/future-transactions/${id}`);
            get_transactions()
          } catch (err: any) {
            console.log(err);
            alert(err.data);
          }
        }
      }



    async function get_all_accounts() {
        fetch('/api/account')
        .then((res) => res.json())
        .then((data) => {
            let accounts = Object.assign([], data.accounts);
            setAccounts(accounts);
        })
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

    async function get_transactions() {
        try {
            let response = await axios.get('/api/future-transactions');
            let transactions: FutureTransaction[] = [];
            
            let gains: number = 0
            let spend: number = 0

            for (let transaction of response.data) {
                transaction.date_start = (new DateParser(transaction.date_start['year'], transaction.date_start['month'], transaction.date_start['day'])).toString();
                transaction.date_update = (new DateParser(transaction.date_update['year'], transaction.date_update['month'], transaction.date_update['day'])).toString();
                transaction.date_end = transaction.date_end ? (new DateParser(transaction.date_end['year'], transaction.date_end['month'], transaction.date_end['day'])).toString() : null
                transaction.record.date = (new DateParser(transaction.record.date['year'], transaction.record.date['month'], transaction.record.date['day'])).toString();
                
                if (transaction.record.type === TransactionType.Credit)
                    gains += transaction.record.price
                
                if (transaction.record.type === TransactionType.Debit)
                    spend += transaction.record.price

                transactions.push(transaction);
            }
            setFixBalances({gains, spend})
            setFutureTransactions(transactions);
        } catch(err: any) {
            console.log(err);
            alert(err.response.data);
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


    useEffect(() => {
        get_all_accounts();
        get_all_categories();
        get_all_tags();
        get_transactions();
    }, [])
  
    
    return (
        <>
            <TopNav title='Pre-Visualiation'/>
            <div style={{ marginTop: '2rem' }}>
               <div>
               <div className='resume-fix-spend'>
                    <div>
                        <h5>Gains fix: {fixBalances.gains} $</h5>
                        <h5>Depense fix: {fixBalances.spend} $</h5>
                    </div>
                    <div>
                        <Button title='Faire une simulation' backgroundColor='#6755d7' colorText='white' onClick={() => router.push('/visualisation/simulation')} />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Title value="Transactions" />
                    <a style={{color: "#6755d7", textDecoration: "underline"}} onClick={() => setOpenTransactionModal(true)}>Ajouter prix fix</a>
                </div>
                <ListFutureTransaction futureTransactions={futureTransactions} onEdit={updateTransaction} onDelete={deleteTransaction} />
               </div>
            </div>
            <ModalAddNewFutureTransaction accounts={accounts} isOpen={openTransactionModal} onClose={closeModalTransaction} onAdd={onAddTransaction} tags={tags} categories={categories} future_transaction={selectedFutureTransaction} />
        </>
    )
}