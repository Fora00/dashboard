import { lazy, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { startBoardgameIdeasSync } from './lib/boardgameIdeasSync'
import { startBookIdeasSync } from './lib/bookIdeasSync'
import { startClimbSync } from './lib/climbSync'
import { startCustomEventsSync } from './lib/customEventsSync'
import { startEventInterestSync } from './lib/eventInterestSync'
import { startEventInterestProfileSync } from './lib/eventInterestProfileSync'
import { startEventMarksSync } from './lib/eventMarksSync'
import { startHabitSync } from './lib/habitSync'
import { startLifeSync } from './lib/lifeSync'
import { startLinksSync } from './lib/linksSync'
import { startMealDiarySync } from './lib/mealDiarySync'
import { startProjectPrefsSync } from './lib/projectPrefsSync'
import { startShopSync } from './lib/shopSync'
import { startTripsSync } from './lib/tripsSync'
import { startTodoSync } from './lib/todoSync'
import { startTransferSync } from './lib/transferSync'
import { useAuth } from './lib/useAuth'
import { Home } from './projects/home/Home'

// Each project page is its own chunk (the home grid stays eager): visitors only
// download what they open. The PWA precaches every chunk, so pages still work
// offline; a chunk that fails to load lands in Layout's ErrorBoundary.
const page = <T extends Record<string, React.ComponentType>>(load: () => Promise<T>, name: keyof T & string) =>
  lazy(() => load().then((m) => ({ default: m[name] as React.ComponentType })))
const BoardgameIdeas = page(() => import('./projects/boardgame-ideas/BoardgameIdeas'), 'BoardgameIdeas')
const BookIdeas = page(() => import('./projects/book-ideas/BookIdeas'), 'BookIdeas')
const Climbing = page(() => import('./projects/climbing/Climbing'), 'Climbing')
const MealDiary = page(() => import('./projects/meal-diary/MealDiary'), 'MealDiary')
const Habits = page(() => import('./projects/habits/Habits'), 'Habits')
const Events = page(() => import('./projects/events/Events'), 'Events')
const EventInterests = page(() => import('./projects/events/Interests'), 'Interests')
const JoinProject = page(() => import('./projects/join/JoinProject'), 'JoinProject')
const Life = page(() => import('./projects/life/Life'), 'Life')
const LifeEditor = page(() => import('./projects/life/LifeEditor'), 'LifeEditor')
const LifeImport = page(() => import('./projects/life/LifeImport'), 'LifeImport')
const Links = page(() => import('./projects/links/Links'), 'Links')
const LocalTransfer = page(() => import('./projects/local-transfer/LocalTransfer'), 'LocalTransfer')
const Settings = page(() => import('./projects/settings/Settings'), 'Settings')
const Todo = page(() => import('./projects/todo/Todo'), 'Todo')
const Trips = page(() => import('./projects/trips/Trips'), 'Trips')
const Sharing = page(() => import('./projects/sharing/Sharing'), 'Sharing')
const JoinArea = page(() => import('./projects/shop-list/JoinArea'), 'JoinArea')
const ShopList = page(() => import('./projects/shop-list/ShopList'), 'ShopList')

// Hash-based routing so deep links work on GitHub Pages without a server.
export default function App() {
  const session = useAuth()
  // Key on the user id, not the session object: token refreshes swap the
  // session identity and would otherwise re-subscribe + full-pull every time.
  const userId = session?.user?.id

  // Run cloud sync app-wide whenever someone is signed in.
  useEffect(() => {
    if (!userId) return
    const stops = [
      startShopSync(),
      startTodoSync(),
      startClimbSync(),
      startHabitSync(),
      startTransferSync(),
      startBookIdeasSync(),
      startBoardgameIdeasSync(),
      startLinksSync(),
      startLifeSync(),
      startMealDiarySync(),
      startTripsSync(),
      startCustomEventsSync(),
      startEventMarksSync(),
      startEventInterestSync(),
      startEventInterestProfileSync(),
      startProjectPrefsSync(),
    ]
    return () => {
      for (const stop of stops) stop()
    }
  }, [userId])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/local-transfer" element={<LocalTransfer />} />
          <Route path="/shop-list" element={<ShopList />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/climbing" element={<Climbing />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/meal-diary" element={<MealDiary />} />
          <Route path="/book-ideas" element={<BookIdeas />} />
          <Route path="/boardgame-ideas" element={<BoardgameIdeas />} />
          <Route path="/links" element={<Links />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/interests" element={<EventInterests />} />
          <Route path="/life" element={<Life />} />
          <Route path="/life/import" element={<LifeImport />} />
          <Route path="/life/edit" element={<LifeEditor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sharing" element={<Sharing />} />
          <Route path="/join/:token" element={<JoinArea />} />
          <Route path="/join/p/:token" element={<JoinProject />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
