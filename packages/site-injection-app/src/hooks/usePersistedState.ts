import { Dispatch, SetStateAction, useState, useEffect } from 'react'

/**
 * Little hook to replace `useState` which persists into local storage
 *
 * Inspired bt (read copied and added types): https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/
 *
 * @param key: The key used to save in localStorage
 * @param defaultValue: Optional default value
 */
export function usePersistedState<T>(key: string, defaultValue?: T): [T|undefined, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        const stickyValue = window.localStorage.getItem(key)
        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value])

    return [value, setValue]
}
