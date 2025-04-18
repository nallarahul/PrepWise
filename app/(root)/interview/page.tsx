'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image'; // Required for optimized image handling
import RobotIcon from '@/public/robot.png'; // <-- Make sure to place your image in /public as robot.png

const InterviewSelection = () => {
  const router = useRouter();

  const handleAIRedirect = () => {
    router.push('/ai-interview');
  };

  const [numQuestions, setNumQuestions] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setUploadError('');
    } else {
      setResumeFile(null);
      setUploadError('Please upload a valid PDF file.');
    }
  };

  const handleNumQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNumQuestions(isNaN(value) ? null : value);
  };

  const handleResumeInterview = async () => {
    if (!resumeFile) {
      setUploadError('Please upload a resume.');
      return;
    }
    if (!numQuestions || numQuestions <= 0) {
      alert('Please enter a valid number of questions.');
      return;
    }

    setLoadingQuestions(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('amount', numQuestions.toString());

    try {
      const response = await fetch('/api/generate-resume-questions', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          router.push('/');
        } else {
          alert('Error: Invalid response from server.');
        }
      } else {
        alert('Error: Failed to communicate with the server.');
      }
    } catch (error) {
      console.error('Resume interview error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-white mb-6">Choose Interview Type</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Interview */}
          <div
            onClick={handleAIRedirect}
            className="bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-700 transition duration-300"
          >
            <div className="flex justify-center items-center h-32 mb-4">
              <Image
                src={RobotIcon}
                alt="Robot Icon"
                className="object-contain"
                width={80}
                height={80}
              />
            </div>
            <h2 className="text-xl font-semibold text-white text-center">AI Interview</h2>
            <p className="text-gray-400 text-center mt-2">Practice with an AI interviewer.</p>
          </div>

          {/* Resume-Based Interview */}
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">Resume Based Interview</h2>
            <p className="text-gray-400 text-center mb-4">Get questions tailored to your resume.</p>
            <div className="mb-3">
              <label htmlFor="resumeUpload" className="block text-gray-300 text-sm font-bold mb-2">
                Upload Resume (PDF):
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resumeUpload"
                  className="block w-full text-left cursor-pointer bg-gray-700 text-white py-2 px-4 rounded shadow border border-gray-600 hover:bg-gray-600 transition"
                >
                  {resumeFile ? resumeFile.name : 'Choose File'}
                </label>
              </div>
              {uploadError && <p className="text-red-500 text-xs italic mt-2">{uploadError}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="numQuestions" className="block text-gray-300 text-sm font-bold mb-2">
                Number of Questions:
              </label>
              <input
                type="number"
                id="numQuestions"
                min="1"
                value={numQuestions === null ? '' : numQuestions}
                onChange={handleNumQuestionsChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={handleResumeInterview}
              disabled={loadingQuestions || !resumeFile || !numQuestions || numQuestions <= 0}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${
                loadingQuestions || !resumeFile || !numQuestions || numQuestions <= 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loadingQuestions ? 'Generating...' : 'Generate Interview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSelection;