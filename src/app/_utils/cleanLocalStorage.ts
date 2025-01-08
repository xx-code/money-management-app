export function cleanTransactionsPageStorage() {
    localStorage.removeItem('currentPage')
    localStorage.removeItem('tag_filter')
    localStorage.removeItem('category_filter')
}