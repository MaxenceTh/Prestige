import { lazy, Suspense } from 'react' // 1. On importe lazy et Suspense
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/sections/navbar'

// 2. On remplace les imports statiques par des imports dynamiques (lazy)
import Hero from './components/sections/hero'
const UpcomingMovies = lazy(() => import('./components/sections/upcomingMovies'))
const PopularMovies = lazy(() => import('./components/sections/popularMovies'))
const TopRatedMovies = lazy(() => import('./components/sections/topRatedMovies'))
const StreamingPage = lazy(() => import('./components/page/streamingPage'))
const CatalogPage = lazy(() => import('./components/page/catalogPage'))

// Optionnel : Un petit composant de chargement simple
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-black text-white">
    Chargement...
  </div>
)

function App() {
  return (
    <>
      <Navbar />
      
      {/* 3. On enveloppe les Routes avec Suspense */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <UpcomingMovies />
              <PopularMovies />
              <TopRatedMovies />
            </>
          } />

          <Route path="/streaming/:providerId" element={<StreamingPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App