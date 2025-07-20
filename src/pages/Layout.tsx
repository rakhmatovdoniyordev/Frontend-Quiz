import { Outlet } from 'react-router-dom'
import  Footer  from '../components/Footer'
import React from 'react';

const Layout = () => {
  return (
    <>
        <main>
            <Outlet/>
        </main>
        <Footer/>
    </>
  )
}

export default React.memo(Layout);