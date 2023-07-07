import Type from "./Type";
import Generation from "./Generation";
import Color from "./Color";

export default class Pokemon {  
    constructor(
        public id: number,
        public name: string,
        public types: Array<Type>,
        public color: Color,
        public legendary: boolean,
        public mythical: boolean,
        public generation: Generation,
        public imageUrl: string,
        public translations: Map<string, string>,
    ) { }
}