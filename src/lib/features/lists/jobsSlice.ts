import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import type { JobType } from '@/types/types';

// Define a type for the slice state
export type JobsState = {
    isSignedIn: boolean;
    jobsLoadingComplete: boolean;
    favoritesLoadingComplete: boolean;
    jobsArr: JobType[];
    favArr: JobType[];
}

// Define the initial state using that type
const initialState: JobsState = {
    isSignedIn: false,
    jobsLoadingComplete: false,
    favoritesLoadingComplete: false,
    jobsArr: [], 
    favArr: []
}

export const jobsSlice = createSlice({
    name: 'jobs',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setIsSignedIn: (state, action: PayloadAction<boolean>) => {
            state.isSignedIn = action.payload;
        },
        setJobsLoadingComplete: (state, action: PayloadAction<boolean>) => {
            state.jobsLoadingComplete = action.payload;
        },
        setFavoritesLoadingComplete: (state, action: PayloadAction<boolean>) => {
            state.favoritesLoadingComplete = action.payload;
        },
        setJobs: (state, action: PayloadAction<JobType[]>) => {
            state.jobsArr = (action.payload) ? action.payload : [];
            state.jobsArr.forEach(job => {
                job.favorite = state.favArr.some(fav => fav.id === job.id);
            });
        },
        appendJobs: (state, action: PayloadAction<JobType[] | undefined>) => {
            if(action.payload !== undefined && action.payload !== null) {
                state.jobsArr.push(...action.payload);
            }
        },
        setFavorites: (state, action: PayloadAction<JobType[]>) => {
            state.favArr = (action.payload) ? action.payload : [];
        },
        addFavorite: (state, action: PayloadAction<JobType>) => {
            if(action.payload) {
                state.favArr.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<JobType>) => {
            if(action.payload) {
                state.favArr = state.favArr.filter(job => job.id !== action.payload.id);
            }
        },
        toggleFavorite: (state, action: PayloadAction<{id: string} | undefined>) => {
            const favJobArr = [state.jobsArr?.find(job => job.id === action.payload?.id), 
                                state.favArr?.find(job => job.id === action.payload?.id)];
            // Update arrays
            favJobArr.forEach((job) => {
                if(job) {
                    job.favorite = !job.favorite;
                }
            });
        },
    },
})

export const { setIsSignedIn, setJobsLoadingComplete, setFavoritesLoadingComplete, setJobs, appendJobs, setFavorites, toggleFavorite, addFavorite, removeFavorite } = jobsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsSignedIn = (state: RootState) => state.jobs.isSignedIn
export const selectJobsLoadingComplete = (state: RootState) => state.jobs.jobsLoadingComplete
export const selectFavoritesLoadingComplete = (state: RootState) => state.jobs.favoritesLoadingComplete
export const selectJobs = (state: RootState) => state.jobs.jobsArr
export const selectFavorites = (state: RootState) => state.jobs.favArr

export default jobsSlice.reducer
