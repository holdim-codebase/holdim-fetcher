import { server } from './server'

server.listen({
  port: parseInt(process.env.PORT ?? '8080'),
}).catch(error => console.error(error))
