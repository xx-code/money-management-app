export default function TransactionEditorPage({params: {id}}: { params: {id: string}}) {
    return (
        <div className='modal-add-new-transaction'>
            <div className='nav-modal-add-new-transaction flex'>
                <div className={inputTransaction.type === TransactionType.Credit ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => setInputTransaction({...inputTransaction, type: TransactionType.Credit})} style={{borderTopLeftRadius: '0.5rem'}}>
                    Gains
                </div>
                <div className={inputTransaction.type === 'Debit' ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => setInputTransaction({...inputTransaction, type: TransactionType.Debit})} style={{borderTopRightRadius: '0.5rem'}}>
                    Depense
                </div>
            </div>
            <div className='modal-body'>
                <div>
                    <TextInput type={'text'} title={'Account'} value={inputTransaction.account} name={'account'} onChange={handleInputTransaction} options={accounts.map(account => account.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.account} overOnBlur={undefined} />
                    <TextInput type={'number'} title={'Prix'} value={inputTransaction.price} name={'price'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.price} overOnBlur={undefined} />
                    <TextInput type={'text'} title={'Description'} value={inputTransaction.description} name={'description'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.description} overOnBlur={undefined} />
                    <TextInput type={'text'} title={'Categorie'} value={inputTransaction.category} name={'category'} onChange={handleInputTransaction} options={searchingCategories.map(cat => cat.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.category} overOnBlur={undefined} />
                    <TextInput type={'date'} title={'date'} value={inputTransaction.date} name={'date'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.date} overOnBlur={undefined} />
                    <TextInput type={'text'} title={'tag'} value={inputTransaction.tag} name={'tag'} onChange={handleInputTransaction} options={searchingTags} onClickOption={handleSelectInTransaction} error={errorInputTransaction.tag} overOnBlur={() => handleSelectInTransaction('tag', inputTransaction.tag)} />
                    <div className='flex flex-wrap' style={{marginBottom: '1em'}}>
                        {
                            selectedTagList.map((tag, index) => <Tag key={index} title={tag} onDelete={() => removeTagSelected(tag)} color={undefined} />)
                        }
                    </div>
                </div>
                <div className='flex justify-around'>
                    <Button title={'Annuler'} backgroundColor={'#1E3050'} colorText={'white'} onClick={closeModalTransaction} />
                    <Button title={ transaction !== null ? 'Modifier' : 'Ajouter'} backgroundColor={'#6755D7'} colorText={'white'} onClick={submit_transaction} />
                </div>
            </div>
        </div>
    )
}