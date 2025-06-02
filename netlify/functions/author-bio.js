const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'author-bio.json');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    try {
      const data = fs.readFileSync(DATA_PATH, 'utf-8');
      return {
        statusCode: 200,
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    } catch (err) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Author bio not found.' }),
      };
    }
  }
  if (event.httpMethod === 'POST') {
    try {
      fs.writeFileSync(DATA_PATH, event.body, 'utf-8');
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save author bio.' }),
      };
    }
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
