PATIENT SYMPTOM TRACKER

A web-based application that allows users to register, log in, and securely track their health symptoms with severity levels. The application provides health recommendations based on symptom severity and allows users to view a history of their logged symptoms.This is a RESTful API application built with Node.js and Express that serves as a Patient Symptom Tracker. It allows patients to register, log in, and record symptoms. The application also provides endpoints for doctors to view patient symptoms.

---------------

Table of Contents:

Features
Technology Stack
Installation
Environment Variables
Usage
API Endpoints
Project Structure
Dependencies
License

------------------------

1. Features:
   
User Registration and Login: Secure user authentication with bcrypt and JWT.
Symptom Logging: Allows users to log symptoms with a severity rating.
Health Recommendations: Provides advice based on the severity of symptoms.
Symptom History: Users can retrieve their full history of symptoms, including dates and severity ratings.

----------------------------------

2. Technology Stack:
   
Backend: Node.js, Express
Database: MongoDB
Additional Libraries: bcrypt, body-parser, dotenv, cors

-----------------------------------

3. Installation:

3.1. Clone the Repository
bash
Copy code
git clone https://github.com/balagit15/Patient-Symptom-Tracker-Project.git
cd Patient-Symptom-Tracker-Project

3.2. Install Dependencies
Install the necessary packages with:
bash
npm install
npm init -y
npm install express body-parser path

3.3 Create Public folder
Create folder named "public" and move the "index.html" to the "public" folder

3.4. Setup MongoDB
Make sure you have MongoDB installed locally or have access to a MongoDB cloud instance. Get your connection string ready for the next step.

3.5. Configure Environment Variables
Create a .env file in the root directory and add the following environment variables:

plaintext
Copy code
DATABASE_URI=<Your MongoDB Connection String>
PORT=5500

3.6. Start the Application
Run the application locally:

bash:
npm start
The server should be running at http://localhost:5500.
-----------------------------------------------------------------------------

4. Usage:

Log Symptoms: Log health symptoms along with severity levels.
View Symptom History: Get a list of previously logged symptoms by date.
You can test the API routes with a tool like Postman or integrate it with a front-end application.
--------------------------------------------------------------------------------------

5. API Endpoints:
   

Log a Symptom 
URL: /log_symptom
Method: POST
Headers:
makefile
Copy code
Authorization: Bearer <JWT Token>
Body Parameters:
json
Copy code
{
  "symptom": "Headache",
  "severity": 5 ,
  "date": 2024-11-06T07:18:19.006+00:00
}
Response: Success message and health recommendation based on severity.
Get Symptom History
URL: /get_symptom_history
Method: GET
Headers:
makefile
Copy code
Response: Array of symptom logs with dates and severity ratings.

--------------------------------------------------------------------------------

6. Project Structure
plaintext
Copy code
patient-symptom-tracker/
├── public/index.html                # Static files (HTML, CSS, etc.)
├── .env                   # Environment variables (not included in version control)
├── server.js              # Main server file
├── package.json           # Project metadata and dependencies
├── README.md              # Project documentation
└── requirements.txt       # List of dependencies

------------------------------------------------------------------------------------

7. Dependencies
The following packages are required to run this project:

express: Web framework for Node.js
mongoose: MongoDB object modeling tool
body-parser: Middleware to parse request bodies
bcrypt: Library for hashing passwords
jsonwebtoken: Library for creating and verifying JWTs
dotenv: Loads environment variables from a .env file
cors: Enables Cross-Origin Resource Sharing
Add these to your requirements.txt file if needed, or use npm install to install them directly.

plaintext
Copy code
express
mongoose
body-parser
bcrypt
dotenv
cors

--------------------------------------------------------------------------

8. License
This project is licensed under the MIT License. See the LICENSE file for more information.

Contact
For further assistance or inquiries, please reach out to 2022it0115@svce.ac.in
