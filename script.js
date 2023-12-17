document.addEventListener('DOMContentLoaded', function () {
    const mainContainer = document.getElementById('main-container');

    // Load existing link containers from local storage
    let savedLinks = JSON.parse(localStorage.getItem('links')) || [];

    // Display the existing link containers
    savedLinks.forEach((savedLink) => {
        const linkContainer = createLinkContainer(savedLink);
        mainContainer.appendChild(linkContainer);
    });

    // Sample link data
    const sampleLink = { heading: 'Title here', url: 'https://bibek10550.github.io/bibek/' };

    // Display the initial link container
    mainContainer.appendChild(createLinkContainer(sampleLink));

    // Create a new link container
    function createLinkContainer(link) {
        const linkContainer = document.createElement('div');
        linkContainer.classList.add('link-container');

        // Display the sample link
        linkContainer.appendChild(createLinkItem(link));

        // Create an open icon for the new link container with 90deg rotation
        const openIcon = createIcon('fa-solid fa-circle-plus open', 'open', 180);
        const copyIcon = createIcon('fa-regular fa-copy copy delayed', 'copy');
        linkContainer.appendChild(openIcon);
        linkContainer.appendChild(copyIcon);

        // Add event listener to the open icon
        openIcon.addEventListener('click', function () {
            // Create a new link container with functions
            const newLinkContainer = createLinkContainer({ heading: 'Title here', url: 'https://bibek10550.github.io/bibek/' });
            // Add the new link container at the beginning of the main container
            mainContainer.insertBefore(newLinkContainer, mainContainer.firstChild);
            // Save the updated links to local storage
            saveLinksToLocalStorage();
        });

        // Add event listener to the copy icon
        copyIcon.addEventListener('click', function () {
            copyToClipboard(link.url);
        });

        return linkContainer;
    }

    // Create a new link item
    function createLinkItem(link) {
        const linkItem = document.createElement('div');
        linkItem.classList.add('link-item');

        const headingElement = document.createElement('div');
        headingElement.classList.add('heading');
        headingElement.innerText = link.heading;
        linkItem.appendChild(headingElement);

        const linkElement = document.createElement('div');
        linkElement.classList.add('link');
        linkElement.innerText = link.url;
        linkElement.addEventListener('click', function (event) {
            // Prevent opening the link when editing
            if (!linkItem.classList.contains('editing')) {
                window.open(link.url, '_blank');
            }
            event.stopPropagation(); // Prevent event from bubbling up to the parent linkItem
        });
        linkItem.appendChild(linkElement);

        const editIcon = createIcon('fa-solid fa-pen-to-square edit', 'edit');
        const deleteIcon = createIcon('fa-solid fa-trash', 'delete');
        const openIcon = createIcon('fa-solid fa-circle-plus open', 'open', 180);
        const checkIcon = createIcon('fa-solid fa-check check', 'check');
        const copyIcon = createIcon('fa-regular fa-copy copy delayed', 'copy');

        linkItem.appendChild(editIcon);
        linkItem.appendChild(deleteIcon);
        linkItem.appendChild(openIcon);
        linkItem.appendChild(checkIcon);
        linkItem.appendChild(copyIcon);

        // Add event listener to the open icon
        openIcon.addEventListener('click', function () {
            // Create a new link container with functions
            const newLinkContainer = createLinkContainer({ heading: 'Title here', url: 'https://bibek10550.github.io/bibek/' });
            // Add the new link container at the beginning of the main container
            mainContainer.insertBefore(newLinkContainer, mainContainer.firstChild);
            // Save the updated links to local storage
            saveLinksToLocalStorage();
        });

        // Add event listener to the delete icon
        deleteIcon.addEventListener('click', function () {
            // Remove the link item's parent container (links-container)
            const linksContainer = linkItem.parentElement;
            linksContainer.remove();
            // Save the updated links to local storage
            saveLinksToLocalStorage();
        });

        // Add event listener to the edit icon
        editIcon.addEventListener('click', function () {
            // Hide the edit icon and show the check icon
            editIcon.style.display = 'none';
            checkIcon.style.display = 'inline';

            // Create heading input element
            const headingInput = document.createElement('input');
            headingInput.type = 'text';
            headingInput.classList.add('edit-heading');
            headingInput.value = link.heading;
            headingElement.innerHTML = '';
            headingElement.appendChild(headingInput);

            // Add a class to indicate that editing is in progress
            linkItem.classList.add('editing');

            // Focus on the heading input field and select the text
            headingInput.focus();
            headingInput.select();

            // Add keydown event listener for the heading input
            headingInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    // Prevent the default behavior of the Enter key (e.g., form submission)
                    event.preventDefault();

                    // Move the focus to the link input
                    linkInput.focus();
                    linkInput.select(); // Select the text in the link input field
                }
            });

            // Create link input element
            const linkInput = document.createElement('input');
            linkInput.type = 'text';
            linkInput.classList.add('edit-link');
            linkInput.value = link.url;
            linkElement.innerHTML = '';
            linkElement.appendChild(linkInput);

            // Add keydown event listener for the link input
            linkInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    // Prevent the default behavior of the Enter key (e.g., form submission)
                    event.preventDefault();

                    // Trigger click on the check icon
                    checkIcon.click();
                }
            });
        });

        // Add event listener to the check icon
        checkIcon.addEventListener('click', function () {
            // Update the link with the edited values
            const editedHeading = linkItem.querySelector('.edit-heading').value;
            const editedLink = linkItem.querySelector('.edit-link').value;
            // Save the edited values to the link object
            link.heading = editedHeading;
            link.url = editedLink;
            // Update the displayed values
            headingElement.innerText = editedHeading;
            linkElement.innerText = editedLink;
            // Show the edit icon and hide the check icon
            editIcon.style.display = 'inline';
            checkIcon.style.display = 'none';
            // Remove the editing class
            linkItem.classList.remove('editing');
            // Save the updated links to local storage
            saveLinksToLocalStorage();
            // Move the link container to the top
            const linksContainer = linkItem.parentElement;
            mainContainer.insertBefore(linksContainer, mainContainer.firstChild);

        });

        // Add event listener to the copy icon
        copyIcon.addEventListener('click', function () {
            // Set the font-weight to bolder
            copyIcon.style.fontWeight = 'bolder';

            // Copy to clipboard
            copyToClipboard(link.url);

            // Set a timeout to revert the font-weight back to normal after 3 seconds
            setTimeout(function () {
                copyIcon.style.fontWeight = 'normal';
            }, 3000);
        });

        return linkItem;
    }

    // Create an icon
    function createIcon(className, action, rotation = 0) {
        const icon = document.createElement('i');
        const classes = className.split(' ');
        icon.classList.add(...classes);
        icon.classList.add(action);
        icon.style.transform = `rotate(${rotation}deg)`; // Set the rotation
        return icon;
    }

    // Save the links to local storage
    function saveLinksToLocalStorage() {
        const linkContainers = document.querySelectorAll('.link-container');
        const links = Array.from(linkContainers).map(linkContainer => {
            const headingElement = linkContainer.querySelector('.heading');
            const linkElement = linkContainer.querySelector('.link');
            return { heading: headingElement.innerText, url: linkElement.innerText };
        });

        // Add a timestamp to each link to sort by the most recently edited
        links.forEach(link => {
            link.timestamp = Date.now();
        });

        // Sort the links by timestamp in descending order
        links.sort((a, b) => b.timestamp - a.timestamp);

        localStorage.setItem('links', JSON.stringify(links));
    }

    // to copy the text
    function copyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

});
