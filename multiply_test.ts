import {
    assert,
    assertEquals,
    assertNotEquals,
} from "https://deno.land/std@0.101.0/testing/asserts.ts";

console.log("TDD");

class Money {
    protected amount: number;
    private currency: string;
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
        return new Dollar(amount, "USD");
    }

    static franc(amount: number): Money {
        return new Franc(amount, "CHF");
    }

}

class Dollar extends Money {
    constructor(amount: number, currency: string) {
        super(amount, currency);
    }

    times(multiplier: number): Money {
        return Money.dollar(this.amount * multiplier);
    }
}

class Franc extends Money {
    constructor(amount: number, currency: string) {
        super(amount, currency);
    }

    times(multiplier: number): Money {
        return Money.franc(this.amount * multiplier);
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
    assertEquals(Money.franc(5), Money.franc(5));
    assert(!Money.franc(5).equals(Money.franc(6)));
    assert(Money.franc(5) !== Money.dollar(5));
});

Deno.test("Franc Multiplication", () => {
    const five = Money.franc(5);
    assertEquals(Money.franc(10), five.times(2));
    assertEquals(Money.franc(15), five.times(3));
});

Deno.test("test Currency", () => {
    assertEquals("USD", Money.dollar(1).currency());
    assertEquals("CHF", Money.franc(1).currency());
});
