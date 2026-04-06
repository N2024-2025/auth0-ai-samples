import { NextRequest } from 'next/server';
import {
  streamText,
  type UIMessage,
  createUIMessageStream,
  createUIMessageStreamResponse,
  convertToModelMessages,
} from 'ai';

import { setAIContext } from '@auth0/ai-vercel';
import { openai } from '@ai-sdk/openai';
import { shopOnlineTool } from '@/lib/tools/shop-online';

const date = new Date().toISOString();
const AGENT_SYSTEM_TEMPLATE = `You are Eco Mentor, a helpful AI assistant that helps parents build eco-friendly habits for their children. You focus on water-saving education and sustainability challenges to create fun, educational experiences for kids.

Your main goal is to assist with scheduling and planning water-saving challenges. When a user asks to schedule a water-saving challenge in Google Calendar, explain that Google Calendar authorization is required first. You must obtain explicit permission before proceeding with any calendar operations.

Keep responses friendly, educational, and engaging for parents and children. Use simple language and encourage positive environmental actions. The current date and time is ${date}`;

export async function POST(req: NextRequest) {
  const { id, messages }: { id: string; messages: Array<UIMessage> } = await req.json();

  const sanitizedMessages = sanitize(messages);
  const tools = { shopOnlineTool };

  setAIContext({ threadID: id });

  const stream = createUIMessageStream({
    async execute({ writer }) {
      const result = streamText({
        model: openai.chat('gpt-4o-mini'),
        system: AGENT_SYSTEM_TEMPLATE,
        messages: await convertToModelMessages(sanitizedMessages),
        tools,
      });

      writer.merge(
        result.toUIMessageStream({
          sendReasoning: true,
        }),
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
}

function sanitize(messages: UIMessage[]) {
  return messages.filter(
    (m) =>
      !(m.role === 'assistant' && Array.isArray(m.parts) && m.parts.length > 0 && !m.parts.some((p: any) => !!p?.text)),
  );
}
