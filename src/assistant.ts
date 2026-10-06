import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function summarizeTicket(ticket: string): Promise<string> {
  const reply = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{ role: "user", content: `Summarize this ticket:\n${ticket}` }],
  });
  const block = reply.content[0];
  return block?.type === "text" ? block.text : "";
}
