---
layout: layouts/article.html
title: 'Mypy generics and subtypes'
date: '2022-04-07'
---
Type `Optional[bool]` can be one of three values - `None`, `True` or `False`.
Type `bool` can be one of `True` or `False`. So we can easily say that
`bool` is subtype of `Optional[bool]`, right? Let's see what happens when
we start nesting these types.

<!-- excerpt -->

Recently, I was writing a code that I was sure would pass mypy checks, but it didn't.
Let's look at minimal example of such code:

```python
from typing import List, Optional


def filter_out_nones(opt_bool_list: List[Optional[bool]]) -> List[bool]:
    ...


if __name__ == "__main__":
    bool_list: List[bool] = []
    bool_list = filter_out_nones(bool_list)  # mypy fails here
```

If you run mypy on a script like this, even without strict mode it outputs this error:

```
script.py:10: error: Argument 1 to "filter_out_nones" has incompatible type "List[bool]"; expected "List[Optional[bool]]"
script.py:10: note: "List" is invariant -- see https://mypy.readthedocs.io/en/stable/common_issues.html#variance
script.py:10: note: Consider using "Sequence" instead, which is covariant
Found 1 error in 1 file (checked 1 source file)
```

If my function can operate on list of `Optional[bool]`, I would expect it
to be able to also operate on `bool`. So what's the problem here?

To illustrate the issue, I will create a new generic class, where we 
can see more easily what's happening.

```python
from typing import Generic, List, Optional, TypeVar


T = TypeVar("T")


class MyList(Generic[T]):
    ...


def filter_out_nones(opt_bool_list: MyList[Optional[bool]]) -> MyList[bool]:
    ...


if __name__ == "__main__":
    bool_list: MyList[bool] = MyList()
    bool_list = filter_out_nones(bool_list)

```

And see what's being substituted where. The function `filter_out_nones` accepts
type `MyList[T]`, where `T = Optional[bool]`, which could also be written 
as `U[T] = Optional[bool]` and we are passing type `MyList[T]` where `T = bool`.
Now, we can easily see, that `U[T] != T`, and even though `bool` is subtype of
`Optional[bool]`, it doesn't apply in general that type `T` is subtype of type `U[T]`
and mypy doesn't do this kind of deep analysis. Therefor it just say we are passing 
incompatible types (and in a way its true).

Just for comparison - `int` is subtype of `float` (no nested generics) and it works:

```python
from typing import List


def some_func(floats: List[float]) -> List[float]:
    ...



if __name__ == "__main__":
    some_func(list(range(3)))
```

## How to solve this

To persuade mypy to believe us, simply use [`cast`](https://docs.python.org/3/library/typing.html#typing.cast):

```python
from typing import List, Optional, cast


def filter_out_nones(opt_bool_list: List[Optional[bool]]) -> List[bool]:
    ...


if __name__ == "__main__":
    bool_list: List[bool] = []
    bool_list = filter_out_nones(
        cast(List[Optional[bool]], bool_list)
    )  # everything's fine
```
