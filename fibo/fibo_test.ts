import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";

// fib(0) = 0
// fib(1) = 1
// fib(n) = fib(n-1) + fib(n-2)

function fib(n: number): number {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fib(n - 1) + fib(n - 2);
}

Deno.test("Fibonacci", () => {
    const cases: number[][] = [
        [0, 0],
        [1, 1],
        [2, 1],
        [3, 2]
    ];
    for (let i = 0; i < cases.length; i++) {
        assertEquals(cases[i][1], fib(cases[i][0]));
    }
});
