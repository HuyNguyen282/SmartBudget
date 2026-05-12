export declare class ApiResponseDto<T> {
    statusCode: number;
    message: string;
    data?: T;
    constructor(statusCode: number, message: string, data?: T, error?: any);
}
