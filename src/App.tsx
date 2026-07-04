import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { startShopSync } from './lib/shopSync'
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

  // Run cloud sync app-wide whenever someone is signed in.
  useEffect(() => {
    if (!session) return
    const stopShop = startShopSync()
    const stopTransfer = startTransferSync()
    return () => {
      stopShop()
      stopTransfer()
    }
  }, [session])

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
