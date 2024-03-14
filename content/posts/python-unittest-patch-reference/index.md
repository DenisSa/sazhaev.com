---
title: Why my patch() did not work
description: An interesting issue I ran into when writing a Python unit test
date: '2024-03-13'
draft: false
slug: '/posts/python-unittest-patch-reference'
tags:
  - python
  - testing
  - pytest
  - patch
---

I've been writing some unit tests the other day, and ran into an interesting issue

I have a piece of code that, as a part of it fetches a secret from AWS. I want to test this piece of code.

```python:title=important_code.py
from helpers.secret_fetcher import fetch_secret

def do_important_thing():
    fetch_secret()
    print("I am doing something important")
```

`fetch_secret()` is a static function defined as:

```python:title=secret_fetcher.py
def fetch_secret():
    print("I am accessing a real secret")
```

and my unit test is set up to mock `fetch_secret()`, because I don't want to actually try to fetch secrets

```python:title=test_app.py
@patch('helpers.secret_fetcher.fetch_secret')
def test_app(mock_fetch_secret):
    do_important_thing()
    assert mock_fetch_secret.called
```

So my thinking here is - I mock fetch_secret, and all is well. Right?

Nope.

```bash
 python -m pytest
======================= test session starts =======================
platform linux -- Python 3.12.2, pytest-8.0.2, pluggy-1.4.0
rootdir: /home/d/Development/scratchpad/python/unittest-patch-reference
collected 1 item

tests/test_app.py F                                         [100%]

============================ FAILURES =============================
____________________________ test_app _____________________________

mock_fetch_secret = <MagicMock name='fetch_secret' id='139633995711840'>

    @patch("helpers.secret_fetcher.fetch_secret")
    def test_app(mock_fetch_secret):
        do_important_thing()
>       assert mock_fetch_secret.called
E       AssertionError: assert False
E        +  where False = <MagicMock name='fetch_secret' id='139633995711840'>.called

tests/test_app.py:9: AssertionError
---------------------- Captured stdout call -----------------------
I am accessing a real secret
I am doing something important
===================== short test summary info =====================
FAILED tests/test_app.py::test_app - AssertionError: assert False
======================== 1 failed in 0.03s ========================
```

So looking at the output, not only did it call the real function, but it also didn't call the mock at all!

> But I've patched the function! Is this not enough?

Nope.

> What happened?

Instead of patching the function definition, we should be patching the reference to it, so in place of
`@patch("helpers.secret_fetcher.fetch_secret")` we need to have `@patch("helpers.important_code.fetch_secret")`

> Why?

To answer this question, lets take a look at address of objects in memory, as well as the initialization sequence.
For this we'll add some print statements:

```python:title=secret_fetcher.py
def fetch_secret():
    print("I am accessing a real secret")


print(f"real fetch_secret id is: {id(fetch_secret)}")
print(f"real type of fetch_secret is: {type(fetch_secret)}")
```

```python:title=important_code.py
from helpers.secret_fetcher import fetch_secret

print(f"important_code.py has imported fetch_secret with id: {id(fetch_secret)}")


def do_important_thing():
    print(f"id of fetch_secret is: {id(fetch_secret)}")
    print(f"type of fetch_secret is: {type(fetch_secret)}")
    fetch_secret()
    print("I am doing something important")
```

```python:title=test_app.py
from unittest.mock import patch
from helpers.important_code import do_important_thing
from helpers.secret_fetcher import fetch_secret

print(f"in pre-test imported fetch_secret id is: {id(fetch_secret)}")


@patch("helpers.secret_fetcher.fetch_secret")
def test_app(mock_fetch_secret):
    print(f"in test_app() id of fetch_secret is: {id(fetch_secret)}")
    do_important_thing()
    assert mock_fetch_secret.called


```

Lets run the test again:

```bash
 python -m pytest -s
======================= test session starts =======================
platform linux -- Python 3.12.2, pytest-8.0.2, pluggy-1.4.0
rootdir: /home/d/Development/scratchpad/python/unittest-patch-reference
collecting ... real fetch_secret id is: 139637776270336
real type of fetch_secret is: <class 'function'>
important_code.py has imported fetch_secret with id: 139637776270336
in pre-test imported fetch_secret id is: 139637776270336
collected 1 item

tests/test_app.py in test_app() id of fetch_secret is: 139637776270336
in do_important_thing() id of fetch_secret is: 139637776270336
in do_important_thing() type of fetch_secret is: <class 'function'>
I am accessing a real secret
I am doing something important
F

============================ FAILURES =============================
____________________________ test_app _____________________________

mock_fetch_secret = <MagicMock name='fetch_secret' id='139637775989072'>

    @patch("helpers.secret_fetcher.fetch_secret")
    # @patch("helpers.important_code.fetch_secret")
    def test_app(mock_fetch_secret):
        print(f"in test_app() id of fetch_secret is: {id(fetch_secret)}")
        do_important_thing()
>       assert mock_fetch_secret.called
E       AssertionError: assert False
E        +  where False = <MagicMock name='fetch_secret' id='139637775989072'>.called

tests/test_app.py:13: AssertionError
===================== short test summary info =====================
FAILED tests/test_app.py::test_app - AssertionError: assert False
======================== 1 failed in 0.02s ========================
```

From the output we see that the object id of `fetch_secret` is consistently `140109394215936`. we NEVER use the mocked object.

A clue is the order in which the messages are printed.

```title=order of imports
    1. (secret_fetcher.py) real fetch_secret id is: 139637776270336
    2. (important_code.py) has imported fetch_secret with id: 139637776270336
    2. (test_app.py) pre-test imported fetch_secret id is: 139637776270336
    3. (test_app.py) test_app() id of fetch_secret is: 139637776270336
    4. (important_code.py) do_important_thing() id of fetch_secret is: 139637776270336
```

Pay attention to how early `important_code.py` imports `fetch_secret` - we had no chance to patch it so early, and our mock does not replace the original object!

Now, lets patch correctly with `@patch("helpers.important_code.fetch_secret")` and see what happens

```bash
 python -m pytest -s
======================= test session starts =======================
platform linux -- Python 3.12.2, pytest-8.0.2, pluggy-1.4.0
rootdir: /home/d/Development/scratchpad/python/unittest-patch-reference
collecting ... real fetch_secret id is: 139748469163008
real type of fetch_secret is: <class 'function'>
important_code.py has imported fetch_secret with id: 139748469163008
in pre-test imported fetch_secret id is: 139748469163008
collected 1 item

tests/test_app.py in test_app() id of fetch_secret is: 139748469163008
in do_important_thing() id of fetch_secret is: 139748483057472
in do_important_thing() type of fetch_secret is: <class 'unittest.mock.MagicMock'>
I am doing something important
.

======================== 1 passed in 0.02s ========================
```

Interesting!

We've retained the old object id throughout, with exception of where we've explicitly patched it for `helpers.important_code.fetch_secret`
This means that the specific call to `fetch_secret` from within `important_code.py` has been replaced with our mocked function - without it we'd still be calling the original function, as it has been imported during initialization.

Now when we perform the assertion, we correctly validate that the mock with id of `139748469163008` has been called!
