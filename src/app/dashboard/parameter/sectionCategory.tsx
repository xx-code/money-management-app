import TagIcon from '@/app/components/tag/tagIcon';
import './sectionCategory.css';

import TextInput from "@/app/components/textInput";
import { TitleSection } from "@/app/components/titleSection";
import { Category } from '@/core/entities/category';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { search_in_array } from '@/core/entities/libs';
import Button from '@/app/components/button';
import Modal from '@/app/components/modal';
import { is_empty } from '@/core/entities/verify_empty_value';


export function SectionCategory() {
    const [openModalCategory, setModalAddCategory] = useState(false);
    const [category, setCategory] = useState('');
    const [searchingCategories, setSearchingCategories] = useState<Category[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [input, setInput] = useState({title: '', icon: ''});
    const [isUpdate, setIsUpdate] = useState(false);
    const [idSelectedCategory, setIdSelectedCaetgory] = useState<string|null>(null);
    const [errorInput, setErrorInput] = useState<{title:null|string, icon:null|string}>({title: null, icon: null});

    function handleInput(event: any) {
        setInput({...input, [event.target.name]: event.target.value});
    }
  
    async function search(event: any) {
        let found_categories = search_in_array(event.target.value, categories.map(category => category.title));
        setSearchingCategories(categories.filter(category => found_categories.includes(category.title)));
        setCategory(event.target.value);
    }

    async function get_all_category() {
        try {
            const response_categories = await axios.get('/api/category');
            let categories: Category[] = response_categories.data.categories;
            setCategories(categories)
            setSearchingCategories(categories)
        } catch(error) {
            console.log(error);
        }
    }

    async function delete_category(id: string) {
        let is_ok = await confirm('Si la catégorie est utilisée, cela va faire disparaître les transactions !!!');
        if (is_ok) {
            try {
                await axios.delete(`/api/category/${id}`);
                get_all_category();
            } catch (error: any) {
                console.log(error);
                alert(error.data);
            }
        }
        
    }
    
    async function submit_categorie() {
        try {
            let do_submit = true;

            let errors = {}
            
            if (is_empty(input.title)) {
                errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, title: null};
            }

            if (is_empty(input.icon)) {
                errors = {...errors, icon: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, icon: null};
            }

            if (do_submit) {
                let request_categorie = {
                    title: input.title,
                    icon: input.icon 
                }

                if (isUpdate) {
                    await axios.put(`/api/category/${idSelectedCategory}`, request_categorie);
                } else {
                    await axios.post('/api/category', request_categorie);
                }
                closeModalCategory();
                get_all_category(); 
            } else {
                // @ts-ignore
                setErrorInput(errors);
            }
        } catch (error: any) {
            console.log(error);
            alert(error.data);
        }
    }

    function clickUpdateModal(category: Category) {
        setInput({title: category.title, icon: category.icon});
        setModalAddCategory(true);
        setIsUpdate(true);
        setIdSelectedCaetgory(category.id);
    }

    function closeModalCategory() {
        setModalAddCategory(false);
        setInput({title: '', icon: ''});
        setErrorInput({title: null, icon: null});
        setIsUpdate(false);
        setIdSelectedCaetgory(null);
    }

    useEffect(() => {
        get_all_category();
    }, [])

    //TODO: find away to fix with of modal

    return (
        <div className="section-category">
            <div>
                <TitleSection title="Categories" />
                <div className='flex items-center'>
                    <TextInput type="text" title="Categorie" value={category} name="category" onChange={search} options={[]} onClickOption={undefined} error={null} overOnBlur={undefined} />
                    <div>
                        <Button title='Ajouter Categorie' backgroundColor={'rgb(103, 85, 215)'} colorText={'white'} onClick={() => setModalAddCategory(true)} />
                    </div>
                </div> 
            </div>
            <div className='flex flex-wrap'>
                {
                    searchingCategories.map((category, index) => <TagIcon 
                        onClick={category.icon === 'transfert' ? undefined :() => clickUpdateModal(category)}
                        key={index} title={category.title} 
                        icon={category.icon === 'transfert' ? 'fa-solid fa-right-left' : category.icon } 
                        onDelete={category.icon === 'transfert' ? undefined : () => delete_category(category.id)}/>)
                }
            </div>
            <Modal isOpen={openModalCategory} onClose={()=>{}}>
                <div className="modal-add-new-category ">
                    <h3>{isUpdate ? 'Modifier categorie' : 'Ajouter nouveau categorie'}</h3>
                    <TextInput title="Titre de la categorie" type="text" value={input.title} onChange={handleInput} name={"title"} options={[]} onClickOption={undefined} error={errorInput.title} overOnBlur={undefined} />
                    <TextInput title="Nom icon (FontAwsome)" type="text" value={input.icon} onChange={handleInput} name={"icon"} options={[]} onClickOption={undefined} error={errorInput.icon} overOnBlur={undefined} />
                    <div className="flex justify-around">
                        <Button title="Annuler" onClick={closeModalCategory} backgroundColor="#1E3050" colorText="white" />
                        <Button title={isUpdate ? "Modifier" : "Ajouter"} onClick={ submit_categorie} backgroundColor="#6755D7" colorText="white" />
                    </div>
                </div>
            </Modal>
        </div>
    )
}