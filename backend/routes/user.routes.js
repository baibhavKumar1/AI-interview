const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const User = require("../models/User.model");
const Interview = require("../models/Interview.model");
const Feedback = require("../models/Feedback.model");

router.use(auth);

router.get("/user/interview", async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId).populate({
            path: "pastInterviews",
            populate: { path: "feedback", model: "Feedback" },
        });
        const userInterviews = user.pastInterviews;
        res.status(200).json({ userInterviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch("/user/update/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password, bio } = req.body;
    try {
        let user = await User.findOne({ _id: id });
        if (user) {
            bcrypt.hash(password, 8, async (err, hash) => {
                const updatedUser = { username, password: hash, bio };
                console.log(updatedUser);
                await User.findByIdAndUpdate(id, updatedUser);
                res.status(200).json({ message: "User Details Updated Successfully", User: req.body });
            });
        } else {
            res.status(400).json({ message: "User Not Found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong while updating" });
    }
});

router.get("/user/leaderboard", async (req, res) => {
    try {
        const users = await User.find();
        const leaderBoardData = [];
        for (const user of users) {
            const pastInterviews = user.pastInterviews || [];
            let highestScore = 0;
            for (const interviewId of pastInterviews) {
                const interview = await Interview.findById(interviewId);
                if (interview) {
                    const feedback = await Feedback.findById(interview.feedback);
                    if (feedback && feedback.overallScore > highestScore) {
                        highestScore = feedback.overallScore;
                    }
                }
            }
            leaderBoardData.push({ userId: user._id, username: user.username, profileImage: user.profileImage, overallScore: highestScore });
        }
        leaderBoardData.sort((a, b) => b.overallScore - a.overallScore);
        const leaderBoardWithRank = leaderBoardData.map((entry, index) => ({ ...entry, rank: index + 1, }));
        res.status(200).json({ message: "Leaderboard created", leaderboard: leaderBoardWithRank });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
