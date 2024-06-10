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

    // Function to delete user data from backend
    async function deleteUser(userId) {
        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error deleting user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
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
            categoryBox.className = 'box';
            categoryBox.innerHTML = `
                <div class="category">${category}</div>
                <div class="details hidden">
                    ${groupedUsers[category].map(user => `
                        <div class="user-detail" data-user-id="${user.id}">
                            <p><strong>Username:</strong> ${user.userName}</p>
                            <p><strong>Date:</strong> ${user.date}</p>
                            <p><strong>Time:</strong> ${user.time}</p>
                            <p><strong>Payee:</strong> ${user.payee}</p>
                            <p><strong>Amount:</strong> ${user.amount}</p>
                            <p><strong>Moneyflow:</strong> ${user.moneyFlow}</p>
                            <p><strong>Category:</strong> ${user.category}</p>
                            <button class="delete-btn">🗑️</button>
                        </div>
                    `).join('')}
                </div>
            `;

            // Add click event listener to toggle box expansion and hiding other boxes
            categoryBox.addEventListener('click', (event) => {
                if (event.target.classList.contains('delete-btn')) {
                    event.stopPropagation();
                    const userDetail = event.target.closest('.user-detail');
                    const userId = userDetail.getAttribute('data-user-id');
                    deleteUser(userId).then(() => {
                        userDetail.remove();
                    });
                    return;
                }

                const currentlyExpanded = document.querySelector('.box.expanded');
                const otherBoxes = document.querySelectorAll('.box');
                if (currentlyExpanded && currentlyExpanded !== categoryBox) {
                    currentlyExpanded.classList.remove('expanded');
                    currentlyExpanded.querySelector('.details').classList.add('hidden');
                    otherBoxes.forEach(box => box.classList.remove('hidden'));
                } else if (!categoryBox.classList.contains('expanded')) {
                    otherBoxes.forEach(box => {
                        if (box !== categoryBox) {
                            box.classList.add('hidden');
                        }
                    });
                    categoryBox.classList.add('expanded');
                    categoryBox.querySelector('.details').classList.remove('hidden');
                } else {
                    categoryBox.classList.remove('expanded');
                    categoryBox.querySelector('.details').classList.add('hidden');
                    otherBoxes.forEach(box => box.classList.remove('hidden'));
                }
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
