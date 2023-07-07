export default class Generation {
    constructor(
        public id: number,
        public name: string,
        public translations: Map<string, string>,
    ){ }
}