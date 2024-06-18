const fs = require('fs');

/***** Understanding Response ****/
// res.setHeader('Content-Type', 'text/html');
// res.write('<!doctype html')
// res.write('<html lang="en">')
// res.write('<head><title>My First Page</title></head>');
// res.write('<body>Response From Nodejs Server</body>');
// res.write('</html>');
// res.end();

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  /** Redirecting Request  ****/
  if (url === '/') {
    res.write('<!doctype html');
    res.write('<html lang="en">');
    res.write('<head><title>My Form Page</title></head>');
    res.write(
      '<body><form action="/message" method="POST"><input type = "text" name="message" /><button  type="submit">Save</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    // define an empty array
    const body = [];
    // store the chunks of data into the body array
    req.on('data', (chunk) => {
      // console.log(chunk)
      body.push(chunk);
    });

    // get the chunks of data at the end of the request and append them to the body array
    req.on('end', () => {
      const parseBody = Buffer.concat(body).toString();
      // console.log(parseBody)
      const message = parseBody.split('=')[1];
      fs.writeFileSync('message.txt', message);
      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
    });
  }
};

module.exports = requestHandler;
