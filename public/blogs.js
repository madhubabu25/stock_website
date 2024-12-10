document.addEventListener('DOMContentLoaded', function () {
    const commentForm = document.getElementById('discussion-form');
    const commentsList = document.getElementById('comments-list');

    // Fetch and display comments
    async function loadComments() {
        try {
            const response = await fetch('/get-comments');
            const comments = await response.json();

            // Clear the comments list
            commentsList.innerHTML = '';

            // Add each comment to the list
            comments.forEach(comment => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p class="comment-header">${comment.username}</p>
                    <p class="comment-content">${comment.comment}</p>
                `;
                commentsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    // Handle comment submission
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const comment = document.getElementById('comment').value;

        try {
            const response = await fetch('/submit-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, comment }),
            });

            if (response.ok) {
                // Reset the form and reload comments
                alert('Your comment has been submitted!');
                commentForm.reset();
                loadComments(); // Refresh comments
            } else {
                alert('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    });

    // Initial load of comments
    loadComments();
});
