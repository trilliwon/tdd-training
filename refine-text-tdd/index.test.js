const { expect, test } = require("@jest/globals");
const faker = require("faker");
const { describe } = require("yargs");
const sut = require("./index");

test.each`
    source                | expected
    ${"hello  world"}     | ${"hello world"}
    ${"hello   world"}    | ${"hello world"}
    ${"hello    world"}   | ${"hello world"}
    ${"hello     world"}  | ${"hello world"}
    ${"hello      world"} | ${"hello world"}
`('sut transforms "$source" to "$expected"', ({ source, expected }) => {
    const actual = sut(source);
    expect(actual).toBe(expected);
});

test.each`
    source             | expected
    ${"hello\t world"} | ${"hello world"}
`(
    'sut transforms "$source" that contains tab char to "$expected"',
    ({ source, expected }) => {
        const actual = sut(source);
        expect(actual).toBe(expected);
    }
);

test.each`
    source             | bannedWords              | expected
    ${"hello mockist"} | ${["mockist", "purist"]} | ${"hello *******"}
`(
    'sut transforms "$source" to "$expected"',
    ({ source, bannedWords, expected }) => {
        const actual = sut(source, { bannedWords });
        expect(actual).toBe(expected);
    }
);

describe("given banned word", "");

const bannedWord = faker.lorem.word();
    const source = "hello " + bannedWord;
    const expected = "hello " + "*".repeat(bannedWord.length);

    test("${bannedWord} when invoke sut then it returns ${expected}", () => {
        const actual = sut(source, { bannedWords: [bannedWord] });
        expect(actual).toBe(expected);
    });
