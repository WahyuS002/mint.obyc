import Navbar from './components/Navbar'
import Minting from './components/Minting'
import Footer from './components/Footer'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <div className="h-screen bg-[#FFF9F0] font-inter">
            <ToastContainer />
            <div className="px-14 py-6">
                <Navbar />
            </div>
            <div>
                <Minting />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default App
