import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    fullName: {
        type: String,
        required: true,
    },
    isVerified: { //   Indicates if user's email is veriffied
        type: Boolean,
        default: false
    },
    refreshTokens: [{ // arrays of objects to store refresh tokens for multiple
        token: String,
        deviceInfo: String, // Optional: track device info
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 30 * 24 * 60 * 60 // 30 days in seconds
        }
    }],
    lastLogin: Date
}, {
    timestamps: true // this automatically add two fields to each document createdAt and updatedAt
});

// hash password before saving. pre-save middleware function. It runs before a user document is saved or remmoved from the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //  optimization (prevent re-hashing)

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {

    }
});

// compare plain-text password during login and hashed password 
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new Error('Password comparison failed')
    }
};

// clean up expired refresh tokens
userSchema.methods.cleanExpiredTokens = function () {
    const now = new Date();
    this.refreshTokens = this.refreshTokens.filter(tokenObj =>
        tokenObj.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000 > now.getTime()
    );
};


// Ensure virtual fields are serailized.
// Modifies the behaviour of Moongose when you convert a user document to a JSON object(e.g When sending it in an API response)
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.password; // ensures user's password is never sent in an API response
        delete ret.refreshTokens; // it prevents the sensitive refresh tokens from being exposed.
        return ret; // ensures that any virtual fields (like full name) are included in the JSON output.
    }
});

export default mongoose.model('User', userSchema)