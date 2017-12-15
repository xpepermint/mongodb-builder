"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var fs = require("mz/fs");
var Seeder = (function () {
    function Seeder(cfg) {
        if (cfg === void 0) { cfg = {}; }
        this.recipes = [];
        this.cfg = cfg;
    }
    Seeder.prototype.add = function (recipe) {
        this.recipes.push(recipe);
    };
    Seeder.prototype.addDir = function (dirPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var fileNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fs.readdir(dirPath)];
                    case 1:
                        fileNames = _a.sent();
                        fileNames.forEach(function (fileName) {
                            var recipe;
                            try {
                                recipe = require(path.join(dirPath, fileName));
                            }
                            catch (e) { }
                            var isValid = (!!recipe
                                && typeof recipe.perform !== 'undefined');
                            if (isValid) {
                                _this.add(recipe);
                            }
                        });
                        return [2];
                }
            });
        });
    };
    Seeder.prototype.remove = function (index) {
        return this.recipes.splice(index, 1);
    };
    Seeder.prototype.perform = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastIndex, i, recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastIndex = -1;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.recipes.length)) return [3, 5];
                        recipe = this.recipes[i];
                        if (!recipe.perform) return [3, 3];
                        return [4, recipe.perform(this.cfg.ctx)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        lastIndex = i;
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 1];
                    case 5: return [2, lastIndex];
                }
            });
        });
    };
    return Seeder;
}());
exports.Seeder = Seeder;
//# sourceMappingURL=seeding.js.map