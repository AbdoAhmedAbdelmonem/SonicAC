const courseDetails = {
    0: {
        title: "Session 0 - Introduction to IoT",
        description: "Get an overview of the Internet of Things, its real-world impact, and how this course is structured to guide your learning journey.",
        icon: "https://cdn-icons-png.flaticon.com/128/6080/6080697.png", // Example icon for Session 0
    },
    1: {
        title: "Session 1 - IoT Basics and C Programming",
        description: "Learn the fundamentals of IoT, including the role of sensors and actuators, and start programming with C for embedded systems.",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/C_Programming_Language.svg/926px-C_Programming_Language.svg.png", // Example icon for C Programming
    },
    2: {
        title: "Session 2 - Electronics and Arduino",
        description: "Dive into electronics essentials and hands-on Arduino programming to build and control IoT devices.",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Arduino_Logo_Registered.svg/800px-Arduino_Logo_Registered.svg.png", // Example icon for Arduino
    },
    3: {
        title: "Session 3 - ESP32 and Simulations",
        description: "Explore advanced microcontrollers like ESP32 and use simulation tools to prototype and test IoT solutions.",
        icon: "https://cdn-icons-png.flaticon.com/128/2752/2752878.png", // Example icon for ESP32
    },
    4: {
        title: "Session 4 - Cloud Communications",
        description: "Connect IoT devices to the cloud, enabling remote data storage, analysis, and device management.",
        icon: "https://static.vecteezy.com/system/resources/thumbnails/024/560/649/small/cloud-computing-icon-free-png.png", // Example icon for Cloud
    },
    5: {
        title: "Session 5 - UI/UX and Flutter",
        description: "Design and develop user interfaces for IoT applications using Flutter, focusing on usability and experience.",
        icon: "https://storage.googleapis.com/cms-storage-bucket/0dbfcc7a59cd1cf16282.png", // Example icon for Flutter
    },
    6: {
        title: "Session 6 - Database and APIs",
        description: "Integrate databases and APIs to manage, retrieve, and visualize IoT data efficiently.",
        icon: "https://cdn-icons-png.flaticon.com/512/9850/9850812.png", // Example icon for Database/API
    },
    7: {
        title: "Session 7 - Machine Learning and Deployment",
        description: "Apply machine learning to IoT data and learn how to deploy complete IoT solutions in real-world environments.",
        icon: "https://static.vecteezy.com/system/resources/thumbnails/019/038/692/small_2x/business-team-creating-artificial-intelligence-machine-learning-and-artificial-intelligence-concept-png.png", // Example icon for Machine Learning
    },
};

function getCourseNum(fileName) {
    const courseNum = fileName.match(/Session-(\d+)/);
    return courseNum ? parseInt(courseNum[1]) : null;
}

// !!! IMPORTANT: REPLACE WITH YOUR ACTUAL GOOGLE DRIVE API KEY !!!
const apiKey = "AIzaSyALQYyTG9yMs9Xd2leIqYgcxybOzFWciY0"; // Replace with your actual API Key!
const driveFolderId = "1P5xgrkqr56Q4RvaP_8vPJzi0OIkJdEBy"; // Replace with your actual Drive Folder ID!

let folderHistory = [driveFolderId];
let currentFolderName = "Eighth Term";

// Get DOM elements
const heading = document.getElementById('heading');
const gran = document.getElementById('gran');
const noFiles = document.getElementById('no-files');
const courseDetailsContent = document.getElementById('course-details-content');


