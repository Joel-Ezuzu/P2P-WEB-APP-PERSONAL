import { Route, Routes } from 'react-router-dom'
import { FrozenGate } from './components/FrozenGate'
import { GuestOnly, RequireAuth } from './components/RouteGuards'
import { AppLayout } from './layouts/AppLayout'
import { AuthLayout } from './layouts/AuthLayout'
import Freeze from './pages/account/Freeze'
import Unfreeze from './pages/account/Unfreeze'
import VerifyIdentity from './pages/account/VerifyIdentity'
import Deposit from './pages/Deposit'
import Exchange from './pages/exchange/Exchange'
import Home from './pages/Home'
import About from './pages/info/About'
import Help from './pages/info/Help'
import Privacy from './pages/info/Privacy'
import Support from './pages/info/Support'
import Terms from './pages/info/Terms'
import Kyc from './pages/kyc/Kyc'
import Login from './pages/Login'
import CreateOffer from './pages/market/CreateOffer'
import Market from './pages/market/Market'
import OfferDetails from './pages/market/OfferDetails'
import NotFound from './pages/NotFound'
import OrderDetails from './pages/orders/OrderDetails'
import Orders from './pages/orders/Orders'
import Profile from './pages/profile/Profile'
import UpdateNickname from './pages/profile/UpdateNickname'
import ChangePassword from './pages/settings/ChangePassword'
import ChangePin from './pages/settings/ChangePin'
import Notifications from './pages/settings/Notifications'
import Preferences from './pages/settings/Preferences'
import Security from './pages/settings/Security'
import Settings from './pages/settings/Settings'
import Signup from './pages/Signup'
import Statements from './pages/Statements'
import Transfer from './pages/transfer/Transfer'
import Wallet from './pages/Wallet'
import Withdraw from './pages/Withdraw'

export default function App() {
  return (
    <Routes>
      {/* Signed-out pages */}
      <Route element={<AuthLayout />}>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        {/* Readable by anyone, so the sign up page can link to them */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      {/* Signed-in pages */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />

          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/deposit" element={<Deposit />} />
          <Route path="/wallet/withdraw" element={<FrozenGate><Withdraw /></FrozenGate>} />
          <Route path="/transfer" element={<FrozenGate><Transfer /></FrozenGate>} />
          <Route path="/exchange" element={<FrozenGate><Exchange /></FrozenGate>} />

          <Route path="/marketplace" element={<Market />} />
          <Route path="/marketplace/:offerId" element={<FrozenGate><OfferDetails /></FrozenGate>} />
          <Route path="/create-offer" element={<FrozenGate><CreateOffer /></FrozenGate>} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/statements" element={<Statements />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/update-nickname" element={<UpdateNickname />} />
          <Route path="/kyc" element={<Kyc />} />

          <Route path="/settings" element={<Settings />} />
          <Route path="/security" element={<Security />} />
          <Route path="/change-pin/:type" element={<ChangePin />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/preferences" element={<Preferences />} />

          <Route path="/freeze" element={<Freeze />} />
          <Route path="/unfreeze" element={<Unfreeze />} />
          <Route path="/verify-identity" element={<VerifyIdentity />} />

          <Route path="/help" element={<Help />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
