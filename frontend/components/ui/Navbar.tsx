import React from 'react'
import { Button } from './button'
import Link from 'next/link'

function Navbar() {
  return (
    <div className='flex items-center justify-between text-white p-5'>
      <Link href={'/'} className='sm:text-2xl'>Strix</Link>
    </div>
  )
}

export default Navbar