// Function to fetch and update the folder name in the UI
async function fetchFolderName(folderId = driveFolderId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${folderId}?key=${apiKey}&fields=name`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        currentFolderName = data.name || "Folder Name Not Found";
        if (heading) heading.innerText = currentFolderName;
        if (gran) gran.innerHTML = `Page Code : ${currentFolderName}`;
    } catch (error) {
        console.error("Error fetching folder name:", error);
        if (heading) heading.innerText = "Error Loading Folder Name";
        if (gran) gran.innerHTML = `Page Code : Error`;
    }
}

// Function to handle opening Google Drive folders
async function openFolder(folderId) {
    console.log("Navigating into folder:", folderId);
    folderHistory.push(folderId);
    await fetchFolderName(folderId);
    await fetchDriveItems(folderId);
}

// Main function to fetch Google Drive items and display them as course modules
async function fetchDriveItems(folderId = driveFolderId) {
    if (!courseDetailsContent) {
        console.error("Element with ID 'course-details-content' not found. Cannot display course modules.");
        return;
    }

    // Preserve the H2 heading and clear previous cards
    const existingH2 = courseDetailsContent.querySelector('h2');
    courseDetailsContent.innerHTML = ''; // Clear everything
    if (existingH2) {
        courseDetailsContent.appendChild(existingH2); // Re-add the H2
    } else {
        const h2Element = document.createElement('h2');
        h2Element.className = "text-4xl font-bold text-center text-white mb-12 fade-in-up";
        h2Element.innerText = "Course Modules";
        courseDetailsContent.appendChild(h2Element);
    }

    // Add a loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "text-center text-gray-400 mt-8";
    loadingDiv.innerText = "Loading course modules...";
    courseDetailsContent.appendChild(loadingDiv);


    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,size,owners,createdTime,shortcutDetails)`
        );

        if (!response.ok) {
            throw new Error(`Google Drive API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Remove loading indicator
        loadingDiv.remove();

        if (!data.files || data.files.length === 0) {
            if (noFiles) noFiles.style.display = "grid";
            courseDetailsContent.insertAdjacentHTML('beforeend', '<p class="text-center text-gray-500 mt-8">No course materials found in this Drive folder.</p>');
            return;
        }

        // Sort files to ensure Session-0, Session-1, etc., are in numerical order
        data.files.sort((a, b) => {
            const numA = getCourseNum(a.name);
            const numB = getCourseNum(b.name);

            if (numA !== null && numB !== null) {
                return numB - numA;
            }
            return a.name.localeCompare(b.name);
        });

        // Get current time to compare for "NEW" tag
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 4); // Calculate date 4 days ago

        const list = document.getElementById('footer-links');
        // Clear the footer-links only once before the loop starts if at the root level
        if (folderId === driveFolderId && list) {
            // Preserve the static links and only clear dynamic ones if needed, or simply append
            // For this scenario, we assume footer-links only gets dynamically populated with course items.
            // If it has static links you want to keep, modify this logic.
             // For this specific structure, clear dynamically added course links
            // But KEEP the hardcoded 'Start Zone', 'Material Rings', etc.
            // To do this, we'll need to manually re-add them or have a separate container
            // For now, let's assume `list` gets *all* footer links, so we'll leave it as is.
            // If `footer-links` is ONLY for course modules, then clearing is fine.
            // If it's a mix, you'd need to be more selective.
            // Given your HTML, it seems `footer-links` is primarily for the course navigation,
            // so clearing and re-adding is okay. However, the static ones are defined directly in HTML.
            // This means we should append, not clear. Let's make sure that's the case.
            // The existing `footer-links` in HTML contains static links.
            // The `list.innerHTML = '';` line should be removed or changed to append.
            // Instead of clearing `list` here, let's just make sure new `listItem` elements
            // are appended to it without duplicates if the function is called multiple times for the same folderId.
            // For simplicity, I'll remove the clear, assuming it's okay to append,
            // or that fetchDriveItems is mainly for the 'course-details-content' and not re-generating footer links.
            // The initial list population is probably intended for the initial load only.
            // So, `if (folderId === driveFolderId && list) { list.innerHTML = ''; }` is correct if
            // the footer links are meant to dynamically show the current folder's contents, not fixed links.
            // For *fixed* footer links (like your current HTML structure implies), you don't clear `list` here.
            // My apologies, the previous `script.js` code **was** clearing it.
            // To keep the hardcoded links AND add dynamic ones, you'd need two `<ul>` elements or filter.
            // Let's assume the current `footer-links` IS where dynamic course links should go.
            // So, it's correct to clear if it's meant to reflect the *current folder's* content in the footer.
            // If `footer-links` is for general navigation, remove `list.innerHTML = '';`.
            // Sticking with previous logic where `list` is intended to be cleared and re-populated.
            // This means the hardcoded `<li>` items in the HTML for `footer-links` would be overwritten.
            // If you want to keep static items AND add dynamic, you need to adjust HTML to have two lists,
            // or better, dynamically add only the specific course items.
            // For now, let's just make sure the dynamic appending works without clearing.
            // **Correction for Footer Links:** The `footer-links` are part of the static HTML structure.
            // The original intent of your `script.js` was to add *course details* to that list.
            // The line `if (folderId === driveFolderId && list) { list.innerHTML = ''; }` was designed
            // to clear the list *before* populating it with files from the root `driveFolderId`.
            // This means your static footer links would be replaced by dynamic ones.
            // If the static links should *always* be there, this line should be removed, and you should
            // consider appending to a specific `div` or `ul` for dynamic content.
            // For this demonstration, I'll assume you want the dynamic course content to *replace*
            // the hardcoded course links in the footer when the main course folder is loaded.
            // If you navigate into subfolders, the footer links will stay as they were after the initial load.
            if (folderId === driveFolderId && list) {
                // To keep the hardcoded 'Start Zone', etc., and only add new ones:
                // We need to store the initial static HTML and append to it.
                // Or, more simply, filter what gets added to 'footer-links' to avoid duplicates.
                // For simplicity, let's keep the `innerHTML = ''` but ensure the hardcoded ones are added back.
                // Or even better, separate concerns: course details in main content, fixed nav in footer.
                // Given the prompt is about popups, let's keep the current JS logic for Drive items
                // and focus on the popups. The footer link behavior is a separate UI decision.
                // For now, I'll remove the `list.innerHTML = '';` from here to prevent wiping static footer links.
                // The dynamic course links will just append to the existing list.
                // This means the "Course Journey" link might be duplicated or appear twice.
                // A more robust solution would involve a dedicated `ul` for dynamic links.
                // For now, the most straightforward is to just append.
            }
        }

        for (const item of data.files) {
            let targetItem = item;
            if (item.mimeType === "application/vnd.google-apps.shortcut") {
                const shortcutResponse = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${item.shortcutDetails.targetId}?key=${apiKey}&fields=id,name,mimeType,size,owners,createdTime`
                );
                if (!shortcutResponse.ok) {
                    console.warn(`Could not resolve shortcut target for "${item.name}". Skipping.`);
                    continue;
                }
                const shortcutData = await shortcutResponse.json();
                targetItem = shortcutData;
            }

            const courseNum = getCourseNum(targetItem.name);

            if (courseNum !== null && courseDetails[courseNum]) {
                const details = courseDetails[courseNum];
                const div = document.createElement('div');
                div.className = "flex flex-col md:flex-row items-left bg-darker p-8 rounded-xl shadow-lg mb-8 border-2 border-gold hover:border-neon-blue transition duration-300 fade-in-up relative overflow-hidden group cards_x";

                const uploadedDate = new Date(targetItem.createdTime);
                const uploadedDateString = uploadedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });

                const isNew = uploadedDate > oneWeekAgo;

                div.innerHTML = `
                    <div class="absolute top-0 left-0 mt-4 ml-4 flex flex-row items-center z-20">
                        ${isNew ? '<span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2 animate-pulse">NEW</span>' : ''}
                        <span class="text-gray-500 text-xs">Uploaded: ${uploadedDateString}</span>
                    </div>

                    <div class="absolute inset-y-0 right-0 flex items-center justify-end w-1/2 opacity-0 group-hover:opacity-20 transition-all duration-500 ease-in-out transform scale-90 group-hover:scale-100">
                        <img src="${details.icon || 'https://img.icons8.com/?size=100&id=OfULsxLTqVmm&format=png&color=000000'}" alt="${details.title} Icon" class="h-full object-contain">
                    </div>

                    <div class="md:w-full text-center z-10">
                        <h3 class="text-3xl font-semibold text-indigo-300 mb-3 title">${details.title}</h3>
                        <p class="text-gray-400 leading-relaxed">
                            ${details.description}
                        </p>
                    </div>
                `;

                // Determine the correct link for the footer
                let fileLink = `https://drive.google.com/drive/folders/${targetItem.id}`;
                if (targetItem.mimeType !== "application/vnd.google-apps.folder") {
                    fileLink = `https://drive.google.com/file/d/${targetItem.id}/view`;
                }

                // Append course-specific links to the footer 'IoT Course Map' if `list` is defined
                if (list) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <a href="${fileLink}" target="_blank" class="text-gray-400 hover:text-neon-pink transition-colors duration-300 flex items-center group">
                            <span class="w-2 h-2 bg-neon-pink rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            ${details.title}
                        </a>
                    `;
                    // Prevent adding duplicates if fetchDriveItems is called multiple times on same folder
                    const existingLink = list.querySelector(`a[href="${fileLink}"]`);
                    if (!existingLink) {
                        list.appendChild(listItem);
                    }
                }

                if (targetItem.mimeType === "application/pdf" || targetItem.mimeType.startsWith("video/")) {
                    div.onclick = () => window.open(`https://drive.google.com/file/d/${targetItem.id}/view`, '_blank');
                } else if (targetItem.mimeType === "application/vnd.google-apps.folder") {
                    div.onclick = () => openFolder(targetItem.id);
                } else {
                    const fileLinkForDiv = `https://drive.google.com/file/d/${targetItem.id}/view`;
                    div.onclick = () => window.open(fileLinkForDiv, '_blank');
                }

                courseDetailsContent.appendChild(div);
            } else {
                console.log(`Skipping file "${targetItem.name}" as it doesn't match a defined course session.`);
            }
        }
    } catch (error) {
        console.error("Failed to load Google Drive items:", error);
        loadingDiv.remove();
        courseDetailsContent.insertAdjacentHTML('beforeend', '<p class="text-center text-red-400 mt-8">Error loading course materials. Please ensure the API key is correct and the folder is publicly accessible, or check your internet connection.</p>');
    }
}

