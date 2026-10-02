import test from "node:test";import assert from "node:assert/strict";
test("project metadata exists",async()=>{const p=await import("../package.json",{with:{type:"json"}});assert.equal(p.default.name,"animeverse")});
test("auth helpers export core functions",async()=>{const a=await import("../api/_lib/auth.js");assert.equal(typeof a.signUser,"function");assert.equal(typeof a.verifyPassword,"function")});
