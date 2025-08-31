import { Rating } from '@prisma/client';
export interface CreateRatingData {
    applicationId: string;
    rating: number;
    comment?: string;
    fromUserId: string;
    toUserId: string;
}
export interface UpdateRatingData {
    rating?: number;
    comment?: string;
}
export declare class RatingRepository {
    create(data: CreateRatingData): Promise<Rating>;
    findById(id: string): Promise<Rating | null>;
    findByApplicationId(applicationId: string): Promise<Rating | null>;
    findByUserId(userId: string): Promise<Rating[]>;
    update(id: string, data: UpdateRatingData): Promise<Rating>;
    delete(id: string): Promise<Rating>;
    findMany(filters?: {
        fromUserId?: string;
        toUserId?: string;
        applicationId?: string;
    }): Promise<Rating[]>;
    getUserAverageRating(userId: string): Promise<{
        average: number;
        count: number;
    }>;
}
//# sourceMappingURL=rating.repository.d.ts.map