import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/ecommerce-coderhouse');
    } catch (error) {
        console.log('Error:', error);
        process.exit(1);
    }
};

export default connectDB;
