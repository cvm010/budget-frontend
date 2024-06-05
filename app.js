document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    // Function to fetch user data from backend
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:8080/users');
            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    // Function to group users by category
    function groupByCategory(users) {
        return users.reduce((acc, user) => {
            if (!acc[user.category]) {
                acc[user.category] = [];
            }
            acc[user.category].push(user);
            return acc;
        }, {});
    }

    // Function to render user boxes by category
    function renderUsersByCategory(groupedUsers) {
        Object.keys(groupedUsers).forEach(category => {
            const categoryBox = document.createElement('div');
            categoryBox.className = 'category-box';
            categoryBox.innerHTML = `
                <div class="category box">${category}</div>
                <div class="details hidden">
                    ${groupedUsers[category].map(user => `
                        <div class="user-detail">
                            <p>Username: ${user.username}</p>
                            <p>Date: ${user.date}</p>
                            <p>Time: ${user.time}</p>
                            <p>Payee: ${user.payee}</p>
                            <p>Amount: ${user.amount}</p>
                            <p>Moneyflow: ${user.moneyflow}</p>
                            <p>Category: ${user.category}</p>
                        </div>
                    `).join('')}
                </div>
            `;

            // Add click event listener to toggle box expansion
            categoryBox.addEventListener('click', () => {
                categoryBox.classList.toggle('expanded');
                categoryBox.querySelector('.details').classList.toggle('hidden');
            });

            app.appendChild(categoryBox);
        });
    }

    // Fetch users and render them on page load
    fetchUsers().then(users => {
        const groupedUsers = groupByCategory(users);
        renderUsersByCategory(groupedUsers);
    });
});
