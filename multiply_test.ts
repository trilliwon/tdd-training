import { assertEquals } from "https://deno.land/std@0.101.0/testing/asserts.ts";

console.log("TDD");

class Dollar {
    amount: number;
    constructor(amount: number) {
        this.amount = amount;
    }

    times(multiplier: number): Dollar {
        return new Dollar(this.amount * multiplier);
    }
}
Deno.test("multiplication", () => {
    const five = new Dollar(5);
    let product = five.times(2);
    assertEquals(10, product.amount);
    product = five.times(3);
    assertEquals(15, product.amount);
});
