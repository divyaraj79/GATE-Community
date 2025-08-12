const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/question-bank', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample Categories
const categories = [
    {
        name: 'Computer Science',
        slug: 'computer-science',
        description: 'Core computer science concepts including algorithms, data structures, and programming',
        icon: 'fas fa-laptop-code',
        color: '#007bff',
        order: 1
    },
    {
        name: 'Data Structures',
        slug: 'data-structures',
        description: 'Fundamental data structures like arrays, linked lists, trees, and graphs',
        icon: 'fas fa-sitemap',
        color: '#28a745',
        order: 2
    },
    {
        name: 'Algorithms',
        slug: 'algorithms',
        description: 'Algorithm design, analysis, and complexity theory',
        icon: 'fas fa-cogs',
        color: '#ffc107',
        order: 3
    },
    {
        name: 'Database Systems',
        slug: 'database-systems',
        description: 'Database design, SQL, normalization, and transaction management',
        icon: 'fas fa-database',
        color: '#17a2b8',
        order: 4
    },
    {
        name: 'Operating Systems',
        slug: 'operating-systems',
        description: 'Process management, memory management, and file systems',
        icon: 'fas fa-desktop',
        color: '#6f42c1',
        order: 5
    },
    {
        name: 'Computer Networks',
        slug: 'computer-networks',
        description: 'Network protocols, routing, and communication',
        icon: 'fas fa-network-wired',
        color: '#fd7e14',
        order: 6
    }
];

// Sample Users
const users = [
    {
        username: 'prof_smith',
        email: 'smith@university.edu',
        password: 'password123',
        firstName: 'Dr. John',
        lastName: 'Smith',
        institution: 'University of Technology',
        expertise: ['Algorithms', 'Data Structures', 'Computer Science'],
        role: 'teacher',
        isVerified: true,
        reputation: 150
    },
    {
        username: 'student_raj',
        email: 'raj@student.edu',
        password: 'password123',
        firstName: 'Raj',
        lastName: 'Kumar',
        institution: 'Engineering College',
        expertise: ['Programming', 'Web Development'],
        role: 'student',
        isVerified: true,
        reputation: 45
    },
    {
        username: 'expert_priya',
        email: 'priya@techcorp.com',
        password: 'password123',
        firstName: 'Priya',
        lastName: 'Sharma',
        institution: 'Tech Corporation',
        expertise: ['Database Systems', 'Software Engineering'],
        role: 'expert',
        isVerified: true,
        reputation: 200
    }
];

// Sample Questions
const questions = [
    {
        title: 'What is the time complexity of binary search?',
        content: 'Consider a sorted array of n elements. What is the time complexity of binary search algorithm in the worst case?',
        options: [
            { text: 'O(1)', isCorrect: false },
            { text: 'O(log n)', isCorrect: true },
            { text: 'O(n)', isCorrect: false },
            { text: 'O(n²)', isCorrect: false }
        ],
        explanation: 'Binary search has a time complexity of O(log n) because in each step, it divides the search space in half. This logarithmic behavior makes it very efficient for large datasets.',
        difficulty: 'Easy',
        tags: ['algorithms', 'binary-search', 'complexity'],
        year: 2023,
        marks: 1
    },
    {
        title: 'Which data structure is best for implementing a priority queue?',
        content: 'You need to implement a priority queue where elements can be inserted and the highest priority element can be removed efficiently. Which data structure would be most suitable?',
        options: [
            { text: 'Array', isCorrect: false },
            { text: 'Linked List', isCorrect: false },
            { text: 'Binary Heap', isCorrect: true },
            { text: 'Stack', isCorrect: false }
        ],
        explanation: 'Binary Heap is the best choice for implementing a priority queue because it provides O(log n) time complexity for both insertion and deletion of the highest priority element.',
        difficulty: 'Medium',
        tags: ['data-structures', 'priority-queue', 'binary-heap'],
        year: 2023,
        marks: 2
    },
    {
        title: 'What is the purpose of normalization in database design?',
        content: 'Database normalization is a process used to organize a database into tables and columns. What is the primary purpose of this process?',
        options: [
            { text: 'To increase database size', isCorrect: false },
            { text: 'To eliminate data redundancy and anomalies', isCorrect: true },
            { text: 'To make queries slower', isCorrect: false },
            { text: 'To reduce security', isFalse: false }
        ],
        explanation: 'Normalization eliminates data redundancy and anomalies (insertion, update, and deletion anomalies) by organizing data into well-structured tables with proper relationships.',
        difficulty: 'Medium',
        tags: ['database', 'normalization', 'design'],
        year: 2023,
        marks: 2
    },
    {
        title: 'What is a deadlock in operating systems?',
        content: 'In the context of operating systems, what is a deadlock and what are the necessary conditions for it to occur?',
        options: [
            { text: 'A process that runs indefinitely', isCorrect: false },
            { text: 'A situation where two or more processes are waiting for resources held by each other', isCorrect: true },
            { text: 'A process that consumes too much memory', isCorrect: false },
            { text: 'A system crash', isCorrect: false }
        ],
        explanation: 'A deadlock occurs when two or more processes are waiting for resources that are held by other processes in the system, creating a circular wait condition.',
        difficulty: 'Hard',
        tags: ['operating-systems', 'deadlock', 'processes'],
        year: 2023,
        marks: 3
    },
    {
        title: 'What is the difference between TCP and UDP?',
        content: 'Compare the Transmission Control Protocol (TCP) and User Datagram Protocol (UDP) in terms of reliability and performance.',
        options: [
            { text: 'TCP is faster but unreliable, UDP is slower but reliable', isCorrect: false },
            { text: 'TCP is reliable but slower, UDP is faster but unreliable', isCorrect: true },
            { text: 'Both protocols are equally reliable and fast', isCorrect: false },
            { text: 'TCP is for web browsing only, UDP is for gaming only', isCorrect: false }
        ],
        explanation: 'TCP provides reliable, ordered delivery of data but with higher overhead, while UDP offers faster transmission but without guarantees of delivery or order.',
        difficulty: 'Medium',
        tags: ['networks', 'tcp', 'udp', 'protocols'],
        year: 2023,
        marks: 2
    },
    {
        title: 'What is the time complexity of merge sort?',
        content: 'Given an array of n elements, what is the time complexity of merge sort algorithm in all cases (best, average, and worst)?',
        options: [
            { text: 'O(n log n) in all cases', isCorrect: true },
            { text: 'O(n) in best case, O(n log n) in average and worst cases', isCorrect: false },
            { text: 'O(n²) in all cases', isCorrect: false },
            { text: 'O(log n) in all cases', isCorrect: false }
        ],
        explanation: 'Merge sort has a consistent time complexity of O(n log n) in all cases because it always divides the array in half and then merges the sorted halves.',
        difficulty: 'Easy',
        tags: ['algorithms', 'merge-sort', 'complexity', 'sorting'],
        year: 2023,
        marks: 1
    }
];

