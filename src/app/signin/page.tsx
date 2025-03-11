'use client'

import styles from './Signin.module.css'
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";
import { useAppDispatch } from '@/lib/hooks'
import { setFavorites } from '@/lib/features/lists/jobsSlice';
import { signIn } from "@/api/jobChaserApi";
import type { JobType } from '@/types/types'
import { readFavorites } from '@/api/jobChaserApi';

async function fetcher(): Promise<JobType[]> {
    try {
        const favJobs = await readFavorites();
        const jobArr: JobType[] = (favJobs) ? favJobs.map(fav => ({ ...fav, favorite: true, posted: fav.posted.toString().split(".")[0], expires: fav.expires.toString().split(".")[0] })) : [];
        console.log("jobArr", jobArr);
        return jobArr;
    } catch (error) {
        console.error(error);
        window.alert(error);
        return [];
    }
}

export default function SignIn() {
    // Redux Toolkit (jobsSlice)
    const favoritesDispatch = useAppDispatch();

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
    
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const res = await signIn(data);
        alert(res.message);
        if(res.result){
            const favorites = await fetcher()
            favoritesDispatch(setFavorites(favorites));
        }
    };

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
        <article style={themeStyles} className={styles.signinForm}>
            <h1 className={styles.header}>Login</h1>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <input className={styles.formInput} type="email" placeholder="E-mail" {...register("email", { required: true })} />
                {errors.email && <span className="text-red-500 text-base w-fit">{errors.email.message}</span>}
                <input className={styles.formInput} type="password" placeholder="Password" {...register("password", { required: true })} />
                {errors.password && <span className="text-red-500 text-base w-fit">{errors.password.message}</span>}
                <button className={styles.formSubmitButton} type="submit">Submit</button>
                <div></div>
            </form>
            <Link href="/signup" scroll={false}>
                <p className={styles.signupLink}>Register here to Sign Up</p>
            </Link>
        </article>
    )
}