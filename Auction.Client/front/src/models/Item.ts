interface IItem{
    description: string;
    image: string;
}

class Item implements IItem{
    description: string;
    image: string;

    constructor(description: string,image: string) {
        this.description = description;
        this.image = image;
    }
}

export default Item