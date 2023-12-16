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
        linkContainer.appendChild(openIcon);

        // Add event listener to the open icon
        openIcon.addEventListener('click', function () {
            // Create a new link container with functions
            const newLinkContainer = createLinkContainer({ heading: 'Title here', url: 'https://bibek10550.github.io/bibek/' });
            // Add the new link container at the beginning of the main container
            mainContainer.insertBefore(newLinkContainer, mainContainer.firstChild);

            // Save the updated links to local storage
            saveLinksToLocalStorage();
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

        linkItem.appendChild(editIcon);
        linkItem.appendChild(deleteIcon);
        linkItem.appendChild(openIcon);
        linkItem.appendChild(checkIcon);

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

            // Replace the heading and link with input fields for editing
            headingElement.innerHTML = `<input type="text" class="edit-heading" value="${link.heading}">`;
            linkElement.innerHTML = `<input type="text" class="edit-link" value="${link.url}">`;

            // Add a class to indicate that editing is in progress
            linkItem.classList.add('editing');
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

});
