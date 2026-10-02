# Preview Health Maxing on your Windows PC

You do the setup once. After that, seeing Claude's latest changes takes two clicks.

## Part 1: Create a home for the app on GitHub (once)

GitHub is a website that stores the app's files. Claude saves changes there, and your PC downloads them from there.

1. Go to **github.com** and sign in (your username is RileyMonahan).
2. Click the **+** button in the top-right corner, then click **New repository**.
3. In **Repository name**, type `health-maxing`.
4. Choose **Private**.
5. Leave every other option alone (don't tick "Add a README"). Click **Create repository**.
6. Go back to the Claude project, click **Project settings**, open **Resources** (repositories), and add `RileyMonahan/health-maxing`. If it asks you to connect or install GitHub, follow the prompts and allow access to that repository.
7. Tell Claude in the thread: "repo added". Claude will upload the app to it.

## Part 2: Install two free programs (once)

**Node.js** runs the app on your PC.

1. Go to **nodejs.org**.
2. Click the big button that says **LTS** to download it.
3. Open the downloaded file and click **Next** through every screen, then **Install**, then **Finish**. Keep all the default options.

**GitHub Desktop** downloads the app and its updates.

1. Go to **desktop.github.com** and click **Download for Windows**.
2. Open the downloaded file. It installs by itself and opens.
3. Click **Sign in to GitHub.com** and sign in with your GitHub account in the browser window that opens. Then click **Finish** back in GitHub Desktop.

## Part 3: Download the app (once, after Claude says it's uploaded)

1. In GitHub Desktop, click **File**, then **Clone repository**.
2. Click `RileyMonahan/health-maxing` in the list.
3. Leave the **Local path** as it is (it's usually `Documents\GitHub\health-maxing`). Click **Clone**.
4. When it finishes, click **Show in Explorer**. This opens the app's folder.

## Part 4: Open the preview

1. In the app's folder, double-click **Start Preview.bat**.
   - If Windows shows a blue "Windows protected your PC" box, click **More info**, then **Run anyway**. This only happens the first time.
2. A black window opens and shows text. The first time, it spends a few minutes getting the app ready. That's normal.
3. A phone-sized window opens with the app. The first load takes about a minute.
4. Keep the black window open while you use the preview. When you're done, close the black window.

## Every time Claude makes changes

1. Open **GitHub Desktop** and click **Fetch origin** at the top, then click **Pull origin** if it appears.
2. Double-click **Start Preview.bat** (if the preview is already open, it updates by itself after you pull).

## If something goes wrong

Take a screenshot of the black window and send it to Claude in the thread.

Your data in the preview (your profile, workouts and food) stays in that preview window. To start fresh, open the app's Profile page and tap **Reset all data**.
