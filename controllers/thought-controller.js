const { User, Thought } = require('../models');

const thoughtController = {
    // get all thoughts /api/thoughts
    getAllThoughts (req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // get a single thought by id /api/thoughts/:id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thoughts by this id.'});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // post to create a new thought, with new thought added to user's thought array field /api/thoughts
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId},
                    { $push: { thoughts: _id } },
                    { new: true, runValidators: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found by this id.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    // put to update a thought by id /api/thoughts/:id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found by this id.' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    // delete a thought by id /api/thoughts/:id
    deleteThought({ params}, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought found by this id.' });
                    //return;
                }
                return User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                )
            })
            .catch(err => res.status(400).json(err));
    },
    // REACTION-RELATED ROUTES //

    // post to create a reaction store in a single thought's reactions array field
    newReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found by that id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    // delete to remove a reaction by reactionID
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found by that id.' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = thoughtController;