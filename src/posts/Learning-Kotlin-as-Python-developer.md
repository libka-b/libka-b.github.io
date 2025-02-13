---
layout: layouts/article.html
title: 'Learning Kotlin as Python developer'
date: '2024-09-28'
---

After 7 years working as a Python developer, I started a new job working primarily with Kotlin. Here, I'll share the experience and some ways the two languages differ. Let's take a look.

<!-- excerpt -->

## Basics

For a Python developer, first things you'll notice working in Kotlin is that you have to use (mostly) brackets when defining functions. I actually like this as indentation might sometimes be confusing. Also, when someone starts working on existing codebase and have IDE preset to use tabs instead of space, this will create inconsistencies, but overall this is not a big deal. I say you have to use brackets mostly, as there is expression body syntax that looks like this:

```kotlin
fun sum(a: Int, b: Int) = a + b
```

Interesting part of syntax is that you can declare variables in two ways, using `val` or `var` keywords. The former creates immutable variable, such that you can't change it after declaration. The latter makes it mutable but most of the time working on large codebases the variables can be just immutable.

In Python, there's this `@dataclass` decorator marking class as data class and it would generate the constructor and `__eq__` and `__hash__` functions. Kotlin has similar concept:

```kotlin
data class Student(val name: String, var address: String)
```

Taking into account the mutability of parameters mentioned above, we can initialize the `Student` class and if we make the mutable variant of it, we can always mutate only the students address.

Having an option of adding a default value of a parameter is a cool feature in Python and guess what? Kotlin has that too.

One thing I am glad Kotlin doesn't have is Python's `**kwargs`. I spent a lot of time arguing with my colleagues not to use this feature in the production libraries as it only obscures whatever parameters are being passed (especially when it's being passed down through several function calls). If you're using typing, you probably want your code to be readable, right?

On the typing notion, when a return type in Python is nullable, we can annotate it as `Optional[T]`. In Kotlin, nullable type would be `T?`, where the `?` denotes nullability. The cool thing is Kotlin's Elvis operator `?:` (apparently it resembles Elvis' hair when you tilt your head) - imagine you have a function that accepts list of integers and returns sum of it or null if it's empty. You might be interested only in the integer values and throw error if the return value is null. Here's an example of how you would do that using the Elvis operator:

```kotlin
fun sumNonEmpty(integers: List<Int>): Int? = if (integers.isEmpty()) { null } else integers.sum()

val listOfIntegers: List<Int> = ...
val sum = sumNonEmpty(listOfIntegers) ?: error("Cannot sum empty list.")
```

As you might have noticed in the previous examples, Kotlin, unlike Python, is typed and it is typed strictly. I was advocating on using the type annotations in production Python codebases to make it clear what's being used where, but the types weren't strictly enforced in Python and so by using Kotlin I still learnt some new things about the types. For instance, that my previous [blog post](https://libka-b.github.io/2022/04/07/Mypy-generics-and-subtypes.html) is completely wrong.

## Lambdas

Often in Kotlin you can see function calls like this:

```kotlin
intCollection.map { it + 1 }
```

and at first glance I was puzzled what's going on in here - Why are there no braces `()` following the `map` call? What is he `it` variable? Looking at the [definition](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) of map function, you can see it accepts a single parameter - a lambda that transforms every element of the iterable. Using the full syntax, the call would look like this:

```kotlin
intCollection.map({ it -> it + 1})
```

But Kotlin developers added some syntax sugar. If the last parameter in the argument list is lambda, the function can be called with the lambda being outside of the braced parameters. When there are no other parameters than the lambda, the braces can be omitted completely. And last, if the lambda works with a single parameter, it's implicit name is `it`. All these decisions make the language very concise.

In Python, very often we would often use list (or set, dict, ...) comprehensions to create and transform data. For example:

```python
squaredEvenNumbers = [i * i for i in range(10) if i % 2 == 0]
```

This is cool but it might become very quickly very unreadable, especially when doing comprehension on multiple collections. Furthermore, for people not familiar with the syntax, the order of things may seem odd. In Kotlin we would achieve the same thing like this:

```kotlin
val squaredEvenNumbers = (1 until 10)
    .filter { it % 2 == 0 }
    .map { it * it }
```

Which I find pretty straightforward. On top of that, Kotlin's lambdas aren't limited to be just a single expression. The lambda's body can span multiple lines and the last line is its return value (you don't type explicit `return` in lambda).

## Extension functions and receivers

These were some cool things, but Kotlin has more features. Extension functions are one of them. When you don't like class' API (for example it's 3rd-party class that you have no control over), you can extend it to better suit your needs. Consider you import a `Point` class and you want to compute the distance from another point. You can do this:

```kotlin
data class Point(val x: Int, val y: Int)

fun Point.distance(other: Point) = sqrt(sqr(x - other.x) + sqr(y - other.y))
```

But since lambdas are used everywhere, you can also have a lambda with context like this:

```kotlin
fun foo(Point.() -> Double)
```

Now when passing the lambda, its `this` variable holds reference to its receiver, in this case `Point`. You can then call the `foo` function like this:

```kotlin
foo { sqrt(sqr(this.x) + sqr(this.y)) }
```

I've seen some codebases where this feature got so overused that things quickly got out of hand and it was nearly impossible to follow the code as there would be different receivers all over the place.

## Generics

As most of the languages, Kotlin supports generics making code reusable. I found this amazing [blog post](https://typealias.com/start/kotlin-generics/) explaining generics in general and in Kotlin. Which led me to greater understanding of the subtyping and as I mentioned earlier, why my previous blog post is wrong.

One thing I must call out is the weird syntax when you want to narrow generic type to multiple interfaces:

```kotlin
fun <T> foo(a: T): Int
    where T : A, T : B
```

I haven't needed this very often though, so maybe it's not such a problem.

## Summary

This post covers most of the things I wanted to share about Kotlin. It's not supposed to be a full feature list. Kotlin is a full blown language and it's a joy to work with, so is Python though and the way I see it, Kotlin is yet another tool in my shed.

If you want to learn Kotlin, I would recommend [Kotlin in Action](https://www.manning.com/books/kotlin-in-action) from the creators of the language. It covers all the topics in depth (although from Java's perspective) providing the resources necessary to master the language.
