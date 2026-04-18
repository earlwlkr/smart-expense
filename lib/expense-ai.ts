import { generateText, Output } from "ai";
import { z } from "zod";
import { getGatewayModelId, getGatewayStructuredModel } from "@/lib/ai-gateway";

export type ExpenseCategorization = {
  name: string;
  amount: string;
  category: string;
};

const amountPattern = /^(\d+(?:[.,]\d+)?)\s*(k)?$/i;

const expenseCategorizationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  amount: z
    .string()
    .trim()
    .regex(amountPattern, "amount must be a number, optionally using k for thousands"),
  category: z.string().trim().min(1).max(60),
});

export async function categorizeExpenseWithGateway(
  text: string,
): Promise<ExpenseCategorization> {
  const model = getGatewayModelId();

  const result = await generateText({
    model: getGatewayStructuredModel(model),
    temperature: 0.1,
    maxOutputTokens: 256,
    messages: [
      {
        role: "system",
        content:
          'You categorize short expense notes. Return strict JSON only with name, amount, and category. Keep "amount" as a compact user-facing string like "50k" or "125000".',
      },
      {
        role: "user",
        content: `Categorize this expense note: ${text}`,
      },
    ],
    output: Output.object({
      schema: expenseCategorizationSchema,
      name: "expense_categorization",
      description:
        "Structured expense categorization with a short name, normalized amount string, and category.",
    }),
  });

  return result.output as ExpenseCategorization;
}
