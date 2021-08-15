const { Schema, model, Types } = require("mongoose");

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            // max of 280 characters
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // getter method to format timestamp on query
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
)

const ThoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: true,
            // length between 1 and 280 characters
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // getter method to format timestamp on query
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    // function to retrieve length of the reactions array field on query
});

const Though = model('Thought', ThoughtSchema);

module.exports = Thought;