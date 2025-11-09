import { GoogleGenAI, Chat, Type, Content } from "@google/genai";
import { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

let chat: Chat | null = null;

const initializeChat = (history: ChatMessage[]): Chat => {
    const contents: Content[] = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history: contents,
        config: {
            systemInstruction: 'You are a philosophical AI. A user wants to discuss what it means to be human. Start a concise, engaging conversation with them with a thought-provoking question about humanity.',
        },
    });
};

export const getChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    try {
        // Re-initialize chat with full history to maintain context
        chat = initializeChat(history);
        
        const result = await chat.sendMessage({ message: newMessage });
        return result.text;
    } catch (error) {
        console.error("Error getting chat response from Gemini:", error);
        return "An error occurred while connecting to the AI. Please try again.";
    }
};

const gridToString = (grid: boolean[][]): string => {
    return grid.map(row => row.map(cell => (cell ? 'X' : 'O')).join(' ')).join('\n');
};

export const solvePuzzle = async (grid: boolean[][]): Promise<{ row: number, col: number }[]> => {
    try {
        const prompt = `
You are a logic puzzle expert. The puzzle is a ${grid.length}x${grid[0].length} grid of lights.
The goal is to turn all lights ON ('X').
When you press a light, that light and its direct neighbors (up, down, left, right) flip their state (ON to OFF, OFF to ON).
This is the current state of the grid ('X' means ON, 'O' means OFF):
---
${gridToString(grid)}
---
Provide the sequence of clicks (row, column) required to solve the puzzle.
Return your answer ONLY as a JSON array of coordinate objects, like [{"row": r1, "col": c1}, {"row": r2, "col": c2}].
The coordinates are 0-indexed. If the puzzle is already solved, return an empty array.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            row: { type: Type.INTEGER },
                            col: { type: Type.INTEGER },
                        },
                        required: ['row', 'col'],
                    },
                },
            },
        });

        let jsonStr = response.text.trim();
        // The model might return the JSON string within a markdown code block.
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }
        
        const solution = JSON.parse(jsonStr);
        return solution;

    } catch (error) {
        console.error("Error solving puzzle with Gemini:", error);
        return [];
    }
};
