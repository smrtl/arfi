import type { NextApiRequest, NextApiResponse } from "next";
import { Validator } from "node-input-validator";

import { DEBUG } from "@/lib/settings";
import {
  BadRequest,
  EndpointResponse,
  InternalServerError,
  MethodNotAllowed,
  NoContent,
} from "./responses";

export * from "./responses";

// See validation rules at:
// https://www.npmjs.com/package/node-input-validator#rules

type EnpointHandler = (
  params: EndpointParameters
) => void | Promise<void> | EndpointResponse | Promise<EndpointResponse>;

interface ParametersDefinition {
  [field: string]: string;
}

interface EndpointParameters {
  query: { [field: string]: any };
  body: { [field: string]: any };
}

interface EndpointDefinition {
  getQuery?: ParametersDefinition;
  getBody?: ParametersDefinition;
  get?: EnpointHandler;
  postQuery?: ParametersDefinition;
  postBody?: ParametersDefinition;
  post?: EnpointHandler;
  deleteQuery?: ParametersDefinition;
  deleteBody?: ParametersDefinition;
  delete?: EnpointHandler;
}

const send = (res: NextApiResponse, result?: void | EndpointResponse) => {
  if (!result) result = NoContent();
  res.status(result.status);
  if (result.body) res.json(result.body);
  else res.end();
};

const formatJsonError = (err: Error | String, errors?: Array<string>) => ({
  error: err.toString ? err.toString() : err,
  errors,
});

const validateParam = async (
  method: string,
  param: string,
  def: EndpointDefinition,
  req: NextApiRequest
): Promise<void | EndpointResponse> => {
  const paramName = `${method}${param.replace(/^\w/, (c) => c.toUpperCase())}`;
  if (def[paramName]) {
    const validator = new Validator(req[param], def[paramName]);
    const valid = await validator.check();
    if (!valid) {
      const errors = Object.values(validator.errors).map((e: any) => e && e.message);
      return BadRequest(formatJsonError("Invalid parameters", errors));
    }
  }
};

export default function endpoint(def: EndpointDefinition) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const params: EndpointParameters = { query: req.query, body: req.body };
      const method = req.method.toLowerCase();

      const handler: EnpointHandler = def[method];
      if (!handler) return send(res, MethodNotAllowed(formatJsonError("Method Not Allowed")));

      const handlers = [
        () => validateParam(method, "query", def, req),
        () => validateParam(method, "body", def, req),
        () => handler(params),
      ];

      let result: void | EndpointResponse;
      for (let handler of handlers) {
        result = await handler();
        if (result) break;
      }
      send(res, result);
    } catch (err) {
      if (DEBUG) console.error(err);
      send(res, InternalServerError(formatJsonError(err)));
    }
  };
}
