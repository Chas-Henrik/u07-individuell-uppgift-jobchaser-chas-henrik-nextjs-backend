'use client'

import styles from './Favorites.module.css';
import { useContext } from "react";
import type { JobType } from '@/types/types'
import JobList from '@/components/JobList';
import { useAppSelector } from '@/lib/hooks'
import { selectFavorites } from '@/lib/features/lists/jobsSlice';
import { ThemeContext } from "@/context/themeContext";

export default function Favorites() {
    // Redux Toolkit (jobsSlice)
    const favoriteJobs: JobType[] = useAppSelector(selectFavorites);

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

    return (
        <article style={themeStyles} className={styles.favoritesContainer}>
            <JobList jobsArr={favoriteJobs}/>
        </article>
    )
}