export interface EndpointResponse {
  status: number;
  body?: any;
}

export const Success = (body: any): EndpointResponse => ({ status: 200, body });
