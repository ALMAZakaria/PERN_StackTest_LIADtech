"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const server_1 = require("../config/server");
const logger_1 = __importDefault(require("../utils/logger"));
morgan_1.default.token('response-time-ms', (req, res) => {
    const responseTime = res.getHeader('X-Response-Time');
    return responseTime ? `${responseTime}ms` : '0ms';
});
const developmentFormat = ':method :url :status :res[content-length] - :response-time ms';
const productionFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';
exports.requestLogger = (0, morgan_1.default)(server_1.config.NODE_ENV === 'production' ? productionFormat : developmentFormat, {
    stream: {
        write: (message) => {
            logger_1.default.info(message.trim());
        },
    },
    skip: (req, res) => {
        if (server_1.config.NODE_ENV === 'production') {
            return req.url === '/health' || req.url === '/api/health';
        }
        return false;
    },
});
//# sourceMappingURL=logger.middleware.js.map