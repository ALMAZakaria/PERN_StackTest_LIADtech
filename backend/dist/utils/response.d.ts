import { Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
    errors?: any[];
}
export declare class ResponseUtil {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: ApiResponse['meta']): Response;
    static created<T>(res: Response, data: T, message?: string): Response;
    static badRequest(res: Response, message?: string, errors?: any[]): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static notFound(res: Response, message?: string): Response;
    static conflict(res: Response, message?: string): Response;
    static internalServerError(res: Response, message?: string): Response;
}
//# sourceMappingURL=response.d.ts.map