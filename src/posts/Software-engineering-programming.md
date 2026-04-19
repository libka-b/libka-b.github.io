---
layout: layouts/article.html
title: 'Software Engineering'
date: '2025-04-19'
---

Oftentimes when I tell someone that I am a software engineer, the reaction would be "Wow, you must be coding all the time.". I'd like to devote a whole series of articles to what I think it means to be a software engineer and each of the articles will focus on a single individual aspect of it. In this first article, I'll give a high-level overview of what software engineering is (in my opinion) and will follow up with articles on each individual part.

<!-- excerpt -->

## Lifecycle of software

Software engineering is about managing the whole software lifecycle. It starts with understanding the requirements and how those can be modeled as software. Since software has its own limitations (CPU, memory, costs, reasonable time for a response, etc...) the model can only be an approximation of how things work in real life. However, the software should be created with extensibility in mind. This means that we expect it to evolve in the future. Best practices must be applied and maintained. This is the part where we design the software on paper, how it should work high-level, describing the system as a whole and some of its most crucial parts, without going to every detail of it. This includes how components are going to communicate, for example with other APIs, databases, caches, etc... It's impossible to predict all the problems we would encounter when actually implementing it, so this is typically optimistic design.

After design, it's time for the actual implementation. This is the part where the actual coding happens. For the implementation, it's crucial to understand the trade-offs of different data structures and their impact on performance. Is it acceptable to use more memory and reduce the time it takes to compute, or is the time not a problem but memory is constrained? The individual classes must be created so that they can work together cleanly and that they can be tested. This includes knowing how the dependency injection works, as well as knowing design patterns to compose the components and split responsibilities so that data accessors are separated from the business logic. Existing code also evolves over time, with new requirements which drive new changes and might require refactoring or addressing technical debt.

Once the software is finished (programmed), it must be tested. The testing involved depends on how reliable the software we are trying to deliver needs to be. If it's a toy application, or MVP (minimal viable product), maybe the test suite doesn't matter so much. As the software reaches its maturity, which means it has many users, generates solid revenue, it matters more for it to be reliable and must be more thoroughly tested for the scale of its usage.

Tested software must be delivered. This means different things for different kinds of software. The application must be packaged and distributed in a way that users can download the binary and use it on their device (for example via Google Play Store on their Android device). If it's a web service, it must be deployed. Ideally, the deployment process is able to determine runtime issues and rollback in case a new change breaks the system.

With the deployment, it's crucial to have a solid infrastructure. Again, for web services that means redundancy (if one data center breaks, the application is still available because another copy runs in another data center), reliability (automated failover) and observability (metrics, logs, etc...). We need to analyze metrics, understand different types of statistics and react to them or proactively make updates to prevent future issues.

When the service is running or application is being used, we need to be able to collect metrics and logs and be able to use them as a feedback loop to understand whether the software is misbehaving, what's its usage, whether we are about to hit some limits, to debug any issues that inevitably occur when running, and in general be able to improve the application over time. This is the maintenance part and every piece of software, once being used, enters this phase and has to be kept alive. Typically, engineering teams do on-call rotations to make some person available when it blows up and needs quick mitigation.

## Conclusion

Software engineering indeed involves coding but it's just a fraction of what's done on the job. It requires talking to customers, other teams, reading lots of documentation. It means writing design documents, reviewing and reading code. Looking into graphs and dashboards, testing and fixing problems. It requires constant learning to stay up-to-date with the new technologies, methodologies, languages, etc...