// Sample Answers
const answers = [
    {
        content: 'Binary search has O(log n) time complexity because it divides the search space in half in each iteration. This makes it extremely efficient for large datasets compared to linear search.',
        isAccepted: true
    },
    {
        content: 'You can also think of it as: if you have n elements, you need at most log₂(n) comparisons to find any element, since 2^log₂(n) = n.',
        isAccepted: false
    },
    {
        content: 'Binary Heap is indeed the best choice. It provides O(log n) for both insert and extract operations, which is optimal for priority queue operations.',
        isAccepted: false
    },
    {
        content: 'Another advantage of Binary Heap is that it can be easily implemented using an array, making it memory efficient as well.',
        isAccepted: false
    },
    {
        content: 'Normalization helps in maintaining data integrity and consistency. It reduces the chance of data anomalies and makes the database more maintainable.',
        isAccepted: false
    },
    {
        content: 'The four necessary conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. All four must be present for a deadlock to occur.',
        isAccepted: false
    }
];

// Seed function
async function seedDatabase() {
    try {
        console.log('Starting database seeding...');
        
        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Question.deleteMany({});
        await Answer.deleteMany({});
        
        console.log('Cleared existing data');
        
        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`Created ${createdCategories.length} categories`);
        
        // Create users
        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);
        
        // Create questions with proper references
        const questionsWithRefs = questions.map((question, index) => ({
            ...question,
            category: createdCategories[index % createdCategories.length]._id,
            author: createdUsers[index % createdUsers.length]._id,
            isApproved: true
        }));
        
        const createdQuestions = await Question.insertMany(questionsWithRefs);
        console.log(`Created ${createdQuestions.length} questions`);
        
        // Create answers with proper references
        const answersWithRefs = answers.map((answer, index) => ({
            ...answer,
            question: createdQuestions[index % createdQuestions.length]._id,
            author: createdUsers[index % createdUsers.length]._id
        }));
        
        const createdAnswers = await Answer.insertMany(answersWithRefs);
        console.log(`Created ${createdAnswers.length} answers`);
        
        // Update category question counts
        for (const category of createdCategories) {
            await category.updateQuestionCount();
        }
        
        // Update user question counts
        for (const user of createdUsers) {
            const questionCount = await Question.countDocuments({ author: user._id });
            await User.findByIdAndUpdate(user._id, { questionsSubmitted: questionCount });
        }
        
        console.log('Database seeding completed successfully!');
        console.log('\nSample data created:');
        console.log(`- ${createdCategories.length} categories`);
        console.log(`- ${createdUsers.length} users`);
        console.log(`- ${createdQuestions.length} questions`);
        console.log(`- ${createdAnswers.length} answers`);
        console.log('\nYou can now run the application and see the sample data.');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run seeding
seedDatabase();
