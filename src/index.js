import windstond from 'winstond'

const server = winstond.nssocket.createServer({
    services: ['collect', 'query', 'stream'],
    port: 9003
});

server.add(winstond.transports.File, {
    filename: __dirname + '/foo.log'
});

server.listen();