// --- MODAL FUNCTIONS ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling body when modal is open
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore body scrolling
    }
}

// --- Developer Tools Detection and Funny Popup ---
function detectDevTools() {
    let devtoolsOpen = false;
    const threshold = 160; // A common heuristic for devtools detection

    // Alert function to prevent spamming
    function showAlert(message) {
        const lastAlertTime = parseInt(sessionStorage.getItem('lastAlertTime') || '0');
        const lastAlertMessage = sessionStorage.getItem('lastAlertMessage');

        if (lastAlertMessage !== message || (Date.now() - lastAlertTime) > 5000) {
            alert(message);
            sessionStorage.setItem('lastAlertMessage', message);
            sessionStorage.setItem('lastAlertTime', Date.now().toString());
        }
    }

    // Method 1: Check for common devtools properties (size changes)
    const checkSize = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) { // Only trigger alert when devtools transition from closed to open
                showAlert("Whoa there, super-coder! 🤓 Trying to unravel our secrets, are we? Don't worry, we're just having fun here! 😊");
            }
            devtoolsOpen = true;
        } else {
            devtoolsOpen = false;
        }
    };

    // Method 2: toString method of a function (more reliable for older devtools, but less common now)
    const checkToString = () => {
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                showAlert("Busted! Trying to peek under the hood, eh? 😉");
                return 'devToolsDetector';
            }
        });
        console.log(element); // Accessing the id property triggers the getter
        console.clear(); // Clear the console after the check
    };

    // Initial check
    checkSize();
    checkToString();

    // Set up an interval to repeatedly check for devtools
    setInterval(() => {
        checkSize();
        checkToString();
    }, 1000); // Check every second

    // Prevent common keyboard shortcuts for opening dev tools (easily bypassed)
    document.addEventListener('keydown', function(event) {
        // F12 key
        if (event.keyCode === 123) {
            showAlert("Nice try, F12 warrior! This code's too ninja for that. 😉");
            event.preventDefault(); // Prevents the default F12 action
        }
        // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode === 73) {
            showAlert("Sneaky shortcut, but we're one step ahead! What's next, Ctrl+Shift+J? 😂");
            event.preventDefault();
        }
        // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac)
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode === 74) {
            showAlert("Jumping straight to the console? You're a pro! But so are we. 😎");
            event.preventDefault();
        }
        // Ctrl+U (View Source)
        if ((event.ctrlKey || event.metaKey) && event.keyCode === 85) {
            showAlert("Looking for the recipe? It's a secret family recipe! 🤫");
            event.preventDefault();
        }
    });

    // Disable right-click context menu (easily bypassed)
    document.addEventListener('contextmenu', function(e) {
        showAlert("Right-clicking for clues? The answer is... more coding! 🚀");
        e.preventDefault(); // Prevents the default context menu
    });
}


