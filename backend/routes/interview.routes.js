const express = require("express");
const interviewRouter = express.Router();
const User = require("../models/User.model");
const Interview = require("../models/Interview.model");
const Feedback = require("../models/Feedback.model");
const { OpenAI } = require("openai");
const apiKey = process.env.API_KEY;
const openai = new OpenAI({ apiKey: apiKey });
const auth = require("../middlewares/auth.middleware");
const video = require("../middlewares/video.middleware");
const startingPrompts = {
    MERN: `You will serve as an interviewer and I will be the interviewee candidate. You have to assess the interviewee's coding, conceptual skills related to the JD provided. Your task is to prepare a series of questions related to the job requirements and skills listed by the interviewee. Please ask each question one-by-one and wait for the interviewee to answer before providing feedback and grading the answer. After the interview, create a comprehensive report identifying areas of improvement, strengths, and an overall grade from 0 to 10.
  
    Please ensure that each question pertains to the job's requirements and the interviewee's skills and expertise.Stop the interview when the I say "stop the interview" and give a detailed feedback in form of an object, following this schema(except the interview key) :const feedbackSchema = new mongoose.Schema({
      interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }, // Reference to the Interview model
      strengths: [{ type: String }], // Array of strengths observed during the interview
      improvementAreas: [{ type: String }], // Areas for improvement noted during the interview
      overallScore: { type: Number }, // Overall score of the interview
    });
    
    Please refer to the job description (JD) and the candidate's provided skills and expertise when developing your questions.
    
    JD: MERN, MongoDB, Express, React and Node (Junior)
    
    Skills: Express, React, Node.
    
    Just ask one question at a time and wait for me to give the answer(If I give a completely wrong or mostly wrong answer you will have to provide the correct answer as your response as well as the next question). Do not give all the questions at once.  Ask the questions one by one.Greet the user first before going on to the first question`,
    Java: `You will serve as an interviewer and I will be the interviewee candidate. You have to assess the interviewee's coding, conceptual skills related to the JD provided. Your task is to prepare a series of questions related to the job requirements and skills listed by the interviewee. Please ask each question one-by-one and wait for the interviewee to answer before providing feedback and grading the answer. After the interview, create a comprehensive report identifying areas of improvement, strengths, and an overall grade from 0 to 10.
  
    Please ensure that each question pertains to the job's requirements and the interviewee's skills and expertise.Stop the interview when the I say "stop the interview" and give a detailed feedback in form of an object, following this schema(except the interview key) :const feedbackSchema = new mongoose.Schema({
      interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }, // Reference to the Interview model
      strengths: [{ type: String }], // Array of strengths observed during the interview
      improvementAreas: [{ type: String }], // Areas for improvement noted during the interview
      overallScore: { type: Number }, // Overall score of the interview
    });
    
    Please refer to the job description (JD) and the candidate's provided skills and expertise when developing your questions.
    
    JD: Java, SpringBoot
    
    Skills: Java, Spring Boot, Hybernate
    
    Just ask one question at a time and wait for me to give the answer(If I give a completely wrong or mostly wrong answer you will have to provide the correct answer as your response as well as the next question). Do not give all the questions at once.  Ask the questions one by one.Greet the user first before going on to the first question`,
    DSA: `You will serve as an interviewer and I will be the interviewee candidate. You have to assess the interviewee's coding, conceptual skills related to the JD provided. Your task is to prepare a series of questions related to the job requirements and skills listed by the interviewee. Please ask each question one-by-one and wait for the interviewee to answer before providing feedback and grading the answer. After the interview, create a comprehensive report identifying areas of improvement, strengths, and an overall grade from 0 to 10.
  
    Please ensure that each question pertains to the job's requirements and the interviewee's skills and expertise.Stop the interview when the I say "stop the interview" and give a detailed feedback in form of an object, following this schema(except the interview key) :const feedbackSchema = new mongoose.Schema({
      interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" }, // Reference to the Interview model
      strengths: [{ type: String }], // Array of strengths observed during the interview
      improvementAreas: [{ type: String }], // Areas for improvement noted during the interview
      overallScore: { type: Number }, // Overall score of the interview
    });
    
    Please refer to the job description (JD) and the candidate's provided skills and expertise when developing your questions.
    
    JD: Array, String, Two Pointer, Stack & Queues
    
    Skills: Problem solving skills
    
    Just ask one question at a time and wait for me to give the answer(If I give a completely wrong or mostly wrong answer you will have to provide the correct answer as your response as well as the next question).You will need to ask DSA questions to me.Do not give all the questions at once.  Ask the questions one by one.Greet the user first before going on to the first question`,
};
const endingPrompt = `stop the interview. And return the feedback object based on the your evaluation of the questions answered by me. You should only return the feedback object, not a single line or word more. the feedback object should follow this schema(except the interview key). Feedback Object Schema: {
    strengths: [{ type: String }],
    improvementAreas: [{ type: String }],
    overallScore: { type: Number },
  };
  Remember to only send the feedback object in and nothing else like a variable or something, you response should be something like "{"strengths:"["Good understanding of the concepts",...], "improvementAreas":["Could work on implementations",...],"overallScore":6.5}" , it should just be a strified object and nothing else.Don't even add symbols to your response in the end like ';' '.' etc, it should just be a a stringified JS object that I can perform JSON.parse on.
  `;

interviewRouter.use(auth);

interviewRouter.post("/interview/start", async (req, res) => {
    let { type } = req.body;
    try {
        const conversation = [{ role: "user", content: startingPrompts[type] }];
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversation,
        });
        const question = response.choices[0].message.content;
        const newInterview = new Interview({
            user: req.userId,
            interviewType: type,
            videoPath: null,
            conversation: [...conversation, { role: "assistant", content: question }],
            feedback: null,
        });
        await newInterview.save();
        res.status(200).json({ message: "Interview started successfully", newInterview, latest: question });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

interviewRouter.patch("/interview/:id", async (req, res) => {
    const { conversation } = req.body;
    const { id } = req.params;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversation,
        });
        const nextQuestion = response.choices[0].message.content;
        const newConvo = [
            ...conversation,
            { role: "assistant", content: nextQuestion },
        ];
        const updatedInterview = await Interview.findByIdAndUpdate(id, { conversation: newConvo }, { new: true });
        res.status(200).json({ message: "Updated Successfully", updatedInterview, latest: nextQuestion });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

interviewRouter.post("/interview/end/:id", video.single("videoPath"), async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    const { conversation } = req.body;
    const updatedConversation = JSON.parse(conversation);
    const videoPath = req.file ? req.file.path : null;
    console.log(videoPath);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                ...updatedConversation,
                { role: "user", content: endingPrompt },
            ],
        });
        const ans = response.choices[0].message.content;
        const feedback = JSON.parse(ans);
        const newFeedback = new Feedback({ ...feedback, interview: id });
        await newFeedback.save();
        const updatedInterview = await Interview.findByIdAndUpdate(id, {
            feedback: newFeedback._id,
            videoPath,
        });
        const loggedInUser = await User.findOne({ _id: userId });
        const updatedUser = await User.findByIdAndUpdate(userId, { pastInterviews: [...loggedInUser.pastInterviews, id] }, { new: true });

        res.status(200).json({ message: "Thank you for attempting this interview", updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

interviewRouter.get("/interview/:id", (req,res)=>{
    
});

module.exports = interviewRouter;
