const { firestore } = require('./admin');
// Test function to write to the database
const writeTestData = async () => {
    try {
        const dbRef = firestore.collection('users').doc('testUser');
        await dbRef.set({
            username: "testUsers",
            email: "test@example.com"
        });
        console.log('Data written successfully!');
    } catch (error) {
        console.error('Error writing data:', error);
    }
};

writeTestData();