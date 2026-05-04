# Pace Environmental Observatory App

This folder contains the various files related to the application.

## Required Software

- [git](https://git-scm.com/) - version control. For installing git, please see the [git website](https://git-scm.com/).
- [npm](https://www.npmjs.com/) - package manager. For installing npm, please see [NodeJS Download](https://nodejs.org/en/download). Please scroll down. Once node is downloaded, npm is also.
- Testing:
    - _Option A_: [Android Studio](https://developer.android.com/studio) or Test Flight (Apple) - local testing. For installing please see respective websites.
        - Create a device emulator:
            - [Android Emulator](https://developer.android.com/codelabs/basic-android-kotlin-compose-emulator#2). Please verify you install the latest API Level.
    - _Option B_: [Expo Go](https://expo.dev/go) - on device testing. Download from the app store.
- All other prerequisites will be downloaded from the `package.json`. To install them see 'Getting Started'.

## Recommended Software

- [VS Code](https://code.visualstudio.com/) - code editor
    - Please download the recommended extensions if prompted.
    - Recommended Extensions (look up @recommended in Extensions tab):
        - Prettier - Code formatter
        - ESLint
        - Prettier ESLint
        - Tailwind CSS
        - Code Spell Checker
        - GitHub Pull Requests
- [GitHub CLI](https://cli.github.com/) - CLI for GitHub

## Getting Started (one-time steps)

1. Install all the software above.
2. Clone the repo by running:
    ```bash
    git clone https://github.com/bluecolab/BlueColab_MobileDataViz.git
    ```
3. Navigate in your terminal to the `BlueColab_MobileDataViz` directory:
    ```bash
    cd /BlueColab_MobileDataViz
    ```
4. Install the dependencies by running:
    ```bash
    npm ci
    ```

> [!TIP]
> If you get errors from npm command, try restarting your computer.
> Also, do not use PowerShell as a terminal. Instead use the terminal git bash. See [VS Code docs](https://code.visualstudio.com/docs/terminal/basics#_terminal-shells) on how.

## Running locally on computer via Expo Go

1. If you haven't. start a device emulator on your computer. The instructions to start one can be found [here](https://developer.android.com/codelabs/basic-android-kotlin-compose-emulator#2).
2. Open a terminal window.
3. In the terminal start the app by running:
    ```bash
    npx expo start
    ```
4. On the terminal, there will be instructions to start the app in emulator. (For example, pressing A key should start the app in an Android emulator)
    1. If it's your first time running the app, it may prompt you to install Expo. Hit yes if it does.

## Running on mobile device via Expo Go

1. Make sure your computer and phone are on the _same_ WiFi network.
2. Make sure you have 'Expo Go' App downloaded on your phone.
3. Open a terminal window.
4. In the terminal start the app by running:
    ```bash
    npx expo start
    ```
    5a. If you aren't able to connect to same network try (if it fails try again):
    ```bash
    npx expo start --tunnel
    ```
5. After running the above, a QR code should pop up.
    1. iPhone: Open the Camera App on iPhone, then scan the QR Code.
    2. Android: Open the Expo Go app, hit "Scan QR Code", then scan the QR Code.
6. The Expo Go app should open - with our app loaded!

## Running a Development Build

This is higher-level testing but overcomes limitations of Expo Go.

1. Create a new branch of any name - do not push it to GitHub
2. Please follow: https://expo.dev/blog/expo-go-vs-development-builds#how-to-get-started-with-a-development-build
3. Once setup you can run:

```
eas build --platform android --profile preview
```

> [!IMPORTANT]  
> Do not push any EAS related files to GitHub, especially to `main`. Doing so causes others to need your credentials when running `npx expo start`.

## File structure

### High level overview:

We use [file-based navigation](https://docs.expo.dev/router/basics/core-concepts/) provided via the [Expo Router](https://docs.expo.dev/router/introduction/) for navigation.

Please follow this structure when creating new files:

```
./ - Parent folder, for all sub-directories and config files
├───app - For all app pages and navigation related files
│   └───(tabs) - Our main navigation pattern, all pages should be under this directory
├───assets - For all images, icons, and fonts
├───components - For all of the custom components (building blocks of pages)
├───contexts - For all of the custom contexts (a way to share data between all pages and components)
├───hooks - For all of the custom hooks (reusable logic for state, data fetching, etc.)
├───patches - For patches needed to fix broken npm packages
├───types - For all custom TypeScript type definitions
└───utils - For all helper functions
```

Each of the above directories may be organized even further, grouped by similar functionality.
