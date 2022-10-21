import { useState, useEffect } from 'react';

type Loader<T> = () => Promise<T>;

export function useLoaderDataMutable<T>(
    loader: Loader<T>,
    initialData: T
) {
    const [state, setState] = useState<T>(initialData);
    useEffect(() => {
        loader().then(value => {
            setState(value);
        });
    });
    return [state, setState];
}

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://stack.recipes';

export async function fetchJson(path: String) {
    const res = await fetch(server + path);
    return await res.json();
}