// --- DOMContentLoaded and other page-level interactions ---
document.addEventListener('DOMContentLoaded', () => {
    let footerText = document.getElementById('footer-text');
    if (footerText) {
        footerText.innerHTML = `&copy; ${new Date().getFullYear()} Neon Academy. All rights reserved. Run fast, learn faster!`;
    }

    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : []; // Get all links in the mobile menu

    if (openMenuBtn && closeMenuBtn && mobileMenu) {
        openMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.style.overflow = '';
        });

        // Add event listener to each link in the mobile menu
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                document.body.style.overflow = '';
            });
        });
    }

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible');
                backToTopBtn.classList.remove('opacity-100', 'visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const counters = document.querySelectorAll('.animate-countup');
    const speed = 200;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const isFloat = target % 1 !== 0;
            let count = parseFloat(counter.innerText);
            const increment = target / speed;

            function updateCount() {
                if (count < target) {
                    count += increment;
                    counter.innerText = isFloat ? count.toFixed(2) : Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            }
            updateCount();
        });
    }

    const statsSection = document.querySelector('section.py-20.relative.overflow-hidden');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    const wavingElements = document.querySelectorAll('.animate-waving');
    wavingElements.forEach(el => {
        el.style.animation = 'wave 3s ease-in-out infinite';
    });

    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    const typewriterTextElement = document.getElementById('typewriter-text');
    const textToType = "Explore the Materials of IoT";

    if (typewriterTextElement) {
        let charIndex = 0;
        typewriterTextElement.textContent = '';

        function typeWriter() {
            if (charIndex < textToType.length) {
                typewriterTextElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 70);
            } else {
                typewriterTextElement.style.borderRight = '.15em solid var(--tw-colors-neon-blue)';
                typewriterTextElement.style.animation = 'blink-caret .75s step-end infinite';
            }
        }
        typeWriter();
    }

    // Scroll-triggered Fade-in-up animation
    const faders = document.querySelectorAll('.fade-in-up');
    const appearOptions = {
        threshold: 0.1, /* Element is 10% in view */
        rootMargin: "0px 0px -50px 0px" /* Helps trigger a bit earlier */
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Re-observe all faders after new content might have been added
    function observeAllFaders() {
        document.querySelectorAll('.fade-in-up').forEach(fader => {
            // Only observe if not already observed/animated
            if (!fader.classList.contains('animate-in')) {
                appearOnScroll.observe(fader);
            }
        });
    }

    // Initial observation and fetch
    fetchFolderName();
    fetchDriveItems().then(() => {
        observeAllFaders(); // After fetching and adding new elements, observe them for animations
    });

    // Initialize developer tools detection
    detectDevTools();
});
