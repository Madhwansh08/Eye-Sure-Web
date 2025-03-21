# Eye-Sure-Web

Eye-Sure-Web is a web application designed to assist users in uploading and processing fundus images for medical analysis. The application leverages AI models to analyze the images and provide detailed reports.

## Features

- Upload fundus images for both left and right eyes.
- Automated image processing using AI models.
- Review and edit analysis results.
- Download comprehensive reports with findings and observations.

## Technologies Used

- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **Cloud Storage:** AWS S3
- **AI Model Integration:** Axios

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/Eye-Sure-Web.git
    cd Eye-Sure-Web
    ```

2. **Install dependencies for the client:**
    ```bash
    cd client
    npm install
    ```

3. **Install dependencies for the server:**
    ```bash
    cd ../server
    npm install
    ```

## Configuration

1. **Server Configuration:**
    - Create a `.env` file in the `server` directory.
    - Add the following environment variables:
      ```env
      PORT=your_port
      MONGO_URI=your_mongodb_connection_string
      AWS_ACCESS_KEY_ID=your_aws_access_key
      AWS_SECRET_ACCESS_KEY=your_aws_secret_key
      AWS_REGION=your_aws_region
      S3_BUCKET_NAME=your_s3_bucket_name
      AI_DR_URL=your_ai_model_api_url
      AI_GLAUCOMA_URL=your_ai_model_api_url
      AI_CLAHE_URL=your_ai_model_api_url
      AI_ARMD_URL=your_ai_model_api_url
      AI_PREDICT_URL=your_ai_model_api_url
      ```

2. **Client Configuration:**
    - Create a `.env` file in the `client` directory.
    - Add the server URL:
      ```env
      VITE_BASE_URL=http://localhost:your_server_port
      ```

## Usage

1. **Start the Client:**
    ```bash
    cd client
    npm start
    ```

2. **Start the Server:**
    ```bash
    cd ../server
    npm start
    ```

3. **Access the Application:**
    - Open your browser and navigate to `http://localhost:5173` (or your configured port).


