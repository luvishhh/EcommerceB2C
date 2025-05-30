import { handlers } from '@/auth'

// Ensure this API route uses the Node.js runtime to avoid 'child_process' errors with MongoDB
export const runtime = 'nodejs'

export const { GET, POST } = handlers
