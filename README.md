# Job Chaser

This is a single-page, 'Job Chaser App' built with Typescript, React & NextJS.

The design is a 'Mobile First' responsive design that also support Tablet's and Desktop's. Breakpoints have been set at 650px for Tablet's & Small Desktop's, and 1100px for Medium & Large Desktop's.
A content driven breakpoint has also been inserted at 800px to improve responsiveness for the main menu/navigation bar.

The 'Job Chaser App' fetches job postings from the 'JobTechDev API' (see [https://jobsearch.api.jobtechdev.se/](https://jobsearch.api.jobtechdev.se/)), and displays the fetched job postings in a Job List. The app uses the 'remote filter' (`&remote=true`) to fetch all jobs that have potential to be remote. The jobs can also be filtered locally to narrow down the search results further.
  
  
The application supports the following features:
1. Dark/light-mode
2. Filter jobs on: Position, Role, Contract Type, City, Region & Country
3. Free text Headline search.
4. Mark/Un-mark job as favorite.
5. Favorite job list.
6. Framer hover effects on all 'User Interaction Elements' (Buttons, Combo Boxes, Text Input & Switch).
7. A User Registration form (currently not connected to any login service).
8. A User Login form (currently not connected to any login service).
9. Form Validation (using Zod)
  

The application uses the following 3:rd party libraries/components:
1. Framer (for 'User Interaction' hover effects)
2. Zod (for Form validation)
3. SWR (for data fetching)
4. Uuid (for generating unique list ID's)
5. Shadcn components (ComboBox & Switch)
6. Tailwind (for styling the shadcn components)
7. Spinners (for JobsLoader component)
  
  
Dark/light-mode has been implemented with 'useContext' and the filtering ComboBoxes, Search Input & Favorite Mark/Un-mark have been implemented with Redux Toolkit.

The user will be signed out and redirected to the landing page (`/`) on re-load, and the user will be redirected to the `/signin` page on `401 Unauthorized` errors.

The site has not been published as it is only intended as 'a test vehicle' for the `u08-skapa-backend-f-r-jobchaser-Chas-Henrik` project.

***
*Known problems:*
  
1. The Job List is only read once (at 'Jobs Page' Load/Re-load) from the 'JobTechDev API' of performance reasons, and no effort has been spent to keep the local content synchronized with the database after that. So the local data might not reflect what is currently in the data base at any point of time (e.g. if new jobs are added to the database or expired jobs are removed). However, it is assumed that the job list in the 'JobTechDev API' is not updated very frequently, so this should not be any major issue, and one can always reload to fetch the latest data.
2. The styling for Dark-mode can be improved, e.g. the background color for the search icon is not entirely correct (especially when hovered).

*Notes:*
  
1. Favorite jobs are stored in Local Storage and are not removed until they are un-marked as Favorite by the user (regardless if the job expires).
2. It takes some time to load all the jobs from the database (~7 secs on a 100MBits/s Laptop Computer), but the filtering features in the app will not work properly unless all jobs are available, so this is a 'necessary evil'.
3. The 'filter list' in the Combo Boxes lists the available choices based on the currently applied filters. This means that the user can only end up with 'No jobs' in the filtered list by using the Free Text search, or if there are no jobs in the 'JobTechDev API' database.
4. The img element in Job.tsx can not be replaced with the Image element since Image require a known width & height and the icons in the 'JobTechDev API' have different sizes, and we don't know them in advance.

***
