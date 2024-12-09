export default function BudgetPage() {
    const [inputBudgetCategory, setInputBudgetCategory] = useState({title: '', category: '',  tag: '', target: 0, date_start: DateParser.now().toString(), period: '', period_time: 0,  date_end: DateParser.now().toString(), can_end: false, is_periodic: false});
    const [errorValidationBudgetCategory, setErrorValidationBudgetCategory] = useState<{title: string|null, category: string|null, period: string|null, period_time: string|null, date_start: string|null, target: string|null, date_end: string|null, tag: string|null}>({title: null, category: null, period: null, period_time: null, date_start: null, target: null, date_end: null, tag: null});

    async function get_all_Budgets() {
        try {
            const response_budget= await axios.get('/api/budget');
            const budgets = response_budget.data.budgets;
            for(let i = 0; i < budgets.length; i++ ) {
                budgets[i].start_date = DateParser.from_string(budgets[i].start_date);
                budgets[i].update_date = DateParser.from_string(budgets[i].update_date);
                budgets[i].end_date = DateParser.from_string(budgets[i].end_date);
            }

            setBudgets(budgets)
        } catch (error) {
            console.log(error);
        }
    }

    async function save(is_update: boolean) {
        try {
            let do_submit = true;
            let errors = {}
            if (is_empty(inputBudgetCategory.title)) {
                errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
                console.log(errorValidationBudgetCategory)
                do_submit = false;
            } else {
                 errors = {...errors, title: null};
            }

            if (categoriesSelected.length == 0) {
                 errors = {...errors, category: 'Vous devez selection au moins une categorie'};
                do_submit = false;
            } else {
                 errors = {...errors, category: null};
            }

            if (is_empty(inputBudgetCategory.period)) {
                 errors = {...errors, period: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                 errors = {...errors, period: null};
            }

            if (inputBudgetCategory.period_time <= 0) {
                errors = {...errors, period_time: 'Doit etre superieur ou egale a 1'};
                do_submit = false;
            } else {
                errors = {...errors, period_time: null};
            }

            if (inputBudgetCategory.target <= 0) {
                errors = {...errors, target: 'Doit etre superieur a 0'};
                do_submit = false;
            } else {
                errors = {...errors, target: null};
            }

            if (do_submit) {
                let period = Object.entries(periods).find(key => key[0] === inputBudgetCategory.period);
                if (is_update) {
                    let budget: RequestUpdateBudget = {
                        id: idBudgetSelected!,
                        title: inputBudgetCategory.title,
                        categories: categoriesSelected.map(cat => cat.id),
                        period: period ? period[1] : '',
                        date_start: inputBudgetCategory.date_start,
                        period_time: inputBudgetCategory.period_time,
                        target: inputBudgetCategory.target,
                        tags: tagsSelected,
                        date_end: inputBudgetCategory.date_end,
                        is_archived: null
                    };

                    await axios.put(`/api/budget/${idBudgetSelected}`, budget);
                } else {
                    let budget: CreationBudgetUseCaseRequest = {
                        title: inputBudgetCategory.title,
                        categories: categoriesSelected.map(cat => cat.id),
                        period: period?period[1] : '',
                        date_start: inputBudgetCategory.date_start,
                        period_time: inputBudgetCategory.period_time,
                        target: inputBudgetCategory.target,
                        tags: tagsSelected,
                        date_end: inputBudgetCategory.date_end
                    };

                    await axios.post(`/api/budget`, budget);
                }
                
                handleCloseCurrentModal('category');
                get_all_Budgets();
            } else {
                // @ts-ignore
                setErrorValidationBudgetCategory(errors)
            }

        } catch(error: any) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className="add-budget-modal">
                <div className="add-budget-modal-head flex justify-between">
                    <h3>*</h3>
                    <button onClick={() => handleCloseCurrentModal('category')} className="close-button">&#x2715;</button>
                </div>
                
                <TextInput title="Nom budget" name="title" type="text" value={inputBudgetCategory.title} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.title} overOnBlur={undefined} />
                <TextInput title="Categorie" name="category" type="text" value={inputBudgetCategory.category} onChange={handleChangeCategories} options={categoriesSearching.map(cat => cat.title)} onClickOption={handleSelectClickCategoriesModal} error={errorValidationBudgetCategory.category}  overOnBlur={undefined} /> 
                <div className="flex flex-wrap" style={{marginTop: "-12px"}}>
                    {
                        categoriesSelected.map((category: Category, key: any) => 
                            <Tag key={key} title={category.title} onDelete={() => removeCategoriesSelected(category.title)} color={undefined}/>
                        )
                    }
                </div>
                <TextInput title="Date" name="date_start" type="date" value={inputBudgetCategory.date_start} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.date_start}  overOnBlur={undefined} />
                <div>
                    <input type="checkbox" name="is_periodic" onChange={handleChangeCategories} checked={inputBudgetCategory.is_periodic} />
                    <label> Is Periodic</label>
                </div>
                {
                    inputBudgetCategory.is_periodic ? 
                    <>
                        <TextInput title="Periode" name="period" type="text" value={inputBudgetCategory.period} onChange={() => {}} options={Object.keys(periods)} onClickOption={handleSelectClickCategoriesModal} error={errorValidationBudgetCategory.period}  overOnBlur={undefined} />
                        <div style={{width: '45%'}}>
                            <TextInput title="Nb Periode" name="period_time" type="number" value={inputBudgetCategory.period_time} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.period_time}  overOnBlur={undefined} />  
                        </div>
                    </>
                    :
                    <></>
                }
                
                <div style={{width: '60%'}}>
                    <TextInput title="Cible" name="target" type="number" value={inputBudgetCategory.target} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.target}  overOnBlur={undefined} />  
                </div>

                <TextInput title="Tag" name="tag" type="text" value={inputBudgetCategory.tag} onChange={handleChangeCategories} options={tagsSearching} onClickOption={handleSelectTagClick} error={errorValidationBudgetCategory.tag} overOnBlur={() => handleSelectTagClick('tag', inputBudgetCategory.tag)} /> 
                <div className="flex flex-wrap" style={{marginTop: "-12px"}}>
                    {
                        tagsSelected.map((tag: string, key: any) => 
                            <Tag key={key} title={tag} onDelete={() => removeTagSelected(tag)} color={undefined}/>
                        )
                    }
                </div>
                <div>
                    <input type="checkbox" name="can_end" onChange={handleChangeCategories} checked={inputBudgetCategory.is_periodic} />
                    <label> Ajouter limite</label>
                </div>
                {
                    inputBudgetCategory.can_end ?
                        <TextInput title="Date de fin" name="date_end" type="date" value={inputBudgetCategory.date_end} onChange={handleChangeTags} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.date_end}  overOnBlur={undefined} />
                    :
                        <></>
                }
                <div className="flex justify-center">
                    <Button title={isModification ? "Modifier Budget" : "Creer Budget"} onClick={isModification ?  () => save(true) : () => save(false)} backgroundColor="#6755D7" colorText="white" />
                </div> 
            </div>
        </div>
    )
}