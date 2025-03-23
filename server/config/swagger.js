
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Ophthalmvision',
      version: '1.0.0',
      description: 'API documentation for Ophthalmvision',
    },
    servers: [
      {
        url: 'http://localhost:9000', // Base URL of your API
      },
    ],
  },
  apis: ['./Routes/*.js'], // Path to your route files containing Swagger comments
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
module.exports = swaggerDocs;
