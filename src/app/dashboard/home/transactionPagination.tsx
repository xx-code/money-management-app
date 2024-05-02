import Button from "@/app/components/button";

export default function TransactionPagination({current_page, max_page, precedent, next} : {current_page: number, max_page: number, precedent: any, next: any}) {
    return (
        <div className="flex justify-between">
            {
                current_page === 1 && max_page === 1 ? 
                <></>
                :
                <>
                    {
                        current_page === 1 ?
                            <Button backgroundColor="#313343" colorText="white" title="Precedent" onClick={precedent} />
                        :
                        <> 
                            <Button backgroundColor="#313343" colorText="white" title="Precedent" onClick={precedent} />
                            {
                                current_page == max_page ? 
                                <></>
                                :
                                <Button backgroundColor="#6755D7" colorText="white" title="Suivant" onClick={next}/>
                            }
                            
                        </>
                    }
                </>
            }
            
        </div>
    )
}