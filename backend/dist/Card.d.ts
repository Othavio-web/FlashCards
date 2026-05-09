import { Model } from 'sequelize';
export interface CardAttributes {
    id?: number;
    category: string;
    question: string;
    answer: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Card extends Model<CardAttributes> implements CardAttributes {
    id: number;
    category: string;
    question: string;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
}
export default Card;
//# sourceMappingURL=Card.d.ts.map