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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var globby = require("globby");
var Migrator = (function () {
    function Migrator(cfg) {
        this.recipes = [];
        this.cfg = cfg;
    }
    Migrator.prototype.add = function (recipe) {
        this.recipes.push(recipe);
    };
    Migrator.prototype.addDir = function (dir) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, globby([dir])];
                    case 1:
                        files = _a.sent();
                        files.sort().forEach(function (file) {
                            var recipe;
                            try {
                                recipe = require(file);
                            }
                            catch (e) { }
                            var isValid = (!!recipe
                                && typeof recipe.upgrade !== 'undefined'
                                && typeof recipe.downgrade !== 'undefined');
                            if (isValid) {
                                _this.add(recipe);
                            }
                        });
                        return [2];
                }
            });
        });
    };
    Migrator.prototype.remove = function (index) {
        return this.recipes.splice(index, 1);
    };
    Migrator.prototype.lastIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.cfg.collection.findOne({ kind: 0 })];
                    case 1:
                        doc = _a.sent();
                        return [2, doc ? doc.index : -1];
                }
            });
        });
    };
    Migrator.prototype.upgrade = function (steps) {
        if (steps === void 0) { steps = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var lastIndex, i, recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (steps === -1) {
                            steps = this.recipes.length;
                        }
                        return [4, this.lastIndex()];
                    case 1:
                        lastIndex = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.recipes.length)) return [3, 6];
                        recipe = this.recipes[i];
                        if (steps <= lastIndex) {
                            return [3, 6];
                        }
                        else if (lastIndex >= i) {
                            return [3, 5];
                        }
                        if (!recipe.upgrade) return [3, 5];
                        return [4, recipe.upgrade(this.cfg.context)];
                    case 3:
                        _a.sent();
                        lastIndex++;
                        return [4, this.cfg.collection.update({ kind: 0 }, { kind: 0, index: lastIndex }, { upsert: true })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3, 2];
                    case 6: return [2, lastIndex];
                }
            });
        });
    };
    Migrator.prototype.downgrade = function (steps) {
        if (steps === void 0) { steps = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var lastIndex, i, recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (steps === -1) {
                            steps = this.recipes.length;
                        }
                        return [4, this.lastIndex()];
                    case 1:
                        lastIndex = _a.sent();
                        i = this.recipes.length - 1;
                        _a.label = 2;
                    case 2:
                        if (!(i >= 0)) return [3, 6];
                        recipe = this.recipes[i];
                        if (steps <= this.recipes.length - 1 - i) {
                            return [3, 6];
                        }
                        if (i > lastIndex) {
                            return [3, 5];
                        }
                        if (!recipe.downgrade) return [3, 5];
                        return [4, recipe.downgrade(this.cfg.context)];
                    case 3:
                        _a.sent();
                        lastIndex--;
                        return [4, this.cfg.collection.update({ kind: 0 }, { kind: 0, index: lastIndex }, { upsert: true })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i--;
                        return [3, 2];
                    case 6: return [2, lastIndex];
                }
            });
        });
    };
    return Migrator;
}());
exports.Migrator = Migrator;
//# sourceMappingURL=migratings.js.map