import { Fragment, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
const Home = lazy(() => import('../../pages/Home'))

/* ========================================================================
                                Router
======================================================================== */

const Router = () => {
  return (
    <Suspense fallback={Fragment}>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Suspense>
  )
}

export { Router }
