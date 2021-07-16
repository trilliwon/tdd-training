import {
    assert,
    assertEquals,
    assertNotEquals,
} from "https://deno.land/std@0.101.0/testing/asserts.ts";

console.log("TDD");

class Money {
    protected amount: number;
    constructor(amount: number) {
        this.amount = amount;
    }

    equals(object: Money): boolean {
        const money = object as Money;
        if (typeof this === typeof object) {
            return this.amount === money.amount;
        }
        return false;
    }

    static dollar(amount: int): Dollar {

    }
}

class Dollar extends Money {
    constructor(amount: number) {
        super(amount);
    }

    times(multiplier: number): Dollar {
        return new Dollar(this.amount * multiplier);
    }
}

class Franc extends Money {
    constructor(amount: number) {
        super(amount);
    }

    times(multiplier: number): Franc {
        return new Franc(this.amount * multiplier);
    }
}

Deno.test("multiplication", () => {
    const five = new Dollar(5);
    assertEquals(new Dollar(10), five.times(2));
    assertEquals(new Dollar(15), five.times(3));
});

Deno.test("equality", () => {
    assertEquals(new Dollar(5), new Dollar(5));
    assertNotEquals(new Dollar(5), new Dollar(6));
    assertEquals(new Franc(5), new Franc(5));
    assert(!new Franc(5).equals(new Franc(6)));
    assert(new Franc(5) !== new Dollar(5));
});

Deno.test("Franc Multiplication", () => {
    const five = new Franc(5);
    assertEquals(new Franc(10), five.times(2));
    assertEquals(new Franc(15), five.times(3));
});

console.log(new Dollar(5) == new Dollar(5))