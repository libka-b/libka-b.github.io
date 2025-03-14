---
layout: layouts/article.html
title: 'Crafting Interpreters in Kotlin'
date: '2025-03-13'
---

Working as a software engineer, I was surprised how often there comes a need to interpret something and the code for that is a mini interpreter. But it makes sense, teams often work with data and need to evaluate them somehow and since the data is very specific to their domain, they need to use something very tailored. Last time this happened, I opened my copy of [Crafting Interpreters](https://craftinginterpreters.com/) this time for the third time and using third different language and determined that this time I would finally see it through. And this time I did and there were several fascinating concepts I learnt and want to highlight some of those.

<!-- excerpt -->

First of all, I want to express my gratitude to Robert Nystrom, author of the book. He really made this topic much more accessible without having to study it in university or reading massive books full of specialized concepts and university degree math.

Throughout the book, there were many places where I was like "wow that's cool" and if you're interested it's best to get the book. There were some, however, that I want to mention here as either they got me realize something that I didn't understand too much or I used them in my other projects.

Namely, I want to talk about [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern), exception as a mean to unwind stack, [foreign function interface](https://en.wikipedia.org/wiki/Foreign_function_interface) and scopes. Let's do it!

### Visitor pattern

Visitor pattern is extremely useful design pattern but I never had chance to implement it. It comes in handy in situations where you have self referencing heterogenous structures. Sounds complicated, but consider this example:

```kotlin
sealed interface Expression

data class Binary(val left: Expression, val right Expression, val operator: Operator) : Expression

data class Literal(val value: Any) : Expression
```

Now, the above example is quite simple but you can see how binary can nest itself deep if needed and if you start adding other operators such as logical operator, data retrievers etc... and handling the code naively, you'll end up doing something like this:

```kotlin
fun evaluate(expression: Expression) = when (expression) {
    is Binary -> expression.operator(evaluate(expression.left), evaluate(expression.right))
    is Literal -> expression.value
}
```

Adding more operators might quickly get out of hand, not only will it become hardly readable, it also performs poorly. The solution to that is visitor pattern:

```kotlin
interface Visitor<T> {
    fun visitBinary(binary: Expression): T
    fun visitLiteral(literal: Expression): T
}

sealed interface Expression {
    fun acceptVisitor(visitor: Visitor): Any
}

data class Binary(val left: Expression, val right Expression, val operator: Operator) : Expression {
    fun acceptVisitor(visitor: Visitor) = visitBinary(this)
}

data class Literal(val value: Any) : Expression {
    fun acceptVisitorLiteral(visitor: Visitor) = visitLiteral(this)
}

class EvaluatingVisitor : Visitor<Boolean> {
    fun evaluate(expression: Expression) = expression.acceptVisitor()
    fun visitBinary(binary: Expression) = binary.operator(binary.left.acceptVisitor(), binary.right.acceptVisitor())
    fun visitLiteral(literal: Expression) = literal.value
}
```

Now, at first glance this is much more code than in the first case but there are many benefits:
- Data and logic are decoupled and as simple as possible. This might not look right in these simple examples but when your `Expression` interface is implemented by 20 classes the difference will be huge. The logic is also separated into individual methods instead of having a single function that calls itself recursively.
- Another problem with the first approach is performance. Every time we evaluate an expression, we need to figure out its type and execute the corresponding code. In visitor this is elegantly solved by calling `acceptVisitor` on each non-terminating expression. This is not much of a win in interpreted languages such as Python, where it become just a map lookup but in compiled languages this is a real deal.
- Visitor pattern empowers us to implement additional logic on our data structure. For example, did you know how most of the linters are implemented? That's right. Visitor pattern.

### Exceptions as means to unwind stack

In chapter implementing functions, I was curious about how `return`s are implemented. Having single return at the end of a function is not a big deal but what about returns somewhere in the middle of a function? Consider this function:

```kotlin
fun foo(a: Int): Boolean {
    if (a < 5) return false
    return true
}
```

It's not so complicated to implement the last return, simply execute it and jump out of the block. But what about the return right after the `if`? At first, I was thinking you need some kind of go-to and I was kind of right. The way it's implemented is by throwing exception that wraps the return value (if any). This led me to realization that when implementing iterator in Python, you throw `StopIteration` exception to signal the interpreter that there's no more values to iterate. I now wonder if interpreters are full of exceptions like that to signal break, return and what not.

### Foreign Function Interface (FFI)

I'll stay a bit longer with the functions. It makes sense that some functions in a language are implemented in the language implementing the language. Looks like some kind of recursion here. Ok, consider you have an interpreter of language `A` written in language `B`. It makes sense, that some functions accessible in the interpreted language (`A`) are written using the language in which the interpreter is written (`B`). What struck me though, was that functions in interpreters actually have somme kind of interface which is used to run a function. This interface can also be leveraged to write a function in the interpreter's language.

This way, I finally understood what it means when people were talking about C-bindings for Python. You simply write a function in C and it runs much faster than the same function written in Python (unless you do some optimization hacks, like people comparing plain Fibonacci in C vs Fibonacci in Python with cache on the intermediate values claiming that Python is faster).

I definitely came across the FFI mentions in the past I just never devoted much time trying to read or understand it. Implementing it myself was the best way to actually do it.

### Scopes

Having lot of experience with Python, I did have a hunch that scopes are basically just maps holding values of variables. However, implementing it myself, I experienced all the nuances that it has to deal with and that a naive approach would quickly break. There's a fair share of complexity and considerations to take and I would recommend anyone interested in interpreters to read the book to see how it's done properly (although Robert took some decisions that I would disagree with but it's up to everyone's taste).

## Conclusion

Crafting interpreters is amazing book for language hobbyists like myself. There are many concepts to learn from and it's fun to implement your own language from scratch with zero third party dependencies.

If you want to take a look at my implementation, it can be found [here](https://github.com/libka-b/klox).
