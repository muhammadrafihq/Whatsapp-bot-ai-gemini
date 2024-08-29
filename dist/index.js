"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const generative_ai_1 = require("@google/generative-ai");
require("dotenv/config");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.API_KEY);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = 5000;
function mediaToGenerativePart(media) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            inlineData: { data: media.data, mimeType: media.mimetype },
        };
    });
}
const whatsappClient = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth(),
});
whatsappClient.on("qr", (qr) => {
    qrcode_terminal_1.default.generate(qr, { small: true });
    console.log("QR Code received, scan with your phone.");
});
whatsappClient.on("ready", () => {
    console.log("WhatsApp Web client is ready!");
});
whatsappClient.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const senderNumber = msg.from;
    const message = msg.body;
    console.log(`Received message from ${senderNumber}: ${message}`);
    let mediaPart = null;
    if (msg.hasMedia) {
        const media = yield msg.downloadMedia();
        mediaPart = yield mediaToGenerativePart(media);
    }
    yield run(message, senderNumber, mediaPart);
}));
whatsappClient.initialize();
let chat = null;
function run(message, senderNumber, mediaPart) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            if (!chat) {
                chat = model.startChat({
                    generationConfig: {
                        maxOutputTokens: 500,
                    },
                });
            }
            let prompt = [];
            prompt.push(message);
            if (mediaPart) {
                prompt.push(mediaPart);
            }
            const result = yield chat.sendMessage(prompt);
            const response = yield result.response;
            const text = response.text();
            if (text) {
                console.log("Generated Text:", text);
                yield sendWhatsAppMessage(text, senderNumber);
            }
            else {
                console.error("This problem is related to Model Limitations and API Rate Limits");
            }
        }
        catch (error) {
            console.error("Error in run function:", error);
            yield sendWhatsAppMessage("Oops, an error occurred. Please try again later.", senderNumber);
        }
    });
}
function sendWhatsAppMessage(text, toNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield whatsappClient.sendMessage(toNumber, text);
        }
        catch (err) {
            console.error("Failed to send WhatsApp message:");
            console.error("Error details:", err);
        }
    });
}
app.listen(port, () => console.log(`Express app running on port ${port}!`));
