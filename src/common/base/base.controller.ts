export class BaseController {
  protected successResponse(data?: any, message?: string) {
    return {
      success: true,
      data,
      message
    };
  }

  protected errorResponse(error: string) {
    return {
      success: false,
      error
    };
  }
}