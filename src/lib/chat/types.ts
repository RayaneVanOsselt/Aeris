export type ChatAction = { type: "link"; label: string; href: string } | { type: "quote"; label: string };

export type ChatReply = {
  reply: string;
  actions: ChatAction[];
  suggestions: string[];
  mode: "local" | "llm";
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export const FALLBACK = "Je préfère ne pas vous donner une information approximative. Je peux vous orienter vers notre équipe.";
