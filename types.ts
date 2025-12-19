
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
  sources?: { uri: string; title: string }[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
