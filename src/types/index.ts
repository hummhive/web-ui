export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface WebSocketMessage {
  type: 'posts' | 'post' | 'error';
  data: any;
}