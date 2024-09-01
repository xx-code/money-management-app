'use client';

import TopNav from "../topNav";
import { SectionCategory } from "./sectionCategory";
import SectionTags from "./sectionTags";


export default function Parameter() {
  
  return (
    <>
      <TopNav title='Parametre'/>
      <div style={{ marginTop: '2rem' }}>
          <div>
            <SectionCategory />
            <SectionTags />
          </div>
      </div>
    </>
  );
  }