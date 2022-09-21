import 'tailwindcss/tailwind.css'
import { BetsProvider } from '@/contexts/BetsContext'
import { useRouter } from 'next/router'

const App = ({ Component, pageProps }) => {
    
    const router = useRouter();
    
    return (
        <>
        { router.pathname === '/' ? (
            <Component {...pageProps} />
        ): (
            <BetsProvider>
                <Component {...pageProps} />
            </BetsProvider>
        ) }
        </>
        
    )    
}

export default App
