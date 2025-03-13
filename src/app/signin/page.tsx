'use client'

import styles from './Signin.module.css'
import Link from "next/link";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { selectJobs, setIsSignedIn, setJobs, setFavorites, selectIsSignedIn } from '@/lib/features/lists/jobsSlice';
import { signIn } from "@/api/jobChaserApi";
import type { JobType } from '@/types/types'
import { signOut, readFavorites } from '@/api/jobChaserApi';

async function fetcher(): Promise<JobType[]> {
    try {
        const favJobs = await readFavorites();
        const jobArr: JobType[] = (favJobs) ? favJobs.map(fav => ({ ...fav, favorite: true, posted: fav.posted.toString().split(".")[0], expires: fav.expires.toString().split(".")[0] })) : [];
        return jobArr;
    } catch (error) {
        console.error(error);
        window.alert(error);
        return [];
    }
}

export default function SignIn() {
    // Redux Toolkit (jobsSlice)
    const jobsArray = useAppSelector(selectJobs);
    const isSignedIn = useAppSelector(selectIsSignedIn);
    const jobsDispatch = useAppDispatch();

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6).max(15)
    })
    type FormData = z.infer<typeof formSchema>;

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });
    
    async function submitHandler(data: FormData): Promise<void>{
        const res = await signIn(data);
        alert(res.message);
        if(res.result){
            const favorites = await fetcher()
            jobsDispatch(setFavorites(favorites));
            jobsDispatch(setJobs(jobsArray));
            jobsDispatch(setIsSignedIn(true));
        }
    };

    async function SignOutClickHandler() {
        const res = await signOut();
        alert(res.message);
        jobsDispatch(setIsSignedIn(false));
    }

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
        <>
            { !isSignedIn && 
                <article style={themeStyles} className={styles.signInForm}>
                    <h1 className={styles.header}>Sign In</h1>
                    <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
                        <input className={styles.formInput} type="email" placeholder="E-mail" {...register("email", { required: true })} />
                        {errors.email && <span className="text-red-500 text-base w-fit">{errors.email.message}</span>}
                        <input className={styles.formInput} type="password" placeholder="Password" {...register("password", { required: true })} />
                        {errors.password && <span className="text-red-500 text-base w-fit">{errors.password.message}</span>}
                        <button className={styles.formSubmitButton} style={themeStyles} type="submit">Submit</button>
                        <div></div>
                    </form>
                    <Link href="/signup" scroll={false}>
                        <p className={styles.signupLink}>Register here to Sign Up</p>
                    </Link>
                </article>
            }
            { isSignedIn && 
                <article style={themeStyles} className={styles.signOutArticle}>
                    <h1 className={styles.header}>User Signed In</h1>
                    <button className={styles.formSignOutButton} style={themeStyles} type="button" onClick={SignOutClickHandler}>Sign Out</button>
                </article>
            }
        </>
    )
}