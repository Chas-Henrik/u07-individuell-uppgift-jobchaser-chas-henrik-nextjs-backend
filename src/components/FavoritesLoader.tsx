'use client'

// https://jobsearch.api.jobtechdev.se/search?offset=0&limit=100&remote=true
// https://jobsearch.api.jobtechdev.se/search?remote=true

import styles from './FavoritesLoader.module.css';
import { useEffect, useState, useContext } from 'react';
import useSWR from 'swr';
import type { JobType } from '@/types/types'
import { readFavorites } from '@/api/jobChaserApi';
import { SpinnerCircular } from 'spinners-react';
import { useAppDispatch } from '@/lib/hooks'
import { setFavorites } from '@/lib/features/lists/jobsSlice';
import { ThemeContext } from "@/context/themeContext";

export type LoaderProps = {
    LoadingCompleteEvent: () => void;
}

async function fetcher(userId: string): Promise<JobType[]> {
    try {
        const favJobs = await readFavorites(parseInt(userId));
        const jobArr: JobType[] = favJobs?.map(fav => ({ ...fav, favorite: true, posted: fav.posted.toString().split(".")[0], expires: fav.expires.toString().split(".")[0] }));
        return jobArr;
    } catch (error) {
        console.error(error);
        alert(error);
        return [];
    }
}

export function FavoritesLoader(props: LoaderProps) {
    // Local state variables
    const [showSpinner, setShowSpinner] = useState<boolean>(true);

    // Redux Toolkit (jobsSlice)
    const favoritesDispatch = useAppDispatch();

    // Theme Context
    const themeContext = useContext(ThemeContext);
    if (!themeContext) {
        throw new Error("ThemeContext is undefined");
    }
    const { darkTheme } = themeContext;

    const themeStyles = {
        backgroundColor: darkTheme ? '#333' : '#fff',
        color: darkTheme ? '#fff' : '#333',
        boxShadow: darkTheme ? 'var(--primary-box-shadow-dark-theme)' : 'var(--primary-box-shadow-light-theme)'
    };

    // Load jobs from API
    const { data, error } = useSWR("1", fetcher);

    // React Hooks
    useEffect(() => {
        if(error){
            console.error(error);
        } else if (data) {
            favoritesDispatch(setFavorites(data));
            setShowSpinner(false);
            props.LoadingCompleteEvent();
        }
    }, [data, error, favoritesDispatch, props]);

    return (
        showSpinner && <div style={themeStyles} className={styles.spinnerCircular}><SpinnerCircular size="15rem" thickness={250} speed={100}  color="#0000FF" /><p className={styles.spinnerLabel}>Loading...</p></div>
    );

}