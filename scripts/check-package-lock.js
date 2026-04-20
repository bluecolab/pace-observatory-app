// Script to check package-lock.json for recently published packages and run npm audit for critical vulnerabilities
// Cover cases where we download packages after vulnerable versions have been released but before taken down

const fs = require('fs');
const https = require('https');
const { exec, execSync } = require('child_process');

const DAYS = 1;

// Load package-lock.json
const packageLockPath = 'package-lock.json';
const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8'));

// Get the current date and calculate the cutoff (24 hours ago)
const now = new Date();
const oneDayAgo = new Date(now.getTime() - DAYS * 24 * 60 * 60 * 1000);

const cleanPackageName = (pkgName) => {
    // Remove everything before and including the last occurrence of "node_modules/"
    return pkgName.replace(/.*node_modules\//, '');
};

// Function to fetch metadata from the npm registry
const fetchPackageMetadata = (() => {
    const cache = new Map(); // Cache to store package metadata (entire time object)

    return (packageName, version) => {
        if (cache.has(packageName)) {
            const metadata = cache.get(packageName);
            if (metadata.time[version]) {
                return Promise.resolve(new Date(metadata.time[version]));
            } else {
                return Promise.reject(
                    `Version ${version} not found in cached metadata for ${packageName}`
                );
            }
        }

        return new Promise((resolve, reject) => {
            const url = `https://registry.npmjs.org/${packageName}`;
            https
                .get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const metadata = JSON.parse(data);
                            cache.set(packageName, metadata); // Cache the entire metadata object
                            if (metadata.time[version]) {
                                resolve(new Date(metadata.time[version]));
                            } else {
                                reject(
                                    `Version ${version} not found in metadata for ${packageName}`
                                );
                            }
                        } catch (err) {
                            reject(`Failed to parse metadata for ${packageName}: ${err.message}`);
                        }
                    });
                })
                .on('error', (err) => {
                    reject(`Failed to fetch metadata for ${packageName}: ${err.message}`);
                });
        });
    };
})();

const fetchMainBranchPackageLock = () => {
    const defaultBranch = 'origin/main'; // Explicitly use 'origin/main'
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec(`git show ${defaultBranch}:package-lock.json`, (err, stdout, stderr) => {
            if (err) {
                reject(`Failed to fetch package-lock.json from ${defaultBranch}: ${stderr}`);
            } else {
                try {
                    const mainPackageLock = JSON.parse(stdout);
                    resolve(mainPackageLock);
                } catch (parseErr) {
                    reject(
                        `Failed to parse package-lock.json from ${defaultBranch}: ${parseErr.message}`
                    );
                }
            }
        });
    });
};

// Function to check package publish dates
const checkPackagePublishDates = async () => {
    const mainBranchPackageLock = await fetchMainBranchPackageLock().catch((err) => {
        console.error(err);
        process.exit(1);
    });

    const mainBranchPackages = mainBranchPackageLock.packages || {};
    const currentPackages = packageLock.packages || {};
    let hasRecentPackage = false;

    console.log(`The following packages were not found in main:`);
    for (const [pkgName, pkgData] of Object.entries(currentPackages)) {
        const cleanName = cleanPackageName(pkgName);

        // Skip packages that exist in the main branch with the same version
        if (
            mainBranchPackages[pkgName] &&
            mainBranchPackages[pkgName].version === pkgData.version
        ) {
            continue;
        }

        console.log(`Checking package: \x1b[34m${cleanName}@${pkgData.version}\x1b[0m:`);

        if (pkgData.resolved && pkgData.version) {
            try {
                const installedVersion = pkgData.version;

                // Fetch publish date for the specific version
                const publishDate = await fetchPackageMetadata(cleanName, installedVersion);

                // Check if the package was published within the last 24 hours
                if (publishDate > oneDayAgo) {
                    console.error(
                        `\tPackage was \x1b[31mpublished less than ${DAYS} day ago\x1b[0m on ${publishDate.toISOString()}.`
                    );
                    hasRecentPackage = true;
                } else {
                    console.log(
                        `\tPackage is \x1b[32molder than ${DAYS} day\x1b[0m (published on ${publishDate.toISOString()}, ${Math.floor((Date.now() - publishDate.getTime()) / 1000 / 60 / 60 / 24)} days ago).`
                    );
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            console.warn(
                `Package "${pkgName}@${pkgData.version}" with clean name "${cleanName}" does not have a resolved URL or version.`
            );
        }
    }

    if (hasRecentPackage) {
        console.error(
            `\x1b[31mCausing build failure\x1b[0m: One or more packages were published less than ${DAYS} day ago.`
        );
        process.exit(1); // Fail the build
    } else {
        console.log(`All packages are older than ${DAYS} day. Build can proceed.`);
    }
};

const runNpmAudit = () => {
    return new Promise((resolve, reject) => {
        exec('npm audit --json', (err, stdout, stderr) => {
            if (err) {
                // npm audit exits with non-zero code if vulnerabilities are found
                try {
                    const auditReport = JSON.parse(stdout);
                    const criticalVulnerabilities = auditReport.metadata.vulnerabilities.critical;

                    if (criticalVulnerabilities > 0) {
                        console.error(
                            `\x1b[31mCritical vulnerabilities found: ${criticalVulnerabilities}\x1b[0m`
                        );
                        console.error('Please address these vulnerabilities before proceeding.');
                        process.exit(1); // Fail the script
                    } else {
                        console.log('\x1b[32mNo critical vulnerabilities found.\x1b[0m');
                        resolve();
                    }
                } catch (parseError) {
                    reject(`Failed to parse npm audit output: ${parseError.message}`);
                }
            } else {
                console.log('\x1b[32mNo vulnerabilities found.\x1b[0m');
                resolve();
            }
        });
    });
};

// Run the checks
const main = async () => {
    try {
        await runNpmAudit();
        await checkPackagePublishDates(); // Existing function
    } catch (error) {
        console.error(`\x1b[31m${error}\x1b[0m`);
        process.exit(1);
    }
};

main();
