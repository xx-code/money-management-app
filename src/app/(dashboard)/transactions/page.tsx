'use client';

import './page.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { useBalances, useTransactionPagination } from "../hooks/transactions";
import { useAccountsFetching } from "../hooks/accounts";
import TransactionPaginations from "../_home/components/list-transaction";
import { FilterForm, FilterInput } from "./components/filterForm";
import TopBarInfoAllTransaction from "./components/topBarInfoAllTransaction";
import { useCategories, useTags } from "../hooks/system";
import { RequestGetPagination } from "@/core/interactions/transaction/getPaginationTransactionUseCase";
import { useRouter } from "next/navigation";
import { mapperTransactionType } from "@/core/domains/constants";
import { isEmpty, Money } from "@/core/domains/helpers";
import { CardTranscationValue } from "@/app/components/cardTransaction";
import { TransactionModel } from '@/app/api/models/transaction';
import { cleanTransactionsPageStorage } from '@/app/_utils/cleanLocalStorage';

export default function Transactions() {
    const { accounts, loading, error, fetchAllAccounts } = useAccountsFetching()
    const { transactions, errorPagination, fetchTransactionPagination, pagination } = useTransactionPagination()
    const { totalGains, totalSpend, fetchTotals } = useBalances()
    const hookCategories = useCategories()
    const hookTags = useTags()
    const router = useRouter()
    const [accountSelected, setAccountSelected ] = useState(0)
    const [filter, setFilter] = useState<FilterInput>({categoriesSelected: [], category: '', tag: '', dateEnd: '', dateStart: '', tagsSelected: []})

    function setupRequestFetching(page: number, accountSelected: number, inputFilter: FilterInput) {
        if (page >= 1 || page <= pagination.maxPage) {
          let height_win_need = window.innerHeight / 2;
          let size = Math.floor(height_win_need / 100);
          const requestPagination: RequestGetPagination = {
            page: page,
            size: size,
            account_filter: accountSelected > 0 ? [accounts[accountSelected].accountId] : [],
            category_filter: inputFilter.categoriesSelected,
            tag_filter: inputFilter.tagsSelected,
            sort_by: null,
            sort_sense: null,
            date_start: inputFilter.dateStart,
            date_end: inputFilter.dateEnd,
            type: undefined,
            price: undefined
          }
          fetchTransactionPagination(requestPagination)
          fetchTotals(requestPagination)
        }
    }

    function filterTransaction(inputFilter: FilterInput) {
        setupRequestFetching(1, accountSelected, inputFilter)
        setFilter(inputFilter)
    }

    function mapperTransaction(trans: TransactionModel): CardTranscationValue {
        return {
          transactionId: trans.id,
          amount: new Money(trans.amount),
          category: { category_id: trans.category.categoryId, icon: trans.category.icon, color: trans.category.color, title: trans.category.title },
          date: trans.date,
          description: trans.description,
          tags: trans.tags.map(tag => ({ tag_id: tag.tagId, color: tag.color, value: tag.value })),
          type: mapperTransactionType(trans.type) 
        }
    }

    async function deleteTransaction(id: string) {
        try {
          await axios.delete(`/api/transaction/${id}`);

        } catch (err: any) {
          console.log(err);
          alert(err.data);
        }
    }
    

    async function selectAccount(accountId: string) {
        let index = accounts.findIndex(account => account.accountId === accountId)
        if (index !== -1) {
            setAccountSelected(index)
            setupRequestFetching(1, index, filter)
        }
    }

    async function showTransaction(id: string, filter: FilterInput) {
        localStorage.setItem('currentPage', pagination.currentPage.toString())
        localStorage.setItem('tag_filter', filter.tagsSelected.toString())
        localStorage.setItem('category_filter', filter.categoriesSelected.toString())

        router.push(`/transaction/${id}`)
    }

    const renderFilterForm = () => {
        if (hookCategories.loading || hookTags.loading) {
            return <div>Loading...</div>
        }

        return (
            <FilterForm 
                categories={hookCategories.categories} 
                tags={hookTags.tags} 
                onChangeFilter={filterTransaction} 
                onCleanFilter={filterTransaction}                         
            />
        )
    }



    const renderTransactionPagination = () => {
        if (errorPagination) {
            return <h1>{errorPagination}</h1>
        }

        return (
            <TransactionPaginations
                transactions={transactions.map(trans => mapperTransaction(trans))}
                onEdit={(id: string) => showTransaction(id, filter)}
                onDelete={deleteTransaction}
                currentPage={pagination.currentPage}
                maxPage={pagination.maxPage}
                previous={() => setupRequestFetching(pagination.currentPage - 1, accountSelected, filter)}
                next={() => setupRequestFetching(pagination.currentPage + 1, accountSelected, filter)}
            />
        )
    }

    const renderTopInfo = () => {
        if (loading) {
            return loading
        }

        return (
            <TopBarInfoAllTransaction 
                accounts={accounts.map(account => ({accountTitle: account.title, accountId: account.accountId }))} 
                accountSelected={accountSelected}
                onSelectAccount={selectAccount} 
                totalSpend={totalSpend} 
                totalEarning={totalGains}                
            />
        )
    } 

    useEffect(() => {
       hookCategories.fetchCategories()
       hookTags.fetchTags()
       fetchAllAccounts()

       let inputFiler = filter
       let currentPage = 1 

       if (!isEmpty(localStorage.getItem('currentPage')))
            currentPage = Number(localStorage.getItem('currentPage'))
       console.log(currentPage)
       if (!isEmpty(localStorage.getItem('category_filter'))) {
            let catFilter = localStorage.getItem('category_filter')!.split(',')
            inputFiler.categoriesSelected = catFilter
            setFilter({...filter, categoriesSelected: catFilter})
       }
            

       if (!isEmpty(localStorage.getItem('tag_filter'))) {
            let tagFilter = localStorage.getItem('tag_filter')!.split(',')
            inputFiler.tagsSelected = tagFilter 
            setFilter({...filter, tagsSelected: tagFilter})
       }

       console.log(inputFiler)

       setupRequestFetching(currentPage, 0, inputFiler)
       cleanTransactionsPageStorage()
    }, [])

    return (
        <>
            <div className="transactions">
                <TopBarInfoAllTransaction 
                    accounts={accounts.map(account => ({accountTitle: account.title, accountId: account.accountId }))} 
                    accountSelected={accountSelected}
                    onSelectAccount={selectAccount} 
                    totalSpend={totalSpend} 
                    totalEarning={totalGains}                
                />
                <div className="transactions-content">
                    <div className="left-content">
                        <div className="list">
                            {renderTransactionPagination()}
                        </div>
                    </div>
                    <div className="right-content">
                        {renderFilterForm()}
                    </div>
                </div>
            </div>
        </>
    )
}