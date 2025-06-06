---
layout: layouts/article.html
title: 'Kover Kotlin code coverage'
date: '2025-02-13'
---

I am working on a Kotlin project that has lot of branching in the code and as such it's difficult to even estimate which parts are covered by unit tests and which parts are missing. The task at hand was to find a tool that would generate test coverage report for me and ideally would be configurable and plugable into the CI pipeline. I was aware of [JaCoCo](https://github.com/jacoco/jacoco) but had bad experience with it, as it mingles the generated bytecode and can break some libraries. Instead, I searched a novel approach, and found [kotlinx-kover](https://github.com/Kotlin/kotlinx-kover) developed by JetBrains.

<!-- excerpt -->

## What is code coverage for?

Code coverage tools follow the execution path of each unit test run and keep track of lines of code covered, partially covered and not covered at all. Covered and not covered are obvious - either the code executes that line of code or not. What does it mean partially covered though? This happens in cases when the code branches and not all branches are covered. For example, consider this piece of code:

```kotlin
fun foo(test: Boolean = true) {
    if (test) {
        // do something
    } else {
        // do something else
    }
}
```

In case the `test` variable is always `true` in the tests, the `else` branch never gets executed and therefore the `if` line is only partially covered.

Code coverage tools usually support reporting of coverage in various formats, such as HTML, XML, etc..., failing tests when the code coverage is below configurable threshold, exclude certain parts of the code base - classes, functions, individual lines of code - this is useful when part of the code base fundamentally cannot be code covered. Example would be an interface that is part of a library and is meant to be implement in the code using the library.

As part of engineering excellence, tools like code coverage, linters, formatters etc... should be configured and run as part of the [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) (CI) process of every production code base. They play crucial role in enforcing certain rules that should be agreed upon within the development team and when not passing, the change should be rejected. This also means, that it should be fairly simple to set them on most of the projects.

## Setting up Kover for Kotlin project

Setting up Kover for my project wasn't smooth experience at all. Perhaps it's because the project is still in it's Beta phase. Funny enough, gooogling examples and asking chatgpt all gave me examples that were no longer working. The [documentation](https://kotlin.github.io/kotlinx-kover/gradle-plugin) is one long HTML page where lot of things repeat at the beginning and the useful stuff is scattered in the end. Perhaps I am too spoiled from working with Python libraries where things were usually explained in great detail. Anyway, due to my struggle to set up and configure Kover for my project, I decided to write this blog.

As the first thing, we need to add the plugin to our project. Add this line to the `plugins` section in `build.gradle.kts`:

```kts
id("org.jetbrains.kotlinx.kover") version $KOVER-VERSION
```

At the time of writing this post, the Kover version is `"0.9.1"`.

Next, we need to configure the tool. All the useful configuration happens in `kover.reports`. On a new line within the `build.gradle.kts` add this and everything that I will be referring to next will go to the curly braces:

```kts
kover.reports {
}
```

To make Kover fail when it's below certain threshold (e.g. 50%), add this:

```kts
verify {
    rule {
        minBound(50)
    }
}
```

One thing I found extremely bad was how the documentation referred to creating new html directory to save the report to. Following that didn't work and was frustrating. Here's how to do it (and I am sure there are other ways too):

```kts
total {
    html {
        val reportPath = file("kover-report")
            .also { if (!it.exists()) it.createDirectory() }

        title = "html-report"
        onCheck = false
        htmlDir = reportPath
    }
}
```

After this, adding exclusion filters for certain classes is piece of cake. Simply add these lines:

```kts
filters {
    excludes {
        classes("org.example.myapp.MyAwesomeClass")
    }
}
```

Now, this is not enough as running `./gradlew test` won't fail even if you don't have any tests and it won't generate any reports. Let's fix that by adding this line to the `tasks.test` (I hope you have tests task in your project :)):
```kts
finalizedBy("koverHtmlReport", "koverVerify")
```

The final `build.gradle.kts` should look something like this (omitting stuff outside of this blog):

```kts
import org.jetbrains.kotlin.incremental.createDirectory

plugins {
    ...
    id("org.jetbrains.kotlinx.kover") version "0.9.1"
}

tasks.test {
    ...
    finalizedBy("koverHtmlReport", "koverVerify")
}

kover.reports {
    verify {
        rule {
            minBound(90)
        }
    }

    total {
        html {
            val reportPath = file("kover-report")
                .also { if (!it.exists()) it.createDirectory() }

            title = "html-report"
            onCheck = false
            htmlDir = reportPath
        }
    }

    filters {
        excludes {
            classes("org.example.lox.visitor.PrintingVisitor")
        }
    }
}
```

## Summary

CI tools are absolute must to enforce development rules and code coverage is definitely one of those tools. However, setting up Kover as code coverage for Kotlin projects is not as easy as it could be. Hopefully, the documentation will improve as the tool becomes production ready.

One final though - although this post is about code coverage, it's important not to overdo it. It's important to write unit tests and it's important to cover the important code paths. It's nonsensical, however, to aim for 100% code coverages, or similar numbers. Good balance and common sense should always be applied when setting up bar for how much code should be covered by tests.
