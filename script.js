//Option 5: Hello Message 
window.addEventListener('load', () => {
    // Basic blocking alert to greet the user
    alert("Welcome to my interactive portfolio!");
    //to integrate the API 
    getGithubRepos();
});


//Option 3: Dark Theme 
const themeToggle = document.getElementById('theme-toggle');

//We first check if there's elements
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // we toggle between the "light" and "dark" modes 
        document.body.classList.toggle('dark-mode');
    });
}

//To toggle the skills, projects, and certifications appaearing 
const setupToggle = (buttonId, contentId) => {
    const btn = document.getElementById(buttonId);
    const content = document.getElementById(contentId);

    //This is just to ensure elements exist before attaching listeners
    if (btn && content) {
        btn.addEventListener('click', () => {
            //We toggle to the class "hidden" that displays "none"
            content.classList.toggle('hidden');
        });
    }
};

//This is to map buttons to their correct content containers
setupToggle('toggle-projects-btn', 'projects-content');
setupToggle('toggle-certs-btn', 'certs-content');
setupToggle('toggle-skills-btn', 'skills-content');


//Add skills option 
//element pointers for skill management
const addSkillBtn= document.getElementById('add-skill-btn');
const skillInput= document.getElementById('new-skill-input');
const skillsList= document.getElementById('skills-list');

//function to add a new skill 
const addNewSkill = () => {
    // .trim() removes extra whitespaces
    const val = skillInput.value.trim();

    if (val) {
        //we create a new span element in memory
        const span= document.createElement('span');
        
        //We assign the input text to the span
        span.textContent= val;
        
        //We append the new child node to the parent container
 	//to make sure to add this skill to the skills container 
        skillsList.appendChild(span);
        
        //We empty the input buffer for the next entry
        skillInput.value = "";
    }
};

//We will handle the click on the "Add skill" button and the click on enter 
if (addSkillBtn && skillInput) {
    //Button handling
    addSkillBtn.addEventListener('click', addNewSkill);
    
    //keyboard 'Enter'press
    skillInput.addEventListener('keypress', (e) => {
        // ASCII check for Enter key
        if (e.key === 'Enter') {
            addNewSkill();
        }
    });
}


//Form Option 
const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

//if the form is there 
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        //we prevent the browser from refreshing the page
        e.preventDefault();

        //We add 'submitted' class to trigger CSS invalid styles (Red borders)
        contactForm.classList.add('submitted');

       //checkValidity() checks if all required fields match their type and required attributes 
        if (!contactForm.checkValidity()) {
            //visual feedback for the user
            feedback.textContent = "Required information is missing or invalid.";
            feedback.style.color = "red";
        } else {
            //If successful, we retrieve the values and simulate submission
            const nameInput = document.getElementById('name');
            const userName = nameInput ? nameInput.value.trim() : "Guest";
            
            //Success message 
            feedback.textContent = `Message sent successfully! Thank you, ${userName}.`;
            feedback.style.color = "green";
            
            //To reset 
            contactForm.classList.remove('submitted');
            contactForm.reset();

            //timer to lear success message after 5 seconds
            setTimeout(() => {
                feedback.textContent = "";
            }, 5000);
        }
    });

	//input listener to see of we got any input 
    contactForm.addEventListener('input', () => {
        feedback.textContent = "";
    });
}

/**
 *This is the part I added for assignment 3 (API integration) 
 */

async function getGithubRepos() {
    const container= document.getElementById('projects-content');
    
    //Handling Loading State
    container.innerHTML= '<p style="padding: 20px; text-align: center; width: 100%;">Loading my latest GitHub projects...</p>';

    //to actually show the projects 
    try {
        const username= "SaraHossameldin";  
        const response= await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        //Handling Errors
        if (!response.ok) {
            throw new Error(`Failed to fetch repositories (Status: ${response.status})`);
        }

        const repos= await response.json();

        //to dynamically update the DOM
        container.innerHTML= ''; 

       //if there are no repos 
        if (repos.length=== 0) {
            container.innerHTML= '<p>No public repositories found.</p>';
            return;
        }

        //otherwise, 
        repos.forEach(repo => {
            
            //if the repo is empty, I won't display it 
	    if (repo.size==0) return; 

	    //I skipped the repo for this project 
            if (repo.name.toLowerCase()=== 'portfolio') return;

            //To get the name of teh project 
            let displayName= repo.name;
            //To dislay the project info and to add it to the list. 

            const projectItem= `
                <div class="p-item">
                    <div class="p-info">
                        <h4>${displayName}</h4>
                        <p>${repo.description || 'Professional project repository.'}</p>
                        <p><small>${repo.language || 'Multi-language'} | ⭐ ${repo.stargazers_count}</small></p>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="highlight" style="font-size: 0.7rem;">View Source</a>
                </div>
            `;
            container.innerHTML+= projectItem;
        });

    } catch (error) {
        //To handling Error Display
        console.error("API Error:", error);
        container.innerHTML = `<p style="color: #ff4d4d; padding: 20px;">Error: ${error.message}. Please check your internet connection or username.</p>`;
    }
}
