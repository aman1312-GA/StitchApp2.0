// database connection configuration
import mongoose from 'mongoose';

export const connectDB = async () => {

    try {
        // MongoDB connection options
        const options = {
            useNewUrlParser: true,
            userUnifiedTopology: true,
            maxPoolSize: 10, // mantain upto 10 socket connection
            serverSelectionTimeoutMS: 5000, // keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inavtivity
            family: 4, // use IPv4
            bufferCommands: false, // disable mongoose buffering
            bufferMaxEntries: 0 // disable mongoose buffering
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        })

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('👋 MongoDB connection closed due to app termination');
            process.exit(0);
        })

        return conn;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
}


// Check if database is connected
export const isConnected = () => {
    return mongoose.connection.redayState === 1;
}

// Get connection status
export const getConnectionStatus = () => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
    return states[mongoose.connection.readyState]
}
