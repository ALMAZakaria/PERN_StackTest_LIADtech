import { CreateRatingData, UpdateRatingData } from './rating.repository';
export declare class RatingService {
    private ratingRepository;
    constructor();
    createRating(userId: string, data: CreateRatingData): Promise<any>;
    getRating(id: string): Promise<any>;
    updateRating(id: string, userId: string, data: UpdateRatingData): Promise<any>;
    deleteRating(id: string, userId: string): Promise<void>;
    getUserRatings(userId: string): Promise<any[]>;
    getUserAverageRating(userId: string): Promise<any>;
    searchRatings(filters?: {
        fromUserId?: string;
        toUserId?: string;
        applicationId?: string;
    }): Promise<any[]>;
}
//# sourceMappingURL=rating.service.d.ts.map