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
