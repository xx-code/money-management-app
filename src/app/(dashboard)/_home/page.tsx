'use client';


import Title from "../../components/title";
import { CardResumeSpend } from "./components/cardResumeSpend";
import CardStat from "./components/cardStats";
import { useEffect, useState } from "react";
import axios from "axios";
import CardResumeHome, { CardResumeAccount } from './components/cardResumeHome';
import TopNav from '../topNav';
import TransactionPaginations from './components/list-transaction';
import { useResumeMonth, useTransactionPagination } from '../hooks/transactions';
import { CardTranscationValue } from '@/app/components/cardTransaction';
import { ApiTransactionResponse } from '@/app/api/pagination_transactions/route';
import { Money } from '@/core/domains/helpers';
import { RequestGetPagination } from '@/core/interactions/transaction/getPaginationTransactionUseCase';
import { useAccountsFetching } from '../hooks/accounts';
import { TransactionType } from "@/core/domains/entities/transaction";


export default function Home() {
  const { accounts, loading, error, fetchAllAccounts } = useAccountsFetching()
  const { transactions, errorPagination, fetchTransactionPagination, pagination } = useTransactionPagination()
  const { totalGains, totalSpend, fetchTotals } = useResumeMonth()

  const [accountSelected, setAccountSelected] = useState(-1)

  function setupRequestFetching(page: number, accountSelected: number) {
    if (page >= 1 || page <= pagination.maxPage) {
      let height_win_need = window.innerHeight / 2;
      let size = Math.floor(height_win_need / 100);
      const requestPagination: RequestGetPagination = {
        page: page,
        size: size,
        account_filter: accountSelected > 0 ? [accounts[accountSelected].account_id] : [],
        category_filter: [],
        tag_filter: [],
        sort_by: null,
        sort_sense: null,
        date_start: null,
        date_end: null,
        type: undefined,
        price: undefined
      }
      fetchTransactionPagination(requestPagination)
    }
  }

  async function selectAccount(accountId: string) {
    
    let index = accounts.findIndex(el => el.account_id === accountId)
    console.log(index)
    if (index !== -1) {
      setAccountSelected(index)
      await setupRequestFetching(pagination.currentPage, index)
    }
    
  }

  async function deleteTransaction(id: string) {
    let isOK = confirm('Voulez vous supprimer cette transaction');
    if (isOK) {
      try {
        await axios.delete(`/api/transaction/${id}`);

      } catch (err: any) {
        console.log(err);
        alert(err.data);
      }
    }
  }

  async function deleteAccount(accountId: string) {
    let is_ok = await confirm('Si la catégorie est utilisée, cela va faire disparaître les transactions !!!');
    if (is_ok) {
      try {
        let response = await axios.delete(`/api/account/${accountId}`);
        let deleted = response.data
        console.log(deleted);
      } catch (error) {
        console.log(error);
      }
    }
}


  function mapperTransaction(trans: ApiTransactionResponse): CardTranscationValue {
    return {
      transactionId: trans.transaction_id,
      amount: new Money(trans.amount),
      category: { category_id: trans.category.id, icon: trans.category.icon, color: trans.category.color, title: trans.category.title },
      date: trans.date,
      description: trans.description,
      tags: trans.tags.map(tag => ({ tag_id: tag.id, color: tag.color, value: tag.title })),
      type: TransactionType.CREDIT
    }
  }

  useEffect(() => {
    fetchAllAccounts()
    fetchTotals()
    setupRequestFetching(1, -1)
    setAccountSelected(0)
  }, []);

  return (
    <>
      <TopNav title='Bonjour, Auguste!' />
      <div className="flex">
        <div>
          {
            loading ? 
            <div> Loading </div>
            :
            <>
              <CardResumeHome
                accountSelected={accountSelected}
                deleteAccount={deleteAccount}
                onSelectAccount={selectAccount}
                accounts={accounts.map(account => ({ accountId: account.account_id, accountBalance: new Money(account.balance), accountTitle: account.title }))}
              />
            </>
          }
          
          <CardStat />
        </div>
        <div style={{ marginLeft: '2rem' }}>
          <div style={{ marginTop: '2em' }}>
            <Title value="Resume" />

            <div className="flex">
              <CardResumeSpend title="Total depense" lastMonth={totalSpend.pastMonth} currentMonth={totalSpend.currentMonth} />
              <CardResumeSpend title="Total gains" lastMonth={totalGains.pastMonth} currentMonth={totalGains.currentMonth} />
            </div>

            <div style={{ marginTop: '2em' }}>
              <div className="flex justify-between items-center">
                <Title value="Historique de transactions" />
                <a style={{ color: "#6755d7", textDecoration: "underline" }} href='/transactions'>Voir tout</a>
              </div>
              {
                errorPagination === null ?
                  <TransactionPaginations
                    transactions={transactions.map(trans => mapperTransaction(trans))}
                    onEdit={() => { }}
                    onDelete={deleteTransaction}
                    currentPage={pagination.currentPage}
                    maxPage={pagination.maxPage}
                    previous={() => setupRequestFetching(pagination.currentPage - 1, accountSelected)}
                    next={() => setupRequestFetching(pagination.currentPage + 1, accountSelected)}
                  />
                  :
                  <h1>{errorPagination}</h1>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
