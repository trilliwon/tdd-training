import {
    assert,
    assertEquals,
    assertNotEquals,
} from "https://deno.land/std@0.101.0/testing/asserts.ts";

console.log("TDD");

interface Expression {
    plus(addend: Expression): Expression;
    reduce(bank: Bank, to: string): Money;
    times(multiplier: number): Expression;
}

class Sum implements Expression {
    augend: Expression;
    addend: Expression;
    constructor(augend: Expression, addend: Expression) {
        this.augend = augend;
        this.addend = addend;
    }

    reduce(bank: Bank, to: string): Money {
        const amount =
            this.augend.reduce(bank, to).amount +
            this.addend.reduce(bank, to).amount;
        return new Money(amount, to);
    }

    plus(addend: Expression): Expression {
        return new Sum(this, addend);
    }

    times(multiplier: number): Expression {
        return new Sum(
            this.augend.times(multiplier),
            this.addend.times(multiplier)
        );
    }
}

class Bank {
    private rates = new Map();
    reduce(source: Expression, to: string): Money {
        return source.reduce(this, to);
    }

    rate(from: string, to: string): number {
        if (from === to) return 1;
        const rate = this.rates.get(from + to);
        return rate;
    }

    addRate(from: string, to: string, rate: number) {
        this.rates.set(from + to, rate);
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

    reduce(bank: Bank, to: string): Money {
        const rate = bank.rate(this.currency, to);
        return new Money(this.amount / rate, to);
    }

    times(multiplier: number): Expression {
        return new Money(this.amount * multiplier, this.currency);
    }

    plus(addend: Expression): Expression {
        return new Sum(this, addend);
    }
}

Deno.test("Sum Times", () => {
    const fiveBucks: Expression = Money.dollar(5);
    const tenFrancs: Expression = Money.franc(10);
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const sum: Expression = new Sum(fiveBucks, tenFrancs).times(2);
    const result = bank.reduce(sum, "USD");
    assertEquals(Money.dollar(20), result);
});

Deno.test("Sum Plus Money", () => {
    const fiveBucks: Expression = Money.dollar(5);
    const tenFrancs: Expression = Money.franc(10);
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const sum: Expression = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);
    const result = bank.reduce(sum, "USD");
    assertEquals(Money.dollar(15), result);
});

Deno.test("Identity Rate", () => {
    assertEquals(1, new Bank().rate("USD", "USD"));
});

Deno.test("object as map key", () => {
    const rates = new Map();
    const key = "USD" + "CHF";
    rates.set(key, 1);
    const key1 = "USD" + "CHF";
    assertEquals(rates.get(key1), 1);
});

Deno.test("Mixed Addition", () => {
    const fiveBucks: Expression = Money.dollar(5);
    const tenFrancs: Expression = Money.franc(10);
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const result = bank.reduce(fiveBucks.plus(tenFrancs), "USD");
    assertEquals(Money.dollar(10), result);
});

Deno.test("Reduce Money Different Currency", () => {
    const bank = new Bank();
    bank.addRate("CHF", "USD", 2);
    const result = bank.reduce(Money.franc(2), "USD");
    assertEquals(Money.dollar(1), result);
});

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
