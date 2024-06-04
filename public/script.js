document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const contactButton = document.getElementById('contact-button');

    // Event listener for form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            formMessage.innerText = 'Your message has been successfully submitted!';
            formMessage.style.color = 'green';
            contactForm.reset();
        } else {
            formMessage.innerText = 'There was an error submitting your message. Please try again later.';
            formMessage.style.color = 'red';
        }
    });

    // Fetch and display recent repositories from GitHub API
    fetch('/repositories')
        .then(response => response.json())
        .then(repos => {
            const repoList = document.getElementById('repo-list');
            repos.forEach(repo => {
                const repoElement = document.createElement('div');
                const description = repo.description ? repo.description : 'No description';
                repoElement.innerHTML = `<h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3><p>${description}</p>`;
                repoList.appendChild(repoElement);
            });
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
        });

    // Smooth scroll to contact section when contact button is clicked
    contactButton.addEventListener('click', function () {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
});
