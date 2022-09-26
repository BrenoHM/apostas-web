import { createContext, useState } from "react"
import Loading from "@/components/Loading"

export const LoadingContext = createContext({})

export const LoadingProvider = ({children}) => {

    const [showLoading, setShowLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{
            showLoading,
            setShowLoading,
        }}>
            { showLoading && <Loading /> }
            {children}
        </LoadingContext.Provider>
    )

}
