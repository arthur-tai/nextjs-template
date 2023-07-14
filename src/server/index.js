const next = require('next')
const express = require('express')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
  
  // Handle static files and set cache controls, and early return
  
  // Use middleware like normal express usage;
  // For example: Cors, Security header, Compression, etc...

  // Also can interceptor that `/_next/*` of the folder, if needed;

  // Do something another api endpoint by frontend itself

  // Handle all of route as default, just like normal server that next.js did;
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})