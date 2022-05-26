import type { NextApiRequest, NextApiResponse } from "next";
import { Validator } from "node-input-validator";

import { DEBUG } from "@/lib/settings";
import { EndpointResponse } from "./responses";

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
  query?: ParametersDefinition;
  body?: ParametersDefinition;
  get?: EnpointHandler;
}

const formatJsonError = (err: Error | String, errors?: Array<string>) => ({
  error: err.toString ? err.toString() : err,
  errors,
});

const sendValidationError = (res: NextApiResponse, validator: Validator) => {
  const errors = Object.values(validator.errors).map((e: any) => e && e.message);
  res.status(400).json(formatJsonError("Invalid parameters", errors));
};

export default function endpoint(def: EndpointDefinition) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const params: EndpointParameters = { query: req.query, body: {} };

      if (def.query) {
        const validator = new Validator(req.query, def.query);
        const valid = await validator.check();
        if (!valid) return sendValidationError(res, validator);
      }

      const handler: EnpointHandler = def[req.method.toLowerCase()];
      if (!handler) return res.status(405).json(formatJsonError("Method Not Allowed"));

      const response = await handler(params);
      if (response) res.status(response.status).json(response.body);
      else res.status(204).end();
    } catch (err) {
      if (DEBUG) console.error(err);
      res.status(500).json(formatJsonError(err));
    }
  };
}
