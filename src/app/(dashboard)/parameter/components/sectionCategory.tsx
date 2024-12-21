import TagIcon from '@/app/components/tag/tagIcon';
import './sectionCategory.css';
import TextInput from "@/app/components/textInput";
import { TitleSection } from "@/app/components/titleSection";
import { useState } from 'react';
import Button from '@/app/components/button';
import matchSystemIcon from '@/app/_utils/matchSystemIcon';
import { searchInArr } from '@/core/domains/helpers';
import { CategoryModel } from '@/app/api/models/categories';

type Props = {
    categories: CategoryModel[]
    onDeleteCategory: (id: string) => void
    onUpdateCategory: (id: string) => void
    onAddCategory: () => void 
}

export function SectionCategory({ categories, onUpdateCategory, onDeleteCategory, onAddCategory }: Props) {
    const [inputSearch, setInputSearch] = useState('');
    const [searchingCategories, setSearchingCategories] = useState<CategoryModel[]>(categories);
  
    async function search(event: any) {
        let found_categories = searchInArr(event.target.value, categories.map(category => category.title));
        setSearchingCategories(categories.filter(category => found_categories.includes(category.title)));
        setInputSearch(event.target.value);
    }

    
    // async function submit_categorie() {
    //     try {
    //         let do_submit = true;

    //         let errors = {}
            
    //         if (is_empty(input.title)) {
    //             errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
    //             do_submit = false;
    //         } else {
    //             errors = {...errors, title: null};
    //         }

    //         if (is_empty(input.icon)) {
    //             errors = {...errors, icon: 'Ce champs ne doit pas etre vide'};
    //             do_submit = false;
    //         } else {
    //             errors = {...errors, icon: null};
    //         }

    //         if (do_submit) {
    //             let request_categorie = {
    //                 title: input.title,
    //                 icon: input.icon 
    //             }

    //             if (isUpdate) {
    //                 await axios.put(`/api/category/${idSelectedCategory}`, request_categorie);
    //             } else {
    //                 await axios.post('/api/category', request_categorie);
    //             }
    //             closeModalCategory();
    //             get_all_category(); 
    //         } else {
    //             // @ts-ignore
    //             setErrorInput(errors);
    //         }
    //     } catch (error: any) {
    //         console.log(error);
    //         alert(error.data);
    //     }
    // }

    function clickUpdateModal(category: any) {

    }

    function closeModalCategory() {

    }

    //TODO: find away to fix with of modal

    return (
        <div className="section-category">
            <div>
                <TitleSection title="Categories" />
                <div className='flex items-center'>
                    <TextInput 
                        type="text" 
                        title="Categorie" 
                        value={inputSearch} 
                        name="category" 
                        onChange={search} 
                        error={null} 
                    />
                    <div>
                        <Button title='Ajouter Categorie' backgroundColor={'rgb(103, 85, 215)'} colorText={'white'} onClick={onAddCategory} />
                    </div>
                </div> 
            </div>
            <div className='flex flex-wrap'>
                {
                    searchingCategories.map((category, index) => 
                        <TagIcon 
                            onClick={category.icon === 'transfert' ? undefined :() => onUpdateCategory(category.categoryId)}
                            key={index} 
                            title={category.title} 
                            icon={matchSystemIcon(category.icon)}
                            color={category.color} 
                            onDelete={category.icon === 'transfert' ? undefined : () => onDeleteCategory(category.categoryId)}
                        />)
                }
            </div>
            {/* <Modal isOpen={openModalCategory} onClose={()=>{}}>
                <div className="modal-add-new-category ">
                    <h3>{isUpdate ? 'Modifier categorie' : 'Ajouter nouveau categorie'}</h3>
                    <TextInput title="Titre de la categorie" type="text" value={input.title} onChange={handleInput} name={"title"} options={[]} onClickOption={undefined} error={errorInput.title} overOnBlur={undefined} />
                    <TextInput title="Nom icon (FontAwsome)" type="text" value={input.icon} onChange={handleInput} name={"icon"} options={[]} onClickOption={undefined} error={errorInput.icon} overOnBlur={undefined} />
                    <div className="flex justify-around">
                        <Button title="Annuler" onClick={closeModalCategory} backgroundColor="#1E3050" colorText="white" />
                        <Button title={isUpdate ? "Modifier" : "Ajouter"} onClick={ submit_categorie} backgroundColor="#6755D7" colorText="white" />
                    </div>
                </div>
            </Modal> */}
        </div>
    )
}