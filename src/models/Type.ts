export default class Type {
    constructor(
        public id: number,
        public name: string,
        public translations: Map<string, string>,
    ) { }
}