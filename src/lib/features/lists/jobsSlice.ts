import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { createFavorite, deleteFavorite } from '@/api/jobChaserApi';
import type { JobType, FavoriteType } from '@/types/types'

const USER_ID = "3266e646-0ee7-4c08-a283-552874370f8e";

// Define a type for the slice state
export type JobsState = {
    jobsLoadingComplete: boolean;
    favoritesLoadingComplete: boolean;
    jobsArr: JobType[];
    favArr: JobType[];
}

// Define the initial state using that type
const initialState: JobsState = {
    jobsLoadingComplete: false,
    favoritesLoadingComplete: false,
    jobsArr: [], 
    favArr: []
}

async function addFavoriteApi(userId: string, job: JobType): Promise<void> {
    const { favorite, ...rest } = job; // Peel off favorite from job
    void favorite; // Ignore unused favorite
    const fav: FavoriteType = { ...rest, posted: new Date(job.posted), expires: new Date(job.expires) };
    const res = await createFavorite(userId, fav);
    if(!res.result) {
        alert(res.message);
    }
}

async function removeFavoriteApi(userId: string, id: string): Promise<void> {
    const res = await deleteFavorite(userId, id);
    if(!res.result) {
        alert(res.message);
    }
}

export const jobsSlice = createSlice({
    name: 'jobs',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setJobsLoadingComplete: (state, action: PayloadAction<boolean>) => {
            state.jobsLoadingComplete = action.payload;
        },
        setFavoritesLoadingComplete: (state, action: PayloadAction<boolean>) => {
            state.favoritesLoadingComplete = action.payload;
        },
        setJobs: (state, action: PayloadAction<JobType[]>) => {
            state.jobsArr = (action.payload) ? action.payload : [];
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
                addFavoriteApi(USER_ID, action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<JobType>) => {
            if(action.payload) {
                state.favArr = state.favArr.filter(job => job.id !== action.payload.id);
                removeFavoriteApi(USER_ID, action.payload.id);
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

export const { setJobsLoadingComplete, setFavoritesLoadingComplete, setJobs, appendJobs, setFavorites, toggleFavorite, addFavorite, removeFavorite } = jobsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectJobsLoadingComplete = (state: RootState) => state.jobs.jobsLoadingComplete
export const selectFavoritesLoadingComplete = (state: RootState) => state.jobs.favoritesLoadingComplete
export const selectJobs = (state: RootState) => state.jobs.jobsArr
export const selectFavorites = (state: RootState) => state.jobs.favArr

export default jobsSlice.reducer
