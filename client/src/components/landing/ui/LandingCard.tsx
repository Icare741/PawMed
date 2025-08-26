  import React from 'react';

interface LandingCardProps {
  children: React.ReactNode;
}

const LandingCard: React.FC<LandingCardProps> = ({ children }) => {
  return (
    <div className='flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white'>
      {children}
    </div>
  );
};

export default LandingCard;
