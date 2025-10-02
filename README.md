```
cd restart-app && npm i && pear stage dev && cd ..
```

then replace the stageLink in ./index.js line 11

```
# in another terminal for logs
pear -M sidecar 
```

```
pear run .
```