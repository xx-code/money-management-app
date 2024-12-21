'use client';

import axios from "axios";
import TopNav from "../topNav";
import { SectionCategory } from "./components/sectionCategory";
import SectionTags from "./components/sectionTags";
import { useCategories, useTags } from "../hooks/system";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Parameter() {
  const hookCategory = useCategories()
  const hookTag = useTags()
  const router = useRouter()

  async function deleteCategory(id: string) {
    let isOk = await confirm('Si la catégorie est utilisée, cela va faire disparaître les transactions !!!');
    if (isOk) {
        try {
            await axios.delete(`/api/category/${id}`);
            await hookCategory.fetchCategories()
        } catch (error: any) {
            console.log(error);
            alert(error.data);
        }
    }
  }

  async function deleteTag(id: string) {
    let is_ok = await confirm('Voulez vous supprimer le tag !!!');
    if (is_ok) {
        try {
            await axios.delete(`/api/tag/${id}`);
        } catch (error: any) {
            console.log(error);
            alert(error.data);
        }
    }
}

  const renderSectionCategory = () => {
    if (hookCategory.loading) {
      return <div>Chargement Categorie...</div>
    }

    if (hookCategory.error) {
      return <div>{hookCategory.error}</div>
    }

    return (
      <SectionCategory 
        categories={hookCategory.categories} 
        onDeleteCategory={deleteCategory} 
        onUpdateCategory={(id: string) => router.push(`/parameter/category/${id}`)} 
        onAddCategory={() =>  router.push(`/parameter/category/new`)}            
      />
    )
  }

  const renderSectionTag = () => {
    if (hookTag.loading) {
      return <div>Chargement tag...</div>
    }

    if (hookTag.error) {
      return <div>{hookTag.error}</div>
    }

    return (
      <SectionTags 
        tags={hookTag.tags} 
        onDeleteTag={deleteTag} 
        onUpdateTag={(id: string) => router.push(`/parameter/tag/${id}`)} 
        onAddTag={() => router.push(`/parameter/tag/new`)}         
      />
    )
  }

  useEffect(() => {
    hookCategory.fetchCategories()
    hookTag.fetchTags()
  }, [])

  return (
    <>
      <TopNav title='Parametre'/>
      <div style={{ marginTop: '2rem' }}>
          <div>
            {renderSectionCategory()}
            {renderSectionTag()}
          </div>
      </div>
    </>
  );
  }