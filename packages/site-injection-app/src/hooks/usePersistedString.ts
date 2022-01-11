import { Dispatch, SetStateAction, useState, useEffect } from 'react'

type StringOrNull = string | null

/**
 * Little hook to replace `useState` which persists a string into local storage
 *
 * @param key: The key used to save in localStorage
 * @param defaultValue: Optional default value
 */
export function usePersistedString(key: string, defaultValue: StringOrNull): [StringOrNull, Dispatch<SetStateAction<StringOrNull>>] {
    const [value, setValue] = useState<StringOrNull>(() => {
        const stickyValue = window.localStorage.getItem(key)
        return stickyValue === null ? defaultValue : stickyValue
    })

    useEffect(() => {
        if (value) {
            window.localStorage.setItem(key, value)
        } else {
            window.localStorage.removeItem(key)
        }
    }, [key, value])

    return [value, setValue]
}
