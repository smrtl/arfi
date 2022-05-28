export interface EndpointResponse {
  status: number;
  body?: any;
}

export const Success = (body?: any): EndpointResponse => ({ status: 200, body });
export const NoContent = (): EndpointResponse => ({ status: 204 });

export const BadRequest = (body?: any): EndpointResponse => ({ status: 400, body });
export const NotFound = (body?: any): EndpointResponse => ({ status: 404, body });
export const MethodNotAllowed = (body?: any): EndpointResponse => ({ status: 405, body });

export const InternalServerError = (body?: any): EndpointResponse => ({ status: 500, body });
