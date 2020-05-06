export class Restaurant {

    restaurantId: number;
    name: string;
    info: string;
    min_spending: number;
    category: string;
    location: string;

    constructor(restaurantId?: number, name?: string, info?: string, min_spending?: number, category?: string, location?: string) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.info = info;
        this.min_spending = min_spending;
        this.category = category;
        this.location = location;
    }
}
