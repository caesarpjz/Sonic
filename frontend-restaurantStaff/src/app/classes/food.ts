export class Food {

    foodId: number;
    name: string;
    category: string;
    price: number;
    dailyLimit: number;
    menuId: number;

    constructor(foodId?:number, name?:string, category?:string, price?:number, dailyLimit?:number, menuId?:number) {
        this.foodId = foodId;
        this.name = name;
        this.category = category;
        this.price = price;
        this.dailyLimit = dailyLimit;
        this.menuId = menuId;
    }
}
