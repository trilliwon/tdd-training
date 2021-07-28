import {
    assert,
    assertEquals,
    assertNotEquals,
} from "https://deno.land/std@0.101.0/testing/asserts.ts";

console.log("TDD");

interface Expression {
    reduce(to: string): Money;
}

class Sum implements Expression {
    augend: Money;
    addend: Money;
    constructor(augend: Money, addend: Money) {
        this.augend = augend;
        this.addend = addend;
    }

    reduce(to: string): Money {
        const amount = this.augend.amount + this.addend.amount;
        return new Money(amount, to);
    }
}

class Bank {
    reduce(source: Expression, to: string): Money {
        return source.reduce(to);
    }
}

class Money implements Expression {
    amount: number;
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

    reduce(to: string): Money {
        return this;
    }

    times(multiplier: number): Money {
        return new Money(this.amount * multiplier, this.currency);
    }

    plus(addend: Money): Expression {
        return new Sum(this, addend);
    }
}

Deno.test("Reduce Money", () => {
    const bank = new Bank();
    const result = bank.reduce(Money.dollar(1), "USD");
    assertEquals(Money.dollar(1), result);
});

Deno.test("Reduce Sum", () => {
    const sum: Expression = new Sum(Money.dollar(3), Money.dollar(4));
    const bank: Bank = new Bank();
    const result = bank.reduce(sum, "USD");
    assertEquals(Money.dollar(7), result);
});

Deno.test("Plus Returns Sum", () => {
    const five: Money = Money.dollar(5);
    const result: Expression = five.plus(five);
    const sum: Sum = result as Sum;
    assertEquals(five, sum.augend);
    assertEquals(five, sum.addend);
});

Deno.test("simple addition", () => {
    const five: Money = Money.dollar(5);
    const sum: Expression = five.plus(five);
    const bank: Bank = new Bank();
    const reduced: Money = bank.reduce(sum, "USD");
    assertEquals(Money.dollar(10), reduced);
});

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

Deno.test("Currency", () => {
    assertEquals("USD", Money.dollar(1).currency);
    assertEquals("CHF", Money.franc(1).currency);
});
