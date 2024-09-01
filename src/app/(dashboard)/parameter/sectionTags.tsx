import Button from "@/app/components/button";
import TagIcon from "@/app/components/tag/tagIcon";
import TextInput from "@/app/components/textInput";
import { TitleSection } from "@/app/components/titleSection";
import { search_in_array } from "@/core/entities/libs";
import { Tag } from "@/core/entities/tag";
import { is_empty } from "@/core/entities/verify_empty_value";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SectionTags() {
    const [searchingTags, setSearchingTags] = useState<Tag[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [inputTag, setInputTag] = useState<string>("")
    const [errorTag, setErrorTag] = useState<string>("")

    
    async function search(event: any) {
        let found_tags = search_in_array(event.target.value, tags.map(tag => inputTag));
        setSearchingTags(tags.filter(tag => found_tags.includes(tag)));
        setInputTag(event.target.value);
    }

    async function get_all_tags() {
        try {
            const response_tags = await axios.get('/api/tag');
            let tags: Tag[] = response_tags.data.tags;
            setTags(tags)
            setSearchingTags(tags)
        } catch(error) {
            console.log(error);
        }
    }

    async function delete_tag(id: string) {
        let is_ok = await confirm('Voulez vous supprimer le tag !!!');
        if (is_ok) {
            try {
                await axios.delete(`/api/tag/${id}`);
                get_all_tags();
            } catch (error: any) {
                console.log(error);
                alert(error.data);
            }
        }
        
    }
    
    async function submit_tag() {
        try {
            let do_submit = true;

            let error = ""
            
            if (is_empty(inputTag)) {
                error = "Champs vide"
                do_submit = false
            } else {
                error = "";
            }

            setErrorTag(error);

            if (do_submit) {
                let req = {
                    title: inputTag, 
                }

                await axios.post('/api/tag', req);
                
                get_all_tags(); 
            } 
        } catch (error: any) {
            console.log(error);
            alert(error.data);
        }
    }

    useEffect(() => {
        get_all_tags()
    }, [])

    return (
        <div className="section-category">
            <div>
                <TitleSection title="Categories" />
                <div className='flex items-center'>
                    <TextInput 
                        type="text" 
                        title="Tag" 
                        value={inputTag} 
                        name="tag" 
                        onChange={search} 
                        options={[]} onClickOption={undefined} 
                        error={errorTag} overOnBlur={undefined} />
                    <div>
                        <Button title='Ajouter Tags' backgroundColor={'rgb(103, 85, 215)'} colorText={'white'} onClick={submit_tag} />
                    </div>
                </div> 
            </div>
            <div className='flex flex-wrap'>
                {
                    searchingTags.map((tag, index) => <TagIcon 
                        onClick={() => {}}
                        key={index} title={tag} 
                        icon={'fa-solid fa-tag'} 
                        onDelete={() => delete_tag(tag)}/>)
                }
            </div>
        </div>
    )
}