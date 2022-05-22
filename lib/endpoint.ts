import type { NextApiRequest, NextApiResponse } from "next";
import { Validator } from "node-input-validator";

import { DEBUG } from "./settings";

type EnpointHandler = (params: EndpointParameters) => any;

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

const formatJsonSuccess = (data: any) => ({
  success: true,
  data,
});

const formatJsonError = (err: Error | String, errors?: Array<string>) => ({
  success: false,
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

      res.status(200).json(formatJsonSuccess(await handler(params)));
    } catch (err) {
      if (DEBUG) console.error(err);
      res.status(500).json(formatJsonError(err));
    }
  };
}
