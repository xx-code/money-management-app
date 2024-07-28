'use client';

import TopNav from "../topNav";
import { SectionCategory } from "./sectionCategory";


export default function Parameter() {
  
  return (
    <>
      <TopNav title='Parametre'/>
      <div style={{ marginTop: '2rem' }}>
          <div>
            <SectionCategory />
          </div>
      </div>
    </>
  );
  }