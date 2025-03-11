const LOCAL_STORAGE_KEY = "u07-jobchaser-chas-henrik-nextjs : jwt";

export function readLocalStorageJwt(): string {
    const lsData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return lsData ? lsData : '';
}

export function writeLocalStorageJwt(jwt: string) {
    localStorage.setItem(LOCAL_STORAGE_KEY, jwt);
}
