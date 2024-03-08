---
title: Why my mock did not work
description: An interesting issue I ran into when writing a Python unit test
date: '2024-03-07'
draft: false
slug: '/knowledge_base/python-unittest-patch-reference'
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

```yaml:title=docker-compose.yml
Hello world
```
