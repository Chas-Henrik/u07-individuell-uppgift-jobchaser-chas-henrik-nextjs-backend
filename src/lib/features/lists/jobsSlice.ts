import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { addLocalStorageFavorites, removeLocalStorageFavorites, readLocalStorageFavorites } from '@/store/localStorage';
import { createFavorite, deleteFavorite } from '@/api/jobChaserApi';
import type { JobType, FavoriteType } from '@/types/types'

const USER_ID = 1;

// Define a type for the slice state
export type JobsState = {
    loadingComplete: boolean;
    jobsArr: JobType[];
    favArr: JobType[];
}

// Define the initial state using that type
const initialState: JobsState = {
    loadingComplete: false,
    jobsArr: [], 
    favArr: []
}

async function addFavorite(userId: number, job: JobType): Promise<void> {
    const { favorite, ...rest } = job; // Peel off favorite from job
    void favorite; // Ignore unused favorite
    const fav: FavoriteType = { ...rest, posted: new Date(job.posted), expires: new Date(job.expires) };
    const res = await createFavorite(userId, fav);
    if(!res.result) {
        alert(res.message);
    }
}

async function removeFavorite(userId: number, id: string): Promise<void> {
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
        setLoadingComplete: (state, action: PayloadAction<boolean>) => {
            state.loadingComplete = action.payload;
        },
        setJobs: (state, action: PayloadAction<JobType[]>) => {
            if(action.payload !== undefined && action.payload !== null) {
                state.jobsArr = action.payload !== undefined ? action.payload : [];
            }
        },
        appendJobs: (state, action: PayloadAction<JobType[] | undefined>) => {
            if(action.payload !== undefined && action.payload !== null) {
                state.jobsArr.push(...action.payload);
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
            // Update local storage and API
            const favJob = favJobArr.find(job => job !== undefined);
            if(favJob) {
                if(favJob.favorite) {
                    addLocalStorageFavorites(favJob);
                    addFavorite(USER_ID, favJob);
                } else {
                    removeLocalStorageFavorites(favJob);
                    removeFavorite(USER_ID, favJob.id);
                }
            }
        },
        fetchFavorites: (state) => {
            state.favArr = readLocalStorageFavorites() as JobType[];
        },
    },
})

export const { setLoadingComplete, setJobs, appendJobs, toggleFavorite, fetchFavorites } = jobsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoadingComplete = (state: RootState) => state.jobs.loadingComplete
export const selectJobs = (state: RootState) => state.jobs.jobsArr
export const selectFavorites = (state: RootState) => state.jobs.favArr

export default jobsSlice.reducer
