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
