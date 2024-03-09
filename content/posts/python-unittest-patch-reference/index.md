---
title: Why my mock did not work
description: An interesting issue I ran into when writing a Python unit test
date: '2024-03-08'
draft: false
slug: '/posts/python-unittest-patch-reference'
tags:
  - python
  - testing
---

I've been writing some unit tests the other day, and ran into an interesting issue

I have a piece of code that fetches a secret from AWS that I wanted to test

```python:title=important_code.py
from helpers.secret_fetcher import fetch_secret

def do_important_thing():
    fetch_secret()
    print("I am doing something important")
```

`fetch_secret()` is a static function defined like this:

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

Instead of patching the function definition, we should be patching the relative location of it.
