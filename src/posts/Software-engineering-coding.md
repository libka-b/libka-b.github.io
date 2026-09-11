---
layout: layouts/article.html
title: 'Software Engineering: Coding'
date: '2026-09-10'
---

This is the first follow up on my previous [post](Software-engineering-programming.md). In that post, I started by talking about the design but I'd like to kick off this series with the coding and get back to the design as a later part. The reason being that although coding is not the thing engineers spend most time doing, it's still the part that everything else builds up on. That's mostly because understanding the code in depth means the engineers create their own internal model of the application and its ecosystem that enables them to make quick decisions and informed trade-offs.

<!-- excerpt -->

## What does it mean to be a programmer?

From the outside world it might seem that programming is just a single discipline conveying that the person "writes code". Although true, there are many nuances to it. Even at the code level there are different perspectives a person can take. At the very detail, they might be optimizing certain code paths just to squeeze the most out of their compute power. Zooming a bit out, they might want to create a class that reads like a book. And zooming out a bit more, the goal might be a perfect cooperation between individual components. In case of libraries (or modules, packages, etc...) the goal might be to provide APIs that are nice to work with. Let's break this down, from the very detail to the higher level view.

### Algorithms and data structures

It's not common to implement algorithms in the production code and rather use well established libraries to achieve the same. Typically, researching algorithms and data structures is done in academia. However, it's still fundamental for the developers to know what to use and when. Knowing if I am going to be accessing an array (or list) or a map requires knowing the trade-offs (speed vs storage) and what is required to do with the data at hand.

Even when using higher level languages where the developer is abstracted away from the concrete implementation (how many bytes is my integer, how is string implemented, how memory is allocated, etc...), knowing what the time and space complexity of the chosen algorithms are is fundamental as that affects the speed (or memory usage) of the application being developed. Since there are so many different data structures and each has different pros and cons, it usually takes time to develop a proper intuition to know what to use and when.

### Encapsulation and types

Encapsulation may sound a bit strange but that's exactly what it is. Classes in imperative languages allow us to encapsulate certain logic in them and expose methods to work with them. This may be an array exposing a sort method that returns sorted array. It doesn't expose how nor does it expose the intermediate state. This is crucial for making sure the state of the program is always consistent to help us reason about it. Another example would be a class for emitting metrics that exposes an `increment` method but doesn't expose the recorded metrics. It does take care of e.g. regularly flushing them and provides functionality for graceful shutdown.

Ideally, classes should always expose immutable data and mutate the state in their private methods to prevent unintended mutations leading to inconsistent states.

Classes are concrete implementation but in higher-level languages we can usually also specify types, or interfaces, which tell us what we can do with it but the specific implementation is not provided. Think about a data access object, it might have method `getData` but then might be implemented differently depending on the call site. For example, tests might just mock the object, the development environment may provide a local file reader and production code might be calling real database and all that is hidden behind the interface as we don't need to know the details of the 'how' as long as we know the 'what'.

### Design patterns

Classes and types allow us to organize our code into larger building blocks. We still need to carefully design how those blocks are going to interact, how the data is going to flow through the program and how the different classes are constructed during the runtime, how the data is cached, what objects can be lazy, etc... For that, it's crucial to understand the design patterns and know when to apply which.

Should I build this object using builder pattern or DSL? Can I use visitor pattern for traversing recursive data structures? How can I track lots of small objects?

These are all questions that are quite simple to answer when knowing the design patterns. Personally, I recommend the book Design Patterns by "The Gang of Four". Although a bit older, the information there is not outdated.

### Concurrency

When we have all the building blocks communicating together we would usually scale or optimize the application to be able to handle more work and do it faster by doing things concurrently (does not necessarily mean parallel). This can be achieved in multiple ways, by using virtual or OS threads or by handling some tasks asynchronously.

Concurrency is an endless source of bugs and errors and the best way to prevent them is to avoid concurrency at all. However, it's often the way to squeeze way higher performance from the application. The second best way is to carefully design the application to prevent sharing mutable state between threads, entering deadlocks and other things hard to debug.

### Error handling

Knowing how to properly handle errors requires knowing which errors are fatal and which are recoverable. Recoverable errors (such as HTTP 503) mean the resource is temporarily unavailable due to failure of downstream dependency (for example database failover) and we should just wait a little bit more and try again. This can be implemented using the exponential retry backoff with jitter to prevent storming our dependencies in case of cascading failures. When the error is not recoverable, the application should fail gracefully, ideally providing some useful information as to why.

### Dependency injection

When all the building blocks are in place, we still need some entry point starting our application. Small applications can just do everything in their `main` function but as the application grows larger and larger and there might be different modes of running it, it's much better to follow the best practices of dependency injection and make sure to pass all the objects needed for another one to instantiate rather than having the object instantiate its dependencies.

When I say different modes of running the application, I mean even testing it. If it's hard to unit-test some class, it's typically indicating some problem with how the dependencies are treated in that class. DI frameworks can usually determine the dependency between the objects, so the developers don't need to think about this.

### API design

At the very high-level of the application, when we treat it as a complete blackbox not knowing how its internals work, we expose some APIs so that we can communicate with it. APIs, just like functions, methods or variables, should have a name well describing what they do and ideally they should do just one thing and do it well. They should always be designed with extensibility in mind as backward-incompatible changes would require migrating all the clients to different APIs which usually takes much longer than anticipated. For that reason, you may see APIs that don't really need any parameters accepting empty objects. This is because if we started with no parameters at all, adding a new one would be a breaking change. Starting with an empty object allows us to add a non-required parameter in the future.

### Language ecosystem

Every mature language comes with an ecosystem - build system, dependency resolution, package manager, bundler, etc... It's one thing to understand the language's syntax and another to know its ecosystem. Both are extremely important when the goal is to become a good engineer though.

### Conclusion

Writing code may seem boring but if you are like me and many others, it's exciting and there are endless opportunities to explore and master at every level of detail. Everything above takes years of practice, from squeezing a hot loop to shaping an API that clients will live with for a decade. Exposure to these challenges is what turns it into real understanding and no bootcamp can really prepare for this. Learning the language syntax may take just a couple weeks but turning that into intuition requires doing and failing.

This is exactly where AI, as it stands today, falls short. It's remarkably good at producing code but it's up to the engineer to actually decide where a level of indirection via abstraction is needed or where certain patterns should be used. AI still lacks the bigger picture, the mental model of the system, its history and where it's heading. Without that model it can't reliably tell what trade-offs to make. That's why investing time in the above and taking time to understand it is not a waste of time or hobby thing to do, as many authors and companies tend to claim. Quite the opposite, it's a real must and the good news is that AI, if used well, can actually help with that!
