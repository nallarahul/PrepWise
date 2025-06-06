import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action';

const Page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!) ?? [],
    await getInterviewsByUserId(user?.id!) ?? []
  ]);

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 card max-w-lg'>
          <h2>Get Interview Ready with AI Powered Practise and Feedback</h2>
          <p className='text-lg'>
            Practise on real interview questions and get instant feedback on your answers.
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robo" height={400} width={400} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 card mt-8">
        <h2>Your interviews</h2>

        <div className='interviews-section'>
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))) : (
                <p>You have not taken any interviews yet</p>
              )
          }
        </div>
      </section>

      <section className='flex flex-col gap-6 card mt-8'>
        <h2>Take an interview</h2>
        <div className='interviews-section'>
        {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))) : (
                <p>There are no new interviews available</p>
              )
          }
        </div>
      </section>
    </>
  );
};

export default Page;
