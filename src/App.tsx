import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { startClimbSync } from './lib/climbSync'
import { startHabitSync } from './lib/habitSync'
import { startShopSync } from './lib/shopSync'
import { startTodoSync } from './lib/todoSync'
import { startTransferSync } from './lib/transferSync'
import { useAuth } from './lib/useAuth'
import { Climbing } from './projects/climbing/Climbing'
import { Habits } from './projects/habits/Habits'
import { Home } from './projects/home/Home'
import { LocalTransfer } from './projects/local-transfer/LocalTransfer'
import { Settings } from './projects/settings/Settings'
import { Todo } from './projects/todo/Todo'
import { Sharing } from './projects/sharing/Sharing'
import { JoinArea } from './projects/shop-list/JoinArea'
import { ShopList } from './projects/shop-list/ShopList'

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
          <Route path="/settings" element={<Settings />} />
          <Route path="/sharing" element={<Sharing />} />
          <Route path="/join/:token" element={<JoinArea />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
