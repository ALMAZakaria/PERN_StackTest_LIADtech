import { Request, Response, NextFunction } from 'express';
import { ZodSchema, AnyZodObject } from 'zod';
export declare function validateRequest(schema: AnyZodObject): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateRequest(schema: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.middleware.d.ts.map