# Recruiter AI Agent

A modern web application that streamlines the recruitment process using AI-powered candidate screening and interview scheduling.

## Features

- **AI-Powered Resume Screening**: Automatically analyze resumes against job descriptions
- **Smart Candidate Matching**: Score and rank candidates based on skills and experience
- **Automated Email Notifications**: Send personalized emails to candidates with interview details
- **Interactive Dashboard**: Visualize candidate matches and screening results
- **Video Interview Scheduling**: Schedule and manage video interviews with candidates
- **Real-time Analytics**: Track screening metrics and candidate performance

## Tech Stack

- **Frontend**: React.js with Material-UI
- **State Management**: React Context API
- **API Integration**: RESTful API with CORS support
- **Styling**: Material-UI components and custom CSS
- **Deployment**: Vercel (Frontend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aaditya17032002/RecruiterAIAgent.git
cd RecruiterAIAgent
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

The application uses the following API endpoints:

- `POST /api/upload-resume`: Upload and analyze resumes
- `GET /api/screen-results`: Fetch screening results
- `POST /api/allcandidatesEmail`: Send notifications to multiple candidates
- `POST /api/candidateEmail`: Send notification to a single candidate

All API endpoints are configured to use the live backend service at `https://recruiteraiagentbackend-1.onrender.com`.

## Key Components

### ResumeUpload
- Handles resume file uploads
- Processes job descriptions
- Integrates with AI screening service

### JobScreeningResults
- Displays candidate screening results
- Shows match scores and skill analysis
- Manages candidate notifications
- Generates temporary credentials for candidates

### AIInterviewScreen
- Manages video interview scheduling
- Handles interview notifications
- Tracks interview status

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_API_URL=https://recruiteraiagentbackend-1.onrender.com
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- React Router for navigation
- The AI screening service team

## Contact

Aaditya Soni - [GitHub](https://github.com/Aaditya17032002)

Project Link: [https://github.com/Aaditya17032002/RecruiterAIAgent](https://github.com/Aaditya17032002/RecruiterAIAgent)
