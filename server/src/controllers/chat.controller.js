import { getRAGResponse, isUnsafeQuestion, getUnsafeResponse } from "../services/rag.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            res.status(400).json({
                success: false,
                message: "Message is required and must be a non-empty string.",
            });
            return;
        }

        const trimmedMessage = message.trim();

        if (isUnsafeQuestion(trimmedMessage)) {
            res.json({
                success: true,
                data: { message: getUnsafeResponse() },
            });
            return;
        }

        const answer = await getRAGResponse(trimmedMessage);

        res.json({
            success: true,
            data: { message: answer },
        });
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        next(error);
    }
};