import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { LoadingContext } from '@/contexts/LoadingContext'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const { setShowLoading } = useContext(LoadingContext)
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        setShowLoading(true)
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => {
                mutate()
                setShowLoading(false)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                setShowLoading(false)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        setShowLoading(true)
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => {
                mutate()
                setShowLoading(false)
            }).catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                setShowLoading(false)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        setShowLoading(true)
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => {
                setStatus(response.data.status)
                setShowLoading(false)
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                setShowLoading(false)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        setShowLoading(true)
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response => {
                setShowLoading(false)
                router.push('/login?reset=' + btoa(response.data.status))
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
                setShowLoading(false)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (! error) {
            setShowLoading(true)
            await axios
                .post('/logout')
                .then(() => {
                    mutate()
                    setShowLoading(false)
                })
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
        if (window.location.pathname === "/verify-email" && user?.email_verified_at) router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
