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
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshTokens: [{
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
    timestamps: true
});

// hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {

    }
});

// compare password method
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


// Ensure virtual fields are serailized
userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        return ret;
    }
});

export default mongoose.model('User', userSchema)