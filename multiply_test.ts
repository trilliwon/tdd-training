import {
    assert,
    assertEquals,
    assertNotEquals,
} from "https://deno.land/std@0.101.0/testing/asserts.ts";

console.log("TDD");

class Money {
    protected amount: number;
    currency: string;
    constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
    }

    equals(object: Money): boolean {
        const money = object as Money;
        if (typeof this === typeof object) {
            return this.amount === money.amount;
        }
        return false;
    }

    static dollar(amount: number): Money {
        return new Money(amount, "USD");
    }

    static franc(amount: number): Money {
        return new Money(amount, "CHF");
    }

    times(multiplier: number): Money {
        return new Money(this.amount * multiplier, this.currency);
    }
}

Deno.test("multiplication", () => {
    const five: Money = Money.dollar(5);
    assertEquals(Money.dollar(10), five.times(2));
    assertEquals(Money.dollar(15), five.times(3));
});

Deno.test("equality", () => {
    assertEquals(Money.dollar(5), Money.dollar(5));
    assertNotEquals(Money.dollar(5), Money.dollar(6));
    assertNotEquals(Money.franc(5), Money.dollar(5));
});

Deno.test("Franc Multiplication", () => {
    const five = Money.franc(5);
    assertEquals(Money.franc(10), five.times(2));
    assertEquals(Money.franc(15), five.times(3));
});

Deno.test("test Currency", () => {
    assertEquals("USD", Money.dollar(1).currency);
    assertEquals("CHF", Money.franc(1).currency);
});