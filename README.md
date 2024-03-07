# setup-uv

[![Build Status](https://github.com/yezz123/setup-uv/workflows/default/badge.svg)](https://github.com/yezz123/setup-uv/actions?query=workflow%3Adefault)

This action sets up a [uv](https://github.com/astral-sh/uv) for use in actions by installing a version of UV and adding to PATH. The action will fail if no matching versions are found.

This action supports versions of:

- Python `>=3.8`
- uv `>=0.1.2`

## Usage

### Install latest available version of UV

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-python@v4
    with:
      python-version: "3.11"
  - uses: yezz123/setup-uv@v1
  - run: uv --version
```

### Exact version of UV to install, using SemVer's version syntax

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-python@v4
    with:
      python-version: "3.11"
  - uses: yezz123/setup-uv@v1
    with:
      uv-version: "0.1.12"
  - run: uv --version
```

### Create and activate a virtual environment using uv

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-python@v4
    with:
      python-version: "3.11"
  - uses: yezz123/setup-uv@v1
    with:
      uv-venv: "your_venv_name"
  - run: uv pip install black # this command will run in the uv environment
```

## Contributing

### Create issues

You can
<a href="https://github.com/yezz123/setup-uv/issues/new" class="external-link" target="_blank">create
a new issue</a> in the GitHub repository, for example to:

- Ask a **question** or ask about a **problem**.
- Suggest a new **feature**.

**Note**: if you create an issue, then I'm going to ask you to also help others.
😉

### Create a Pull Request

You can **contribute** to the source code with Pull Requests, for
example:

- To fix a typo you found on the documentation.
- To propose new documentation sections.
- To fix an existing issue/bug.
- To add a new feature.

## License 📄

This project is licensed under the terms of the MIT License.
