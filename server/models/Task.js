const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 100
    },
    description: { 
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
        required: true
    },
    deadline: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value > Date.now(); // Deadline should be in the future
            },
            message: 'Deadline must be in the future'
        }
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Task", taskSchema);
