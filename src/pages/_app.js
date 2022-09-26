import 'tailwindcss/tailwind.css'
import { BetsProvider } from '@/contexts/BetsContext'
import { useRouter } from 'next/router'
import { LoadingProvider } from '@/contexts/LoadingContext';

const App = ({ Component, pageProps }) => {
    
    const router = useRouter();
    
    return (
        <>
            <LoadingProvider>
                { router.pathname === '/' ? (
                    <Component {...pageProps} />
                ): (
                    <BetsProvider>
                        <Component {...pageProps} />
                    </BetsProvider>
                ) }
            </LoadingProvider>
        </>
    )    
}

export default App
