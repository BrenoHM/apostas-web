import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'
import Bets from '@/components/Bets'
import Leagues from '@/components/Leagues'
import Bet from '@/components/Bet'

const AppLayout = ({ header, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            {/* Page Heading */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            {/* Page Content */}
            <main>
                <div className="grid sm:grid-cols-1 md:grid-cols-[300px_1fr_400px]">
                    <div className="w-100">
                        <div className="py-9">
                            <div className="sm:pr-6 md:pl-6 md:pr-0">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h2 className="mb-3 bg-black text-white p-3 font-bold">Principais Ligas</h2>
                                        <Leagues />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="basis-full">{children}</div>
                    <div className="w-100">
                        <div className="py-9">
                            <div className="sm:pl-6 md:pr-6 md:pl-0 mb-2">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h2 className="mb-3 bg-black text-white p-3 font-bold">Boletim de Apostas</h2>
                                        <Bet />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:pl-6 md:pr-6 md:pl-0">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 bg-white border-b border-gray-200">
                                        <h2 className="mb-3 bg-black text-white p-3 font-bold">Apostas</h2>
                                        <Bets />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AppLayout
