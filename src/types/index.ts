export type Guitar = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    quantity?: number;
}

export type CartItem = Guitar & {
    quantity: number;
}