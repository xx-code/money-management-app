export default interface Mapper {
    to_domain(dto: any): any
    to_persistence(domain: any): any
}