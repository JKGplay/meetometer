export {default} from 'next-auth/middleware'

export const config = {
    matcher: [
        '/dashboard',
        '/meet',
        '/meet/new'
    ]
}