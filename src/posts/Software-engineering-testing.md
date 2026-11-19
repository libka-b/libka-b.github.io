---
layout: layouts/article.html
title: 'Software Engineering: Testing'
date: '2026-09-21'
---

This is the third article in the series about software engineering, following up on the [overview](Software-engineering-programming.md) and [coding](Software-engineering-coding.md). The only way to keep software behaving as expected across changes is via an extensive test suite. Testing should be like a pyramid, there is the large base layer on top of which we build smaller and smaller additional layer up to the very top. This analogy can be used to describe going from unit testing to the end-to-end (E2E) testing. However, there are also other kinds of tests that I'd like to mention here. All of these increase the overall confidence in the correctness of the software being shipped, although one can never be sure :)

<!-- excerpt -->

## General notes

Every serious software should be tested and the more important the software is the more extensive test suite it should come with. Many claim that we should spend about the same time writing code as we spend testing. I would agree with this. There are many tools that help determine what code is tested line-by-line and can help reach high test coverage. Some would even say that since we have such tools, we should aim to reach 100% test coverage. I think that's a little overboard as reaching every invalid state might take too much effort (although AI can help with that quite a bit). Generally, at least the important logic pieces of the code should be covered by tests.

Testing can also help improve the overall quality of the code and architecture. It may be an indicator of improperly setup dependency injection if it's hard to setup tests. Many languages already come with strong testing frameworks, providing mocking and spying capabilities, setups and teardowns. I am also big fan of using parameterized tests to reuse as much setup for testing rather than repeating the same logic in every test.

As a remark and to illustrate the importance testing is, some engineering teams even have dedicated testers, often referred to as Quality Assurance Engineers, whose sole job is to make sure the software is correct. Although in my 11 years career I am seeing rather decline in demand for such roles, mostly because the work is now absorbed by Software Engineers who have to be more of generalists.

## Unit testing

Unit testing is meant to test the smallest portions of the code in isolation, providing fake objects as a dependencies, typically mocks or spies. Many of the test frameworks have a way to do so, so that we can focus on writing the actual tests instead. Mentioned mocks allow us to return some predefined data on certain method calls, while spy objects record the method calls including the parameters. This is to simulate that if my dependency returns this data, my system behaves as expected. Similarly, the spy objects can be used to make sure that the right method call was performed. The goal here is to test each individual (public) method and function to assert correct behavior.

Unit tests should capture all the intended behavior and when we find a bug, the flow should be to create a test that captures the behavior but fails and only after the actual code should be corrected, making sure the tests pass thereafter. Some go even as far as to write interfaces first, followed by tests capturing the intended behavior and only after then filling in the actual logic. This technique is known as Test Driven Development (TDD).

### Property based testing

There are some other more advanced techniques to unit testing. For example, property-based testing where we specify invariants of the system under test that must always hold true, and the framework engine generates arbitrary inputs to assert correct behavior. Say, we implement our own sorting algorithm and want to test that it works correctly, many languages typically have some sorting algorithm implemented, so they can be used for comparison. We can then instruct the engine to generate inputs (for example, arbitrarily long arrays of arbitrary integers) and sort it with our implementation vs standard implementation to uncover any corner cases.

## Functional testing

For this kind of testing, we treat the application as a black box. We define what an expected output looks like for given input without looking at what it does inside. Think, for example, of using calculator to compute the square root of a number, we would typically not care how it arrives at the result and just take whatever it gives us.

The application must be well structured in order to be functional testable as all the external dependencies must be faked one way or another. It may seem like a lot of effort but can be extremely helpful in situations when we know the data entering the system and what we can expect. This approach can further be used for debugging application, because all the dependencies are faked and thus the system behaves the same (or it should) for the same inputs. There would usually be an order of magnitude less tests than that of unit tests.

## Integration testing

Integration testing is the first in this pyramid that actually works with the live dependencies. For example, we might want to be testing that our application starts, that we can connect to it, that the clients configuration is correct and the client can get some response. This kind of testing may vary heavily based on the system under test. For example, if I am testing an application that has a lot of dependencies and performs computation based on the data returned from those, it might be wise to test that it simply returns _some_ response, otherwise the test may break anytime a dependency changes its data. However, if testing a CRUD service, it might be simple enough to follow some sort of tests (entry doesn't exist, create entry and make sure it exists, delete entry and make sure it doesn't exist, etc...). There are many types of services and each requires different kinds of integration testing but one thing holds, it typically involves interaction between services or between clients and service, etc...

## End-to-end testing

Also know as E2E testing, is testing of a software in a larger picture making sure everything "clicks" and all the interactions were done right. Because it requires coordination between other systems (perhaps owned by other teams or even third party dependencies) this kind of testing takes time to prepare, execute and evaluate and as such is typically harder to automate and slower to run.

E2E testing is usually the top of the testing pyramid and the following sections describe other kinds of tests.

## Fuzz testing

When dealing with code where creating a test case for every code path is not possible (think for example recursive data structures of unrestricted depth) we still need to be able to come up with potential failure scenarios and see how they are handled. For that, there are so called fuzzers that generate various inputs and observe and report system's behavior.

## Shadow (correctness / regression) testing

When we have two versions of the same system (perhaps migrating from one language to another, or developing a new feature) and we want to ensure parity between the two, the most relyable way is to mirror production requests, route them to the two versions of the same system and compare their response. The criteria of correctness will differ per specific system also dependening whether we're dealing with evantual consistencies etc... Based on that, we may omit some fields from the comparison (e.g. when timestamp is irrelevant) and may need to setup passing threshold, like 99.9% of request parity.

Use cases of such a testing span all kinds of migrations (system, feature, configuration) or when introducing a new code version, making sure that new features don't break the old ones. Whenever differences are found it usually requires inspecting the changes and the differing systems and sometimes lead to discovering very subtle and surprising bugs.

## Stress testing

When stress-testing a service the goal is to find how the service behaves under stress. It's crucial to a predictable and repeatable environment and ideally run it periodically. This kind of testing should help us find the limits and boundaries of the service and ultimately result in adjusting scaling targets, review performance metrics and discover bottlenecks in the service. It also helps us find how long it takes for the system to recover after a failure from stress.

## Load testing

For mission critical systems, it's crucial to find out how the system behaves under load (for example how the latency changes with the load). This should result in having proper performance metrics and alarms in place to know when the service is approching it's limits.

## A / B testing

Sometimes we want to roll out a feature but aren't sure what the impact of it would be (for example does it work properly with the other systems, do customers like it, does it fix a problem, etc...). For that scenario there's an A / B testing where given some controller, we change the behavior of some % of requests (or customers, hosts, etc...) to the new feature while the rest staying on the old behavior. This should result in emitting some kind of metrics that can be analyzed and used to deciding whether higher the feature should be rolled forward or back. This is extremely useful in high stakes environments where the change may have potentially devastating consequences or for experimenting with new features (think how often your favorite social media suddenly behaves differently).

## Conclusion

There are many kinds of tests (this is far from exhaustive!) each adding on confidence on different level of development or running the application. For small applications it would be an overkill to implement all of these but if you're running a mission critical application with millions of users or requests per second, it may be a good idea to actually take time and implement all of these (and more if needed). I often hear people saying that AI is very good at generating tests but I would be careful there. There can be many tests but their overall value be minimal. In other words, tests are only good if they test the right thing.
