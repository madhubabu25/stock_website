// Mock user investment data (You can later fetch this from your back-end)
const userInvestments = {
    balance: 0.00,
    shares: [] 
};

// Function to display investment data
function displayInvestmentData() {
    // Display user balance
    document.getElementById('user-balance').innerText = userInvestments.balance;

    // Check if user has shares
    const shareList = document.getElementById('share-list');
    const activityList = document.getElementById('user-activity');
    const noSharesMessage = document.getElementById('no-shares-message');

    if (userInvestments.shares.length === 0) {
        // Show message if no shares
        noSharesMessage.style.display = 'block';
        shareList.style.display = 'none';
        activityList.style.display = 'none';
        return;
    }

    // Hide "no shares" message if user has shares
    noSharesMessage.style.display = 'none';

    // Display shares
    shareList.style.display = 'block';
    userInvestments.shares.forEach(share => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${share.name}</strong> - ₹${share.price} (Quantity: ${share.quantity})`;
        shareList.appendChild(listItem);
    });

    // Display user activity (profit/loss)
    activityList.style.display = 'block';
    userInvestments.shares.forEach(share => {
        const activityItem = document.createElement('li');
        activityItem.innerText = `Profit/Loss from ${share.name}: ₹${share.profit}`;
        activityList.appendChild(activityItem);
    });
}

// Call function to display data
displayInvestmentData();
