# Biomodels copy task


How to test

```
shared_directory=/tmp folder=osbv2/develop url=BIOMD0000000998.9 ./run.sh
```

The above should checkout the file README.md and the full directory applications/workspaces inside /tmp/osbv2/develop


```
shared_directory=/tmp folder=osbv2/develop url=https://github.com/OpenSourceBrain/OSBv2 branch=develop paths= ./run.sh
```
This should checkout the whole repo
