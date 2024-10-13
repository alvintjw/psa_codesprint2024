'use client'

import { useTypewriter, Cursor } from 'react-simple-typewriter'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Button } from '@/components/ui/button'

export default function Page() {
  const [text] = useTypewriter({
    words: ['People', 'Innovation', 'Excellence'],
    loop: true,
    delaySpeed: 2000
  })

  return (
    <>
      <div className='relative'>
        {/* Telegram button with chat bubble */}
        <div className="absolute top-2 right-2 flex items-center space-x-3">
          <div className="bg-white text-gray-700 text-sm p-3 rounded-lg shadow-xl">
            Try our telegram chatbot to match with mentors!
          </div>

          <a
            href='https://t.me/psa_mentormatching_bot'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300'
            title='Chat with our bot'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 240 240'
              fill='white'
              className='w-10 h-10'
            >
              <path d='M120 0C53.66 0 0 53.66 0 120s53.66 120 120 120 120-53.66 120-120S186.34 0 120 0zm58.2 82.25l-19.34 91.2c-1.45 6.57-5.34 8.2-10.8 5.11l-29.88-22.06-14.42 13.88c-1.59 1.59-2.91 2.91-5.94 2.91l2.12-30.03 54.69-49.53c2.37-2.37-.51-3.68-3.67-1.31l-67.47 42.53-29.08-9.09c-6.32-2.02-6.57-6.31 1.37-9.34l113.69-43.88c5.28-2.02 9.97 1.31 8.29 9.19z' />
            </svg>
          </a>
        </div>
      </div>

      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50 '>
          <p className='text-sm animate-in font-semibold text-gray-700'>
            PSAPortal is public!
          </p>
        </div>
        <h1 className='max-w-4xl text-5xl font-bold md:text-5xl lg:text-6xl mb-3'>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <div style={{ display: 'inline-block' }}>Putting</div>
            <div
              className='inline-flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500'
              style={{
                height: '95px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              &nbsp;{text}
              <Cursor cursorStyle='|' />
            </div>
          </div>
          <div>at the Heart of PSA</div>
        </h1>
        <p className='mt-5 max-w-prose text-zinc-500 dark:text-white sm:text-lg'>
          PSAPortal is designed to empower employees by fostering continuous
          learning and skill development. The portal promotes talent development
          and caters to a multi-generational workforce, all the while enhancing
          engagement through personalized growth opportunities.
        </p>
      </MaxWidthWrapper>

      <div>
        <div className='relative isolate'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-60 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-100'
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-y-20 rotate-[30deg] bg-gradient-to-tr from-[#0090F1] to-[#00CBD0] opacity-30 sm:left-[calc(50%-13rem)] sm:w-[72.1875rem]'
            />
          </div>

          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-80 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-120'
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
              }}
              className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-y-32 rotate-[30deg] bg-gradient-to-tr from-[#B1FF20] to-[#33D600] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]'
            />
          </div>
        </div>
      </div>
    </>
  )
}
