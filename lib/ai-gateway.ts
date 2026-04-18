import { extractJsonMiddleware, gateway, wrapLanguageModel } from "ai";

export const DEFAULT_GATEWAY_MODEL = "moonshotai/kimi-k2.5";

export function requireGatewayKey() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error("AI_GATEWAY_API_KEY is not set");
  }
}

export function getGatewayModelId(model?: string) {
  requireGatewayKey();
  return model || process.env.AI_GATEWAY_MODEL || DEFAULT_GATEWAY_MODEL;
}

export function getGatewayTextModel(model?: string) {
  return gateway(getGatewayModelId(model));
}

export function getGatewayStructuredModel(model?: string) {
  return wrapLanguageModel({
    model: getGatewayTextModel(model),
    middleware: extractJsonMiddleware(),
  });
}
