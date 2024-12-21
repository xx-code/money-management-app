import { TagModel } from "@/app/api/models/tag";
import Button from "@/app/components/button";
import TagIcon from "@/app/components/tag/tagIcon";
import TextInput from "@/app/components/textInput";
import { TitleSection } from "@/app/components/titleSection";
import { searchInArr } from "@/core/domains/helpers";
import { useState } from "react";

type Props = {
    tags: TagModel[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string) => void
    onAddTag: () => void
}

export default function SectionTags({tags, onDeleteTag, onUpdateTag, onAddTag}: Props) {
    const [searchingTags, setSearchingTags] = useState<TagModel[]>(tags);
    const [inputTag, setInputTag] = useState<string>("")

    
    async function search(event: any) {
        let found_tags = searchInArr(event.target.value, tags.map(tag => inputTag));
        setSearchingTags(tags.filter(tag => found_tags.includes(tag.title)));
        setInputTag(event.target.value);
    }
    
    // async function submit_tag() {
    //     try {
    //         let do_submit = true;

    //         let error = ""
            
    //         if (is_empty(inputTag)) {
    //             error = "Champs vide"
    //             do_submit = false
    //         } else {
    //             error = "";
    //         }

    //         setErrorTag(error);

    //         if (do_submit) {
    //             let req = {
    //                 title: inputTag, 
    //             }

    //             await axios.post('/api/tag', req);
                
    //             get_all_tags(); 
    //         } 
    //     } catch (error: any) {
    //         console.log(error);
    //         alert(error.data);
    //     }
    // }

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
                        error={undefined}                  
                    />
                    <div>
                        <Button title='Ajouter Tags' backgroundColor={'rgb(103, 85, 215)'} colorText={'white'} onClick={onAddTag} />
                    </div>
                </div> 
            </div>
            <div className='flex flex-wrap'>
                {
                    searchingTags.map((tag, index) => <TagIcon 
                        onClick={() => onUpdateTag(tag.tagId)}
                        key={index} 
                        title={tag.title}
                        color={tag.color} 
                        icon={'fa-solid fa-tag'} 
                        onDelete={() => onDeleteTag(tag.tagId)}/>)
                }
            </div>
        </div>
    )
}