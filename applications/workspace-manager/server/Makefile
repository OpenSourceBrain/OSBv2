CURRENT_HEAD=$(shell git show-ref --head --hash head)
PYTHON_VERSION:=$(shell \
    if [ ! -z "$(shell which python3.7)" ]; then \
        echo "python3.7"; \
    else \
        echo "python3"; \
    fi)

PYTHON_ALIAS:=$(shell \
    if [ "$(PYTHON_VERSION)" = "python3.7" ]; then \
        echo "py37"; \
    else \
        echo "py3"; \
    fi)

DEPS:=requirements.txt
VENV:=venv
TOX:=$(VENV)/bin/tox
PYTHON:=$(VENV)/bin/python
PIP:=$(VENV)/bin/pip

DOCS_ROOT=docs
DOCS_BUILD_DIR=docs/_build
DOCS_APIDOC_DIR=docs/_apidoc
SPHINX_BUILD=$(VENV)/bin/sphinx-build -M $* $(DOCS_ROOT) $(DOCS_BUILD_DIR)
SPHINX_APIDOC=$(VENV)/bin/sphinx-apidoc -o $(DOCS_APIDOC_DIR) src/

.PHONY: pyclean docsclean clean deps tox test lint isort

$(VENV):
	$(PYTHON_VERSION) -m venv $(VENV)
	$(PIP) install -r $(DEPS) --no-cache-dir

pyclean:
	find . -name *.pyc -delete
	rm -rf *.egg-info build
	rm -rf coverage.xml .coverage

clean: pyclean docsclean
	rm -rf $(VENV)

deps: $(VENV)
	$(PIP) install -r $(DEPS)

run: $(VENV)
	$(PYTHON) -m wsmgr

#------------------------------------------
# Docs shortcuts
#------------------------------------------

# docs/latexpdf , docs/html
docs/%: $(VENV)
	$(SPHINX_APIDOC)
	$(SPHINX_BUILD)

docsclean: $(VENV)
	rm -fr $(DOCS_APIDOC_DIR) $(DOCS_BUILD_DIR)

#------------------------------------------
# Shortcuts for tox provided functionality
#------------------------------------------

tox: $(VENV)
	$(TOX)

test: $(VENV)
	$(TOX) -e $(PYTHON_ALIAS)

lint: $(VENV)
	$(TOX) -e lint
	$(TOX) -e isort-check

isort: $(VENV)
	$(TOX) -e isort-fix
