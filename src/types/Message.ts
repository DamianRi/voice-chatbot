export type Message = {
    author: 'user' | 'bot'
    type: 'text' | 'audio'
    content: string
}